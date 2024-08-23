import express from 'express'
import {
  getSermonList,
  totalSermonCount,
  getSermonContent,
  writeSermonContent,
  logicalDeleteSermon,
  editSermonContent,
  getMainSermon
} from '../services/sermonService.js'
import upload from '../utils/multer.js'

const router = express.Router()

router.post('/sermon', async (req, res) => {
  const { startRow, pageSize } = req.body
  const data = await getSermonList(startRow, pageSize)
  res.send(data)
})

router.get('/sermon_count', async (req, res) => {
  const count = await totalSermonCount()
  res.json(count)
})

router.post('/sermon_detail', async (req, res) => {
  const { id } = req.body
  try {
    const content = await getSermonContent(id)
    if (!content) {
      return res.status(404).json({ error: 'Sermon not found' })
    }

    res.json(content)
  } catch (error) {
    console.error('Error fetching sermon:', error)
    res.status(500).json({ error: 'Error fetching sermon' })
  }
})

router.post('/sermon_write', upload.single('fileField'), async (req, res) => {
  const { title, content, writer, mainContent } = req.body
  const fileData = req.fileData || {}

  try {
    await writeSermonContent({
      title,
      content,
      writer,
      mainContent: mainContent === 'true',
      extension: fileData.extension ?? '',
      fileDate: fileData.date ?? '',
      filename: fileData.filename ?? ''
    })
  } catch (error) {
    console.error('Error fetching:', error)
    res.status(500).json({ error: 'Error fetching sermon' })
  }
})

router.post('/sermon_delete', async (req, res) => {
  const { id } = req.body
  try {
    const result = await logicalDeleteSermon(id)

    if (!result) {
      return res.status(404).json({ error: 'Sermon not found' })
    }
    res.json(!!result)
  } catch (error) {
    console.error('Error fetching sermon:', error)
    res.status(500).json({ error: 'Error fetching sermon' })
  }
})

router.post('/sermon_edit', upload.single('fileField'), async (req, res) => {
  const { title, content, id, mainContent } = req.body
  const fileData = req.fileData || {}

  const data = {
    id,
    title,
    content,
    mainContent: mainContent === 'true'
  }

  if (fileData) {
    Object.assign(data, {
      extension: fileData.extension ?? '',
      fileDate: fileData.date ?? '',
      filename: fileData.filename ?? ''
    })
  }

  try {
    const result = await editSermonContent(data)

    if (!result) {
      return res.status(404).json({ error: 'Sermon not found' })
    }
    res.json(!!result)
  } catch (error) {
    console.error('Error fetching:', error)
    res.status(500).json({ error: 'Error fetching sermon' })
  }
})

router.get('/main_sermon', async (req, res) => {
  const data = await getMainSermon()
  res.send(data)
})

export default router
