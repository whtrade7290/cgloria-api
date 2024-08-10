import express from 'express'
import {
  getLibraryList,
  totalLibraryCount,
  getLibraryContent,
  writeLibraryContent
} from '../services/libraryService.js'
import upload from '../utils/multer.js'

const router = express.Router()

router.post('/library', async (req, res) => {
  const { startRow, pageSize } = req.body
  const data = await getLibraryList(startRow, pageSize)
  res.send(data)
})

router.get('/library_count', async (req, res) => {
  const count = await totalLibraryCount()
  res.json(count)
})

router.post('/library_detail', async (req, res) => {
  const { id } = req.body
  try {
    const content = await getLibraryContent(id)
    if (!content) {
      return res.status(404).json({ error: 'library not found' })
    }
    console.log(content)
    res.json(content)
  } catch (error) {
    console.error('Error fetching library:', error)
    res.status(500).json({ error: 'Error fetching library' })
  }
})

router.post('/library_write', upload.single('fileField'), async (req, res) => {
  const { title, content, writer } = req.body

  const fileData = req.fileData || {}

  try {
    await writeLibraryContent({
      title,
      content,
      writer,
      extension: fileData.extension ?? '',
      fileDate: fileData.date ?? '',
      filename: fileData.filename ?? ''
    })
  } catch (error) {
    console.error('Error fetching library:', error)
    res.status(500).json({ error: 'Error fetching library' })
  }
})

export default router
