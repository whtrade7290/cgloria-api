import express from 'express'
import {
  getGeneralForumList,
  totalGeneralForumCount,
  getGeneralForumContent,
  writeGeneralForumContent,
  logicalDeleteGeneralForum,
  editGeneralForumContent
} from '../services/generalForumService.js'
import { singleUpload, deleteFile } from '../utils/multer.js'

const router = express.Router()

router.post('/generalForum', async (req, res) => {
  const { startRow, pageSize } = req.body
  const data = await getGeneralForumList(startRow, pageSize)
  res.send(data)
})

router.get('/generalForum_count', async (req, res) => {
  const count = await totalGeneralForumCount()
  res.json(count)
})

router.post('/generalForum_detail', async (req, res) => {
  const { id } = req.body
  try {
    const content = await getGeneralForumContent(id)
    if (!content) {
      return res.status(404).json({ error: 'generalForum not found' })
    }
    res.json(content)
  } catch (error) {
    console.error('Error fetching generalForum:', error)
    res.status(500).json({ error: 'Error fetching generalForum' })
  }
})

router.post('/generalForum_write', singleUpload, async (req, res) => {
  const { title, content, writer, writer_name } = req.body
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
    const result = await writeGeneralForumContent({
      title,
      content,
      writer,
      writer_name,
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

router.post('/generalForum_delete', async (req, res) => {
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
    const result = await logicalDeleteGeneralForum(id)

    if (!result) {
      return res.status(404).json({ error: 'generalForum not found' })
    }
    res.json(!!result)
  } catch (error) {
    console.error('Error fetching sermon:', error)
    res.status(500).json({ error: 'Error fetching generalForum' })
  }
})

router.post('/generalForum_edit', singleUpload, async (req, res) => {
  const { title, content, id, deleteKey } = req.body
  const file = req.file || {}

  const data = {
    id,
    title,
    content
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
    const result = await editGeneralForumContent(data)

    if (!result) {
      return res.status(404).json({ error: 'generalForum not found' })
    }
    res.json(!!result)
  } catch (error) {
    console.error('Error fetching:', error)
    res.status(500).json({ error: 'Error fetching generalForum' })
  }
})

export default router
