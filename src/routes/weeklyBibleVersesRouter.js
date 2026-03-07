import express from 'express'
import { multiUpload, uploadFields, deleteFile } from '../utils/multer.js'
import { processFileUpdates } from '../utils/fileProcess.js'
import { writeContent, getContentList, getContentById, editContent, totalContentCount, logicalDeleteContent, getMainContent } from '../common/boardUtils.js'
import { getWeeklyBibleVersesByDateRange, getWeeklyBibleVerse, getWeeklyVerseReferencesByDateRange } from '../services/weeklyBibleVerseService.js'

const router = express.Router()

router.post('/main_weekly_bible_verse', async (req, res) => {
  const { board } = req.body

  try {
    const data = await getMainContent(board)
    res.send(data)
  } catch (error) {
    console.error('Error fetching:', error)
    res.status(500).send({ error: 'Error fetching.' })
  }
})

router.post('/weekly_bible_verse', async (req, res) => {
  const { startRow, pageSize, searchWord, board } = req.body

  try {
    const data = await getContentList(startRow, pageSize, searchWord, board)
    res.send(data)
  } catch (error) {
    console.error('Error fetching photo list:', error)
    res.status(500).send({ error: '사진 목록을 가져오는 중 오류가 발생했습니다.' })
  }
})

router.post('/weekly_bible_verse_count', async (req, res) => {
  const { searchWord, board } = req.body
  const count = await totalContentCount(searchWord, board)
  res.json(count)
})

router.post('/weekly_bible_verse_detail', async (req, res) => {
  const { id, board, includeBible } = req.body

  if (!id) return
  try {
    const content = await (includeBible ? getWeeklyBibleVerse(id) : getContentById(id, board))

    if (!content) {
      return res.status(404).json({ error: 'Photo not found' })
    }

    res.json(content)
  } catch (error) {
    console.error('Error fetching photo:', error)
    res.status(500).json({ error: 'Error fetching photo' })
  }
})

router.post('/weekly_bible_verse_bibles', async (req, res) => {
  const { fromDate, toDate } = req.body ?? {}

  try {
    if (!fromDate || !toDate) {
      return res.status(400).json({ error: 'fromDate와 toDate를 모두 입력해주세요.' })
    }

    const data = await getWeeklyBibleVersesByDateRange({
      from: fromDate,
      to: toDate
    })

    res.json(data)
  } catch (error) {
    console.error('Error fetching weekly bible references:', error)
    res.status(500).json({ error: error?.message ?? '조회 중 오류가 발생했습니다.' })
  }
})

router.post('/remember_bible_download', async (req, res) => {
  const { fromDate, toDate } = req.body ?? {}

  try {
    if (!fromDate || !toDate) {
      return res.status(400).json({ error: 'fromDate와 toDate를 모두 입력해주세요.' })
    }

    const verses = await getWeeklyVerseReferencesByDateRange({
      from: fromDate,
      to: toDate
    })

    res.json({ verses })
  } catch (error) {
    console.error('Error fetching bible references by weekly range:', error)
    res.status(500).json({ error: error?.message ?? '주간 말씀 참조 조회 중 오류가 발생했습니다.' })
  }
})

const hasOwnProperty = (obj = {}, key) => Object.prototype.hasOwnProperty.call(obj, key)

const parsePositiveInt = (value) => {
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null
  }
  return parsed
}

const normalizeLongLabel = (value) => {
  if (value === null || value === undefined) {
    return null
  }

  const trimmed = String(value).trim()
  return trimmed.length > 0 ? trimmed : null
}

const normalizeSentence = (value) => {
  if (value === null || value === undefined) {
    return null
  }

  const text = String(value).trim()
  return text.length > 0 ? text : null
}

const normalizeReadingPart = (value) => {
  if (value === null || value === undefined) {
    return null
  }

  const normalizedMap = {
    전체: 'all',
    all: 'all',
    상: 'upper',
    upper: 'upper',
    하: 'lower',
    lower: 'lower'
  }

  const key = String(value).trim().toLowerCase()
  return normalizedMap[key] ?? null
}

const buildWeeklyVerseExtraData = (body = {}) => {
  const extraData = {}

  if (hasOwnProperty(body, 'longLabel')) {
    extraData.longLabel = normalizeLongLabel(body.longLabel)
  }

  if (hasOwnProperty(body, 'chapter')) {
    extraData.chapter = parsePositiveInt(body.chapter)
  }

  if (hasOwnProperty(body, 'paragraph')) {
    extraData.paragraph = parsePositiveInt(body.paragraph)
  }

  if (hasOwnProperty(body, 'sentence')) {
    extraData.sentence = normalizeSentence(body.sentence)
  }

  if (hasOwnProperty(body, 'readingPart')) {
    extraData.readingPart = normalizeReadingPart(body.readingPart)
  }

  return Object.fromEntries(
    Object.entries(extraData).filter(([, value]) => value !== undefined)
  )
}

router.post('/weekly_bible_verse_write', multiUpload, async (req, res) => {
  const { title, content, writer, writer_name, board, mainContent } = req.body
  const files = Array.isArray(req.files) ? req.files : []
  const extraData = buildWeeklyVerseExtraData(req.body)

  const pathList = files.map((file) => {
    if (file.originalname) {
      file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')
    }
    return file
  })

  try {
    const payload = {
      title,
      content,
      writer,
      writer_name,
      files: JSON.stringify(pathList),
      board,
      mainContent
    }

    if (Object.keys(extraData).length > 0) {
      payload.extraData = extraData
    }

    const result = await writeContent(payload)

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

router.post('/weekly_bible_verse_delete', async (req, res) => {
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

router.post('/weekly_bible_verse_edit', uploadFields, async (req, res) => {
  const { title, content, id, jsonDeleteKeys = '', board, mainContent } = req.body

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
    board,
    mainContent
  }

  const extraData = buildWeeklyVerseExtraData(req.body)
  if (Object.keys(extraData).length > 0) {
    data.extraData = extraData
  }

  if (hasFileUpdate) {
    data.files = updatedFiles
  }

  try {
    const result = await editContent(data)

    if (!result) {
      return res.status(404).json({ error: 'weekly_bible_verse not found' })
    }
    res.json(!!result)
  } catch (error) {
    console.error('Error fetching:', error)
    res.status(500).json({ error: 'Error fetching weekly_bible_verse' })
  }
})

export default router
