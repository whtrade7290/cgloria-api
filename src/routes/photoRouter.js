import express from 'express'
import { multiUpload, uploadFields, deleteFile } from '../utils/multer.js'
import { processFileUpdates } from '../utils/fileProcess.js'
import { writeContent, getContentList, getContentById, editContent, totalContentCount, logicalDeleteContent } from '../common/boardUtils.js'

const router = express.Router()

router.post('/photo_board', async (req, res) => {
  const { startRow, pageSize, searchWord, board } = req.body

  try {
    const data = await getContentList(startRow, pageSize, searchWord, board)
    res.send(data)
  } catch (error) {
    console.error('Error fetching photo list:', error)
    res.status(500).send({ error: '사진 목록을 가져오는 중 오류가 발생했습니다.' })
  }
})

router.post('/photo_board_count', async (req, res) => {
  const { searchWord, board } = req.body
  const count = await totalContentCount(searchWord, board)
  res.json(count)
})

router.post('/photo_board_detail', async (req, res) => {
  const { id, board } = req.body

  if (!id) return
  try {
    const content = await getContentById(id, board)
    if (!content) {
      return res.status(404).json({ error: 'Photo not found' })
    }

    res.json(content)
  } catch (error) {
    console.error('Error fetching photo:', error)
    res.status(500).json({ error: 'Error fetching photo' })
  }
})

router.post('/photo_board_write', multiUpload, async (req, res) => {
  const { title, content, writer, writer_name, board } = req.body
  const files = Array.isArray(req.files) ? req.files : []

  const pathList = files.map((file) => {
    if (file.originalname) {
      file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')
    }
    return file
  })

  try {
    const result = await writeContent({
      title,
      content,
      writer,
      writer_name,
      files: JSON.stringify(pathList),
      board
    })

    if (result) {
      // result가 truthy일 때 성공 응답
      res.status(200).json({ success: true, message: 'Upload Success' })
    } else {
      // result가 null 또는 falsy일 때 실패 응답
      res.status(400).json({ success: false, message: 'Upload Failed' })
    }
  } catch (error) {
    console.error('Error fetching:', error)
    res.status(500).json({ error: 'Error fetching photo' })
  }
})

router.post('/photo_board_delete', async (req, res) => {
  const { id, deleteKeyList = [], board } = req.body
  console.log('deleteKeyList: ', deleteKeyList)

  if (deleteKeyList) {
    let fileDeleted = true // 초기값을 true로 설정

    deleteKeyList.forEach((file) => {
      console.log('file: ', file)
      const filename = `uploads/${file.filename}`
      const result = deleteFile(filename)
      if (!result) {
        fileDeleted = false // 파일 삭제 실패 시 false로 설정
      }
    })

    if (fileDeleted) {
      console.log('file 삭제 완료')
    } else {
      console.log('file 삭제 실패')
    }
  }

  try {
    const result = await logicalDeleteContent(id, board)

    if (!result) {
      return res.status(404).json({ error: 'Photo not found' })
    }
    res.json(true)
  } catch (error) {
    console.error('Error fetching Photo:', error)
    res.status(500).json({ error: 'Error fetching Photo' })
  }
})

router.post('/photo_board_edit', uploadFields, async (req, res) => {
  const { title, content, id, jsonDeleteKeys = '', board } = req.body

  const { files: updatedFiles, hasFileUpdate } = await processFileUpdates({
    id,
    board,
    jsonDeleteKeys,
    uploadedFiles: req?.files['fileField'] ?? []
  })

  const data = {
    id,
    title,
    content,
    board
  }

  if (hasFileUpdate) {
    data.files = updatedFiles
  }

  try {
    const result = await editContent(data)

    if (!result) {
      return res.status(404).json({ error: 'Sermon not found' })
    }
    res.json(!!result)
  } catch (error) {
    console.error('Error fetching:', error)
    res.status(500).json({ error: 'Error fetching sermon' })
  }
})

export default router
