import express from 'express'
import {
  getColumnList,
  totalColumnCount,
  getColumnContent,
  writeColumnContent,
  logicalDeleteColumn,
  editColumnContent
} from '../services/columnService.js'
import upload from '../utils/multer.js'

const router = express.Router()

router.post('/column', async (req, res) => {
  const { startRow, pageSize } = req.body
  const data = await getColumnList(startRow, pageSize)
  res.send(data)
})

router.get('/column_count', async (req, res) => {
  const count = await totalColumnCount()
  res.json(count)
})

router.post('/column_detail', async (req, res) => {
  const { id } = req.body
  try {
    const content = await getColumnContent(id)
    if (!content) {
      return res.status(404).json({ error: 'column not found' })
    }

    res.json(content)
  } catch (error) {
    console.error('Error fetching column:', error)
    res.status(500).json({ error: 'Error fetching column' })
  }
})

router.post('/column_write', upload.single('fileField'), async (req, res) => {
  const { title, content, writer } = req.body

  const fileData = req.fileData || {}

  try {
    await writeColumnContent({
      title,
      content,
      writer,
      extension: fileData.extension ?? '',
      fileDate: fileData.date ?? '',
      filename: fileData.filename ?? ''
    })
  } catch (error) {
    console.error('Error fetching column:', error)
    res.status(500).json({ error: 'Error fetching column' })
  }
})

router.post('/column_delete', async (req, res) => {
  const { id } = req.body
  try {
    const result = await logicalDeleteColumn(id)

    if (!result) {
      return res.status(404).json({ error: 'Column not found' })
    }
    res.json(!!result)
  } catch (error) {
    console.error('Error fetching Column:', error)
    res.status(500).json({ error: 'Error fetching Column' })
  }
})

router.post('/column_edit', upload.single('fileField'), async (req, res) => {
  const { title, content, id } = req.body
  const fileData = req.fileData || {}

  const data = {
    id,
    title,
    content
  }

  if (fileData) {
    Object.assign(data, {
      extension: fileData.extension ?? '',
      fileDate: fileData.date ?? '',
      filename: fileData.filename ?? ''
    })
  }

  try {
    const result = await editColumnContent(data)

    if (!result) {
      return res.status(404).json({ error: 'column not found' })
    }
    res.json(!!result)
  } catch (error) {
    console.error('Error fetching:', error)
    res.status(500).json({ error: 'Error fetching column' })
  }
})

export default router
