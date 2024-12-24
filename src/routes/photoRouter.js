import express from 'express'
import {
  getPhotoList,
  totalPhotoCount,
  getPhotoContent,
  writePhotoContent,
  logicalDeletePhoto,
  editPhotoContent
} from '../services/photoService.js'
import { multiUpload, uploadFields, deleteFile } from '../utils/multer.js'

const router = express.Router()

router.post('/photo', async (req, res) => {
  const { startRow, pageSize, searchWord } = req.body

  try {
    const data = await getPhotoList(startRow, pageSize, searchWord)
    res.send(data)
  } catch (error) {
    console.error('Error fetching photo list:', error)
    res.status(500).send({ error: '사진 목록을 가져오는 중 오류가 발생했습니다.' })
  }
})

router.get('/photo_count', async (req, res) => {
  const { searchWord } = req.query
  const count = await totalPhotoCount(searchWord)
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

router.post('/photo_write', multiUpload, async (req, res) => {
  const { title, content, writer, writer_name } = req.body
  const files = req.files


  const pathList = files.map((file) => {
    if (file.originalname) {
      file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')
    }

    return file
  })

  try {
    const result = await writePhotoContent({
      title,
      content,
      writer,
      writer_name,
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
  const { id, deleteKeyList = [] } = req.body
  console.log('deleteKeyList: ', deleteKeyList)

  if (deleteKeyList) {
    let fileDeleted = true // 초기값을 true로 설정

    deleteKeyList.forEach((file) => {
      console.log('file: ', file)
      const filename = `uploads/${file.filename}`
      const result = deleteFile(filename)
      if (!result) {
        fileDeleted = false // 파일 삭제 실패 시 false로 설정
      }
    })

    if (fileDeleted) {
      console.log('file 삭제 완료')
    } else {
      console.log('file 삭제 실패')
    }
  }


    try {
      const result = await logicalDeletePhoto(id)

      if (!result) {
      return res.status(404).json({ error: 'Photo not found' })
      }
      res.json(true)
    } catch (error) {
      console.error('Error fetching Photo:', error)
      res.status(500).json({ error: 'Error fetching Photo' })
    }

})

router.post('/photo_edit', uploadFields, async (req, res) => {
  const { title, content, id, jsonDeleteKeys = '' } = req.body
  let deleteKeyList = []

  console.log("req.body: ", req.body);

  const files = req?.files['fileField'] ?? []

  if (jsonDeleteKeys) {
    deleteKeyList = JSON.parse(jsonDeleteKeys)
  }

  const data = {
    id,
    title,
    content
  }

if (deleteKeyList.length > 0 && files.length > 0) {
    let fileDeleted = true // 초기값을 true로 설정

    deleteKeyList.forEach((file) => {
      console.log('file: ', file)
      const filename = `uploads/${file}`
      const result = deleteFile(filename)
      if (!result) {
        fileDeleted = false // 파일 삭제 실패 시 false로 설정
      }
    })

    if (fileDeleted) {
      console.log('file 삭제 완료')
      Object.assign(data, { files: files })
    } else {
      console.log('file 삭제 실패')
    }
  }

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
