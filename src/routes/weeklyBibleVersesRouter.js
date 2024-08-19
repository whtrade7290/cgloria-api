import express from 'express'
import {
  getWeeklyList,
  totalWeeklyCount,
  getWeeklyContent,
  writeWeeklyContent,
  logicalDeleteWeekly,
  editWeeklyContent,
  getMainWeekly
} from '../services/weeklyService.js'
import upload from '../utils/multer.js'

const router = express.Router()

router.post('/weekly', async (req, res) => {
  const { startRow, pageSize } = req.body
  const data = await getWeeklyList(startRow, pageSize)
  res.send(data)
})

router.get('/weekly_count', async (req, res) => {
  const count = await totalWeeklyCount()
  res.json(count)
})

router.post('/weekly_detail', async (req, res) => {
  const { id } = req.body
  try {
    const content = await getWeeklyContent(id)
    if (!content) {
      return res.status(404).json({ error: 'weekly not found' })
    }

    res.json(content)
  } catch (error) {
    console.error('Error fetching weekly:', error)
    res.status(500).json({ error: 'Error fetching weekly' })
  }
})

router.post('/weekly_write', upload.single('fileField'), async (req, res) => {
  const { title, content, writer, mainContent } = req.body
  const fileData = req.fileData || {}

  try {
    await writeWeeklyContent({
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
    res.status(500).json({ error: 'Error fetching weekly' })
  }
})

router.post('/weekly_delete', async (req, res) => {
  const { id } = req.body
  try {
    const result = await logicalDeleteWeekly(id)

    if (!result) {
      return res.status(404).json({ error: 'Weekly not found' })
    }
    res.json(!!result)
  } catch (error) {
    console.error('Error fetching Weekly:', error)
    res.status(500).json({ error: 'Error fetching Weekly' })
  }
})

router.post('/weekly_edit', upload.single('fileField'), async (req, res) => {
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
    const result = await editWeeklyContent(data)

    if (!result) {
      return res.status(404).json({ error: 'weekly not found' })
    }
    res.json(!!result)
  } catch (error) {
    console.error('Error fetching:', error)
    res.status(500).json({ error: 'Error fetching weekly' })
  }
})

router.get('/main_weekly', async (req, res) => {
  const data = await getMainWeekly()
  console.log('data: ', data)
  res.send(data)
})

export default router
