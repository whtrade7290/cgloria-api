import express from 'express'
import {
  getClassMeetingList,
  totalClassMeetingCount,
  getClassMeetingContent,
  writeClassMeetingContent,
  logicalDeleteClassMeeting,
  editClassMeetingContent,
  getMainClassMeeting
} from '../services/classMeetingService.js'
import { singleUpload, deleteFile } from '../utils/multer.js'

const router = express.Router()

router.post('/classMeeting', async (req, res) => {
  const { startRow, pageSize, searchWord } = req.body
  const data = await getClassMeetingList(startRow, pageSize, searchWord)
  res.send(data)
})

router.get('/classMeeting_count', async (req, res) => {
  const { searchWord } = req.query

  const count = await totalClassMeetingCount(searchWord)
  res.json(count)
})

router.post('/classMeeting_detail', async (req, res) => {
  const { id } = req.body
  try {
    const content = await getClassMeetingContent(id)
    if (!content) {
      return res.status(404).json({ error: 'classMeeting not found' })
    }

    res.json(content)
  } catch (error) {
    console.error('Error fetching classMeeting:', error)
    res.status(500).json({ error: 'Error fetching classMeeting' })
  }
})

router.post('/classMeeting_write', singleUpload, async (req, res) => {
  const { title, content, writer, writer_name, mainContent } = req.body
  const file = req.file

  // 파일 정보 초기화
  let uuid = ''
  let filename = ''
  let extension = ''
  let fileType = ''

  // 파일이 존재할 경우 정보 추출
  if (file) {
    uuid = file.filename?.split('_')[0] ?? ''
    filename = file?.originalname ?? ''
    if (filename) {
      filename = Buffer.from(filename, 'latin1').toString('utf8')
    }
    extension = filename ? '.' + filename.split('.').pop() : ''
    fileType = file?.mimetype ?? ''
  }

  try {
    const result = await writeClassMeetingContent({
      title,
      content,
      writer,
      writer_name,
      mainContent: mainContent === 'true',
      uuid,
      filename,
      extension,
      fileType
    })

    if (result) {
      // result가 truthy일 때 성공 응답
      res.status(200).json({ success: true, message: 'Upload Success' })
    } else {
      // result가 null 또는 falsy일 때 실패 응답
      res.status(400).json({ success: false, message: 'Upload Failed' })
    }
    return
  } catch (error) {
    console.error('Error fetching:', error)
    res.status(500).json({ error: 'Error fetching sermon' })
  }
})

router.post('/classMeeting_delete', async (req, res) => {
  const { id, deleteKey } = req.body

  if (deleteKey) {
    const fileDeleted = deleteFile(deleteKey)
    if (fileDeleted) {
      console.log('file 삭제 완료')
    } else {
      console.log('file 삭제 실패')
    }
  }

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

router.post('/classMeeting_edit', singleUpload, async (req, res) => {
  const { title, content, id, mainContent, deleteKey } = req.body
  const file = req.file || {}

  const data = {
    id,
    title,
    content,
    mainContent: mainContent === 'true'
  }

  if (deleteKey && file) {
    const fileDeleted = deleteFile(deleteKey)
    if (fileDeleted) {
      console.log('file 삭제 완료')

      let filename = file?.originalname ?? ''
      if (filename) {
        filename = Buffer.from(filename, 'latin1').toString('utf8')
      }

      Object.assign(data, {
        uuid: file.filename?.split('_')[0] ?? '',
        filename: filename,
        extension: filename ? '.' + filename.split('.').pop() : '',
        fileType: file?.mimetype ?? ''
      })
    } else {
      console.log('file 삭제 실패')
    }
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

router.get('/main_classMeeting', async (req, res) => {
  const data = await getMainClassMeeting()
  res.send(data)
})

export default router
