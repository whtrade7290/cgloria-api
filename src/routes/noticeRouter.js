import express from 'express'
import { multiUpload, uploadFields, deleteFile } from '../utils/multer.js'
import { processFileUpdates } from '../utils/fileProcess.js'
import {
  writeContent,
  getContentList,
  getContentById,
  editContent,
  totalContentCount,
  logicalDeleteContent
} from '../common/boardUtils.js'

const router = express.Router()
const BOARD_NAME = 'notice'

const resolveBoard = (board) => board || BOARD_NAME

const decodeOriginalName = (file) => {
  if (file?.originalname) {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')
  }
  return file
}

const normalizeSingleDeleteKey = (deleteKey) => {
  if (!deleteKey) return []

  if (typeof deleteKey === 'string') {
    return [{ filename: deleteKey.replace(/^uploads\//, '') }]
  }

  if (typeof deleteKey === 'object' && deleteKey.filename) {
    return [{ filename: deleteKey.filename.replace(/^uploads\//, '') }]
  }

  return []
}

const gatherDeleteKeyList = ({ deleteKeyList = [], deleteKey }) => {
  if (Array.isArray(deleteKeyList) && deleteKeyList.length > 0) {
    return deleteKeyList
  }
  return normalizeSingleDeleteKey(deleteKey)
}

const removePhysicalFiles = (deleteKeyList = []) => {
  if (!Array.isArray(deleteKeyList) || deleteKeyList.length === 0) {
    return
  }

  let fileDeleted = true

  deleteKeyList.forEach((file) => {
    const filename = typeof file === 'string' ? file : file?.filename
    if (!filename) return
    const result = deleteFile(`uploads/${filename.replace(/^uploads\//, '')}`)
    if (!result) {
      fileDeleted = false
    }
  })

  if (fileDeleted) {
    console.log('file 삭제 완료')
  } else {
    console.log('file 삭제 실패')
  }
}

router.post('/notice', async (req, res) => {
  const { startRow, pageSize, searchWord, board } = req.body
  const resolvedBoard = resolveBoard(board)

  try {
    const data = await getContentList(startRow, pageSize, searchWord, resolvedBoard)
    res.send(data)
  } catch (error) {
    console.error('Error fetching notice list:', error)
    res.status(500).send({ error: '공지 목록을 가져오는 중 오류가 발생했습니다.' })
  }
})

router.post('/notice_count', async (req, res) => {
  const { searchWord, board } = req.body
  const resolvedBoard = resolveBoard(board)
  try {
    const count = await totalContentCount(searchWord, resolvedBoard)
    res.json(count)
  } catch (error) {
    console.error('Error fetching notice count:', error)
    res.status(500).send({ error: '공지 카운트를 가져오는 중 오류가 발생했습니다.' })
  }
})

router.post('/notice_detail', async (req, res) => {
  const { id, board } = req.body

  if (!id) return res.status(400).json({ error: '잘못된 요청입니다.' })

  const resolvedBoard = resolveBoard(board)
  try {
    const content = await getContentById(id, resolvedBoard)
    if (!content) {
      return res.status(404).json({ error: 'Notice not found' })
    }

    res.json(content)
  } catch (error) {
    console.error('Error fetching notice:', error)
    res.status(500).json({ error: '공지 상세 조회 중 오류가 발생했습니다.' })
  }
})

router.post('/notice_write', multiUpload, async (req, res) => {
  const { title, content, writer, writer_name, board } = req.body
  const resolvedBoard = resolveBoard(board)
  const files = Array.isArray(req.files) ? req.files : []
  const normalizedFiles = files.map(decodeOriginalName)

  try {
    const result = await writeContent({
      title,
      content,
      writer,
      writer_name,
      files: JSON.stringify(normalizedFiles),
      board: resolvedBoard
    })

    if (result) {
      res.status(200).json({ success: true, message: 'Upload Success' })
    } else {
      res.status(400).json({ success: false, message: 'Upload Failed' })
    }
  } catch (error) {
    console.error('Error creating notice:', error)
    res.status(500).json({ error: '공지 생성 중 오류가 발생했습니다.' })
  }
})

router.post('/notice_delete', async (req, res) => {
  const { id, board } = req.body
  const resolvedBoard = resolveBoard(board)
  const deleteKeyList = gatherDeleteKeyList(req.body)

  removePhysicalFiles(deleteKeyList)

  try {
    const result = await logicalDeleteContent(id, resolvedBoard)

    if (!result) {
      return res.status(404).json({ error: 'Notice not found' })
    }
    res.json(!!result)
  } catch (error) {
    console.error('Error deleting notice:', error)
    res.status(500).json({ error: '공지 삭제 중 오류가 발생했습니다.' })
  }
})

router.post('/notice_edit', uploadFields, async (req, res) => {
  const { title, content, id, board } = req.body
  const resolvedBoard = resolveBoard(board)
  const jsonDeleteKeys = gatherDeleteKeyList(req.body)

  const { files: updatedFiles, hasFileUpdate } = await processFileUpdates({
    id,
    board: resolvedBoard,
    jsonDeleteKeys,
    uploadedFiles: req?.files['fileField'] ?? []
  })

  const data = {
    id,
    title,
    content,
    board: resolvedBoard
  }

  if (hasFileUpdate) {
    data.files = updatedFiles
  }

  try {
    const result = await editContent(data)

    if (!result) {
      return res.status(404).json({ error: 'Notice not found' })
    }
    res.json(!!result)
  } catch (error) {
    console.error('Error editing notice:', error)
    res.status(500).json({ error: '공지 수정 중 오류가 발생했습니다.' })
  }
})

export default router
