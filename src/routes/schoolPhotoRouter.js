import express from 'express'
import {
  getschoolPhotoList,
  totalschoolPhotoCount,
  getschoolPhotoContent,
  writeSchoolPhotoContent,
  logicalDeleteSchoolPhoto,
  editSchoolPhotoContent
} from '../services/schoolPhotoService.js'
import { upload } from '../utils/multer.js'

const router = express.Router()

router.post('/school_photo', async (req, res) => {
  const { startRow, pageSize } = req.body
  const data = await getschoolPhotoList(startRow, pageSize)

  res.send(data)
})

router.get('/school_photo_count', async (req, res) => {
  const count = await totalschoolPhotoCount()
  res.json(count)
})

router.post('/school_photo_detail', async (req, res) => {
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

router.post('/school_photo_write', upload.array('fileField', 6), async (req, res) => {
  const { title, content, writer } = req.body

  const pathList = req.files.map(({ filename }) => {
    // '_'로 먼저 분리
    const temporary = filename.split('_')

    // 두 번째 부분을 다시 '.'로 분리
    const dateAndExtension = temporary[1].split('.')

    return {
      filename: temporary[0],
      extension: dateAndExtension[1],
      date: dateAndExtension[0]
    }
  })

  try {
    await writeSchoolPhotoContent({
      title,
      content,
      writer,
      files: JSON.stringify(pathList)
    })
  } catch (error) {
    console.error('Error fetching:', error)
    res.status(500).json({ error: 'Error fetching school_photo' })
  }
})

router.post('/school_photo_delete', async (req, res) => {
  const { id } = req.body
  try {
    const result = await logicalDeleteSchoolPhoto(id)

    if (!result) {
      return res.status(404).json({ error: 'SchoolPhoto not found' })
    }
    res.json(!!result)
  } catch (error) {
    console.error('Error fetching SchoolPhoto:', error)
    res.status(500).json({ error: 'Error fetching SchoolPhoto' })
  }
})

router.post('/school_photo_edit', upload.array('fileField', 6), async (req, res) => {
  const { title, content, id } = req.body

  const pathList = req.files.map(({ filename }) => {
    // '_'로 먼저 분리
    const temporary = filename.split('_')

    // 두 번째 부분을 다시 '.'로 분리
    const dateAndExtension = temporary[1].split('.')

    return {
      filename: temporary[0],
      extension: dateAndExtension[1],
      date: dateAndExtension[0]
    }
  })

  const data = {
    id,
    title,
    content
  }

  if (pathList) {
    Object.assign(data, { files: pathList })
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
