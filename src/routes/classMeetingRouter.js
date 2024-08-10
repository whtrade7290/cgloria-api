import express from 'express'
import {
  getClassMeetingList,
  totalClassMeetingCount,
  getClassMeetingContent,
  writeClassMeetingContent,
  logicalDeleteClassMeeting,
  editClassMeetingContent
} from '../services/classMeetingService.js'
import upload from '../utils/multer.js'

const router = express.Router()

router.post('/classMeeting', async (req, res) => {
  const { startRow, pageSize } = req.body
  const data = await getClassMeetingList(startRow, pageSize)
  res.send(data)
})

router.get('/classMeeting_count', async (req, res) => {
  const count = await totalClassMeetingCount()
  res.json(count)
})

router.post('/classMeeting_detail', async (req, res) => {
  const { id } = req.body
  try {
    const content = await getClassMeetingContent(id)
    if (!content) {
      return res.status(404).json({ error: 'classMeeting not found' })
    }
    console.log(content)
    res.json(content)
  } catch (error) {
    console.error('Error fetching classMeeting:', error)
    res.status(500).json({ error: 'Error fetching classMeeting' })
  }
})

router.post('/classMeeting_write', upload.single('fileField'), async (req, res) => {
  const { title, content, writer } = req.body

  const fileData = req.fileData || {}

  try {
    await writeClassMeetingContent({
      title,
      content,
      writer,
      extension: fileData.extension ?? '',
      fileDate: fileData.date ?? '',
      filename: fileData.filename ?? ''
    })
  } catch (error) {
    console.error('Error fetching classMeeting:', error)
    res.status(500).json({ error: 'Error fetching classMeeting' })
  }
})

router.post('/classMeeting_delete', async (req, res) => {
  const { id } = req.body
  try {
    const result = await logicalDeleteClassMeeting(id)

    if (!result) {
      return res.status(404).json({ error: 'ClassMeeting not found' })
    }
    res.json(!!result)
  } catch (error) {
    console.error('Error fetching ClassMeeting:', error)
    res.status(500).json({ error: 'Error fetching ClassMeeting' })
  }
})

router.post('/classMeeting_edit', upload.single('fileField'), async (req, res) => {
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
    const result = await editClassMeetingContent(data)

    if (!result) {
      return res.status(404).json({ error: 'classMeeting not found' })
    }
    res.json(!!result)
  } catch (error) {
    console.error('Error fetching:', error)
    res.status(500).json({ error: 'Error fetching classMeeting' })
  }
})

export default router
