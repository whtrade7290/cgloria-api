import express from 'express'
import {
  getLibraryList,
  totalLibraryCount,
  getLibraryContent,
  writeLibraryContent,
  editLibraryContent,
  logicalDeleteLibrary
} from '../services/libraryService.js'
import { upload, uploadToS3, deleteS3File } from '../utils/multer.js'

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

    res.json(content)
  } catch (error) {
    console.error('Error fetching library:', error)
    res.status(500).json({ error: 'Error fetching library' })
  }
})

router.post('/library_write', upload.single('fileField'), async (req, res) => {
  const { title, content, writer } = req.body
  const file = req.file
  let s3Response = {}

  if (file) {
    // 파일을 S3에 업로드
    s3Response = await uploadToS3(file)
  }

  try {
    const result = await writeLibraryContent({
      title,
      content,
      writer,
      extension: s3Response.extension ?? '',
      fileDate: s3Response.date ?? '',
      filename: s3Response.filename ?? ''
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

  if (deleteKey !== '') {
    const result = await deleteS3File(deleteKey)

    if (result.$metadata.httpStatusCode === 204) {
      console.log('S3 delete file success status code: ', result.$metadata.httpStatusCode)
    } else {
      console.log('S3 delete file fail status code: ', result.$metadata.httpStatusCode)
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

router.post('/library_edit', upload.single('fileField'), async (req, res) => {
  const { title, content, id, mainContent, deleteFile } = req.body
  const file = req.file || {}
  let s3Response = {}

  const data = {
    id,
    title,
    content
  }

  if (deleteFile && file) {
    const result = await deleteS3File(deleteFile)

    if (result.$metadata.httpStatusCode === 204) {
      s3Response = await uploadToS3(file)

      Object.assign(data, {
        extension: s3Response.extension ?? '',
        fileDate: s3Response.date ?? '',
        filename: s3Response.filename ?? ''
      })
    }
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
