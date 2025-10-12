import express from 'express'
import {
  getschoolPhotoList,
  totalschoolPhotoCount,
  getschoolPhotoContent,
  writeSchoolPhotoContent,
  logicalDeleteSchoolPhoto,
  editSchoolPhotoContent
} from '../services/schoolPhotoService.js'
import { multiUpload, uploadFields, deleteFile } from '../utils/multer.js'

const router = express.Router()

router.post('/schoolPhotoBoard', async (req, res) => {
  const { startRow, pageSize, searchWord } = req.body

  const data = await getschoolPhotoList(startRow, pageSize, searchWord)

  res.send(data)
})

router.get('/schoolPhotoBoard_count', async (req, res) => {
  const { searchWord } = req.query

  const count = await totalschoolPhotoCount(searchWord)
  res.json(count)
})

router.post('/schoolPhotoBoard_detail', async (req, res) => {
  const { id } = req.body
  try {
    const content = await getschoolPhotoContent(id)
    if (!content) {
      return res.status(404).json({ error: 'school_photo not found' })
    }

    res.json(content)
  } catch (error) {
    console.error('Error fetching school_photo:', error)
    res.status(500).json({ error: 'Error fetching school_photo' })
  }
})

router.post('/schoolPhotoBoard_write', multiUpload, async (req, res) => {
  const { title, content, writer, writer_name } = req.body
  const files = req.files

  const pathList = files.map((file) => {
    if (file.originalname) {
      file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')
    }

    return file
  })

  try {
    const result = await writeSchoolPhotoContent({
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
    res.status(500).json({ error: 'Error fetching school_photo' })
  }
})

router.post('/schoolPhotoBoard_delete', async (req, res) => {
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
    const result = await logicalDeleteSchoolPhoto(id)

    if (!result) {
      return res.status(404).json({ error: 'Photo not found' })
    }
    res.json(true)
  } catch (error) {
    console.error('Error fetching Photo:', error)
    res.status(500).json({ error: 'Error fetching Photo' })
  }
})

router.post('/schoolPhotoBoard_edit', uploadFields, async (req, res) => {
  const { title, content, id, jsonDeleteKeys = '' } = req.body
  let deleteKeyList = []

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
    const result = await editSchoolPhotoContent(data)

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
