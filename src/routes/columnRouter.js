import express from 'express'
import {
  getColumnList,
  totalColumnCount,
  getColumnContent,
  writeColumnContent,
  logicalDeleteColumn,
  editColumnContent,
  getMainColumn
} from '../services/columnService.js'
import { upload, uploadToS3, deleteS3File } from '../utils/multer.js'

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
  const { title, content, writer, mainContent } = req.body
  const file = req.file
  let s3Response = {}

  if (file) {
    // 파일을 S3에 업로드
    s3Response = await uploadToS3(file)
  }

  try {
    const result = await writeColumnContent({
      title,
      content,
      writer,
      mainContent: mainContent === 'true',
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

router.post('/column_delete', async (req, res) => {
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
  const { title, content, id, mainContent, deleteFile } = req.body
  const file = req.file || {}
  let s3Response = {}

  console.log("deleteFile: ", deleteFile);
  console.log("file: ", file);

  const data = {
    id,
    title,
    content,
    mainContent: mainContent === 'true'
  }

  if (deleteFile && file) {
    console.log("excute");
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

router.get('/main_column', async (req, res) => {
  const data = await getMainColumn()
  res.send(data)
})

export default router
