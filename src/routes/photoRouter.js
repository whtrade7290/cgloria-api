import express from 'express'
import {
  getPhotoList,
  totalPhotoCount,
  getPhotoContent,
  writePhotoContent
} from '../services/photoService.js'
import upload from '../utils/multer.js'

const router = express.Router()

router.post('/photo', async (req, res) => {
  const { startRow, pageSize } = req.body
  const data = await getPhotoList(startRow, pageSize)
  console.log('data: ', data)
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
    console.log(content)
    res.json(content)
  } catch (error) {
    console.error('Error fetching photo:', error)
    res.status(500).json({ error: 'Error fetching photo' })
  }
})

router.post('/photo_write', upload.array('fileField', 6), async (req, res) => {
  const { title, content, writer } = req.body

  const pathList = req.files.map(({ filename }) => {
    console.log('filename: ', filename)

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

  console.log('pathList: ', pathList)

  try {
    await writePhotoContent({
      title,
      content,
      writer,
      files: JSON.stringify(pathList)
    })
  } catch (error) {
    console.error('Error fetching:', error)
    res.status(500).json({ error: 'Error fetching photo' })
  }
})

export default router
