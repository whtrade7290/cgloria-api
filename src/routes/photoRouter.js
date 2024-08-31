import express from 'express'
import {
  getPhotoList,
  totalPhotoCount,
  getPhotoContent,
  writePhotoContent,
  logicalDeletePhoto,
  editPhotoContent
} from '../services/photoService.js'
import { upload, uploadToS3, deleteToS3 } from '../utils/multer.js'

const router = express.Router()

router.post('/photo', async (req, res) => {
  const { startRow, pageSize } = req.body

  const data = await getPhotoList(startRow, pageSize)
  res.send(data)
})

router.get('/photo_count', async (req, res) => {
  const count = await totalPhotoCount()
  res.json(count)
})

router.post('/photo_detail', async (req, res) => {
  const { id } = req.body
  try {
    const content = await getPhotoContent(id)
    if (!content) {
      return res.status(404).json({ error: 'Photo not found' })
    }

    res.json(content)
  } catch (error) {
    console.error('Error fetching photo:', error)
    res.status(500).json({ error: 'Error fetching photo' })
  }
})

router.post('/photo_write', upload.array('fileField', 6), async (req, res) => {
  const { title, content, writer } = req.body
  let pathList = {}

  const pathListPromises = req.files.map(async (file) => {
    try {
      // 파일을 S3에 업로드
      return await uploadToS3(file)
    } catch (error) {
      console.error('S3 업로드 중 오류 발생: ', error)
      return null // 실패한 경우 null을 반환하거나 적절한 처리를 합니다.
    }
  })

  try {
    // 모든 업로드가 완료될 때까지 기다림
    pathList = await Promise.all(pathListPromises)
    // results 배열에 업로드 결과가 담겨 있음
    console.log('업로드 결과:', pathList)
    // 업로드 결과를 처리하는 로직을 추가합니다.
  } catch (error) {
    console.error('파일 업로드 중 오류 발생: ', error)
  }

  try {
    const result = await writePhotoContent({
      title,
      content,
      writer,
      files: JSON.stringify(pathList)
    })

    if (result) {
      // result가 truthy일 때 성공 응답
      res.status(200).json({ success: true, message: 'Upload Success' })
    } else {
      // result가 null 또는 falsy일 때 실패 응답
      res.status(400).json({ success: false, message: 'Upload Failed' })
    }
  } catch (error) {
    console.error('Error fetching:', error)
    res.status(500).json({ error: 'Error fetching photo' })
  }
})

router.post('/photo_delete', async (req, res) => {
  const { id, deleteKeyList = '' } = req.body;
  console.log('deleteKeyList: ', deleteKeyList);

  if (deleteKeyList !== '') {
    const deleteKeyArr = deleteKeyList.map(file => {
      return `cgloria-photo/${file?.date}${file?.filename}${file?.extension}`;
    });

    const response = (await deleteToS3(deleteKeyArr)).every((result) => {
      console.log('deleted file: ', result);
      return result.$metadata.httpStatusCode === 204;
    });

    if (response) {
      try {
        const result = await logicalDeletePhoto(id);

        if (!result) {
          return res.status(404).json({ error: 'Photo not found' });
        }
        res.json(!!result);
      } catch (error) {
        console.error('Error fetching Photo:', error);
        res.status(500).json({ error: 'Error fetching Photo' });
      }
    } else {
      // S3에서 파일 삭제 실패 시 처리
      console.error('Error deleting files from S3');
      res.status(500).json({ error: 'Failed to delete files from S3' });
    }
  } else {
    res.status(400).json({ error: 'No files to delete' }); // 필수 필드가 없는 경우 처리
  }
});


const uploadFields = upload.fields([
  { name: 'deleteFile', maxCount: 6 }, // 'deleteFile' 필드에서 최대 6개의 파일 허용
  { name: 'fileField', maxCount: 6 } // 'fileField' 필드에서 최대 6개의 파일 허용
])

router.post('/photo_edit', uploadFields, async (req, res) => {
  const { title, content, id, deleteKeyList = '' } = req.body
  let pathList = {}

  const files = req?.files['fileField'] ?? []

  /**
   * ※ 사양 확인 후 적용 ※
   * 게시글 사진 수정시 파일 삭제 되도록 하는 로직
   */

  if (deleteKeyList !== '' && files.length > 0) {
    const deleteKeyArr = deleteKeyList.split(',')

    console.log('deleteKeyArr: ', deleteKeyArr)

    const response = (await deleteToS3(deleteKeyArr)).every((result) => {
      console.log('deleted file: ', result)
      return result.$metadata.httpStatusCode === 204
    })

    if (response) {
      // 새로운 파일 업로드
      const pathListPromises = files.map(async (file) => {
        try {
          // 파일을 S3에 업로드
          return await uploadToS3(file)
        } catch (error) {
          console.error('S3 업로드 중 오류 발생: ', error)
          return null // 실패한 경우 null을 반환하거나 적절한 처리를 합니다.
        }
      })

      try {
        // 모든 업로드가 완료될 때까지 기다림
        pathList = await Promise.all(pathListPromises)
        // results 배열에 업로드 결과가 담겨 있음
        console.log('업로드 결과:', pathList)
        // 업로드 결과를 처리하는 로직을 추가합니다.
      } catch (error) {
        console.error('파일 업로드 중 오류 발생: ', error)
      }
    }
  }

  const data = {
    id,
    title,
    content
  }

  if (pathList) {
    const files = pathList.map((path) => {
      return {
        filename: path.filename,
        date: path.date,
        extension: path.extension
      }
    })
    console.log('files: ', files)
    Object.assign(data, { files: files })
  }

  console.log('data: ', data)

  try {
    const result = await editPhotoContent(data)

    if (!result) {
      return res.status(404).json({ error: 'Sermon not found' })
    }
    res.json(!!result)
  } catch (error) {
    console.error('Error fetching:', error)
    res.status(500).json({ error: 'Error fetching sermon' })
  }
})

export default router
