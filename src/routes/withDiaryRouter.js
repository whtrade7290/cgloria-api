import express from 'express'
import {
  getWithDiaryList,
  totalWithDiaryCount,
  writeWithDiaryContent,
  getWithDiaryContent,
  logicalDeleteWithDiary,
  editWithDiaryContent,
  createDiaryRoomWithUsers,
  fetchWithDiaryRoomList,
  getWithDiaryRoom
} from '../services/withDiaryService.js'
import { singleUpload, deleteFile } from '../utils/multer.js'

const router = express.Router()

router.post('/withDiary', async (req, res) => {
  const { startRow, pageSize, roomId } = req.body
  console.log('roomId: ', roomId)
  const data = await getWithDiaryList(startRow, pageSize, roomId)
  console.log('data: ', data)
  res.send(data)
})

router.post('/withDiary_count', async (req, res) => {
  const { id } = req.body
  console.log('id: ', id)
  const count = await totalWithDiaryCount(id)
  console.log('count: ', count)
  res.json(count)
})

router.post('/withDiary_detail', async (req, res) => {
  const { id } = req.body
  try {
    const content = await getWithDiaryContent(id)
    if (!content) {
      return res.status(404).json({ error: 'WithDiary not found' })
    }

    res.json(content)
  } catch (error) {
    console.error('Error fetching WithDiary:', error)
    res.status(500).json({ error: 'Error fetching WithDiary' })
  }
})

router.post('/withDiary_write', singleUpload, async (req, res) => {
  const { title, content, writer, writer_name, diaryRoomId } = req.body
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
    const result = await writeWithDiaryContent({
      title,
      content,
      writer,
      writer_name,
      uuid,
      filename,
      extension,
      fileType,
      diaryRoomId: Number(diaryRoomId)
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
    res.status(500).json({ error: 'Error fetching WithDiary' })
  }
})

router.post('/withDiary_delete', async (req, res) => {
  const { id } = req.body
  try {
    const result = await logicalDeleteWithDiary(id)

    if (!result) {
      return res.status(404).json({ error: 'WithDiary not found' })
    }
    res.json(!!result)
  } catch (error) {
    console.error('Error fetching WithDiary:', error)
    res.status(500).json({ error: 'Error fetching WithDiary' })
  }
})

router.post('/withDiary_edit', singleUpload, async (req, res) => {
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
    const result = await editWithDiaryContent(data)

    if (!result) {
      return res.status(404).json({ error: 'WithDiary not found' })
    }
    res.json(!!result)
  } catch (error) {
    console.error('Error fetching:', error)
    res.status(500).json({ error: 'Error fetching WithDiary' })
  }
})

router.post('/make_withDiary', async (req, res) => {
  const { teamName, userIdList, creator, creator_name } = req.body

  console.log('teamName: ', teamName)
  console.log('userIdList: ', userIdList)
  console.log('creator: ', creator)
  console.log('creator_name: ', creator_name)

  if (!teamName || userIdList.length === 0) {
    res.status(500).json({ error: 'Error fetching teamName' })
  }

  try {
    const result = await createDiaryRoomWithUsers(teamName, userIdList, creator, creator_name)

    if (result) {
      res.status(200).json(!!result)
    }
  } catch (error) {
    console.error('Error fetching:', error)
    res.status(500).json({ error: 'Error fetching WithDiaryRoom' })
  }
})

router.post('/fetch_withDiaryList', async (req, res) => {
  const { userId } = req.body

  console.log('userId: ', userId)

  try {
    const results = await fetchWithDiaryRoomList(userId)

    console.log('results: ', results)

    const newResult = results.map((item) => {
      return {
        ...item,
        userId: Number(item.userId)
      }
    })

    console.log('newResult: ', newResult)

    if (newResult) {
      res.status(200).json(newResult)
    }
  } catch (error) {
    console.error('Error fetching:', error)
    res.status(500).json({ error: 'Error fetching WithDiaryRoom' })
  }
})

router.post('/fetch_withDiary', async (req, res) => {
  const { roomId } = req.body

  try {
    const result = await getWithDiaryRoom(roomId)

    console.log('result: ', result)

    if (result) {
      res.status(200).json(result)
    }
  } catch (error) {
    console.error('Error fetching:', error)
    res.status(500).json({ error: 'Error fetching WithDiaryRoom' })
  }
})

export default router
