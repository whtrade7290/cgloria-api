import express from 'express'
import {
  getLibraryList,
  totalLibraryCount,
  getLibraryContent,
  writeLibraryContent,
  editLibraryContent,
  logicalDeleteLibrary
} from '../services/libraryService.js'
import { singleUpload, deleteFile } from '../utils/multer.js'

const router = express.Router()

router.post('/library', async (req, res) => {
  const { startRow, pageSize, searchWord } = req.body
  const data = await getLibraryList(startRow, pageSize, searchWord)
  res.send(data)
})

router.get('/library_count', async (req, res) => {
  const { searchWord } = req.query
  const count = await totalLibraryCount(searchWord)
  res.json(count)
})

router.post('/library_detail', async (req, res) => {
  const { id } = req.body
  try {
    const content = await getLibraryContent(id)
    if (!content) {
      return res.status(404).json({ error: 'library not found' })
    }

    res.json(content)
  } catch (error) {
    console.error('Error fetching library:', error)
    res.status(500).json({ error: 'Error fetching library' })
  }
})

router.post('/library_write', singleUpload, async (req, res) => {
  const { title, content, writer, writer_name } = req.body
  const file = req.file

  let filesPayload = null

  if (file) {
    let originalName = file?.originalname ?? ''
    if (originalName) {
      originalName = Buffer.from(originalName, 'latin1').toString('utf8')
    }

    filesPayload = JSON.stringify({
      key: file.filename,
      originalName,
      path: `/uploads/${file.filename}`,
      mimetype: file.mimetype,
      size: file.size
    })
  }

  try {
    const result = await writeLibraryContent({
      title,
      content,
      writer,
      writer_name,
      files: filesPayload
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

router.post('/library_delete', async (req, res) => {
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
    const result = await logicalDeleteLibrary(id)

    if (!result) {
      return res.status(404).json({ error: 'Sermon not found' })
    }
    res.json(!!result)
  } catch (error) {
    console.error('Error fetching sermon:', error)
    res.status(500).json({ error: 'Error fetching sermon' })
  }
})

router.post('/library_edit', singleUpload, async (req, res) => {
  const { title, content, id, deleteKey } = req.body
  const file = req.file

  const data = {
    id,
    title,
    content
  }

  let filesPayload

  if (deleteKey) {
    const fileDeleted = deleteFile(deleteKey)
    if (fileDeleted) {
      console.log('file 삭제 완료')
    } else {
      console.log('file 삭제 실패')
    }
    if (!file) {
      filesPayload = null
    }
  }

  if (file) {
    let originalName = file?.originalname ?? ''
    if (originalName) {
      originalName = Buffer.from(originalName, 'latin1').toString('utf8')
    }

    filesPayload = JSON.stringify({
      key: file.filename,
      originalName,
      path: `/uploads/${file.filename}`,
      mimetype: file.mimetype,
      size: file.size
    })
  }

  if (filesPayload !== undefined) {
    data.files = filesPayload
  }

  try {
    const result = await editLibraryContent(data)

    if (!result) {
      return res.status(404).json({ error: 'library not found' })
    }
    res.json(!!result)
  } catch (error) {
    console.error('Error fetching:', error)
    res.status(500).json({ error: 'Error fetching library' })
  }
})

export default router
