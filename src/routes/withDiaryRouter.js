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
import { upload } from '../utils/multer.js'

const router = express.Router()

router.post('/withDiary', async (req, res) => {
  const { startRow, pageSize, roomId } = req.body
  console.log("roomId: ", roomId);
  const data = await getWithDiaryList(startRow, pageSize, roomId)
  console.log("data: ", data);
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

router.post('/withDiary_write', upload.single('fileField'), async (req, res) => {
  const { title, content, writer, withDiaryNum } = req.body
  const fileData = req.fileData || {}

  try {
    await writeWithDiaryContent({
      title,
      content,
      writer,
      extension: fileData.extension ?? '',
      fileDate: fileData.date ?? '',
      filename: fileData.filename ?? '',
      withDiaryNum: Number(withDiaryNum)
    })
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

router.post('/withDiary_edit', upload.single('fileField'), async (req, res) => {
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
  const { teamName, userIdList } = req.body

  console.log('teamName: ', teamName)
  console.log('userIdList: ', userIdList)

  if (!teamName || userIdList.length === 0) {
    res.status(500).json({ error: 'Error fetching teamName' })
  }

  try {
    const result = await createDiaryRoomWithUsers(teamName, userIdList)

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

  console.log("userId: ", userId);

  try {
    const results = await fetchWithDiaryRoomList(userId)
    
    console.log("results: ", results);

    const newResult = results.map(item => {
      return {
        ...item,
        userId: Number(item.userId)
      }
    })

    console.log("newResult: ", newResult);

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
    
    console.log("result: ", result);

    if (result) {
      res.status(200).json(result)
    }

  } catch (error) {
    console.error('Error fetching:', error)
    res.status(500).json({ error: 'Error fetching WithDiaryRoom' })
  }
})

export default router
