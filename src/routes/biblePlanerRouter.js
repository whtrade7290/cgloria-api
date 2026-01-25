import express from 'express'
import fs from 'fs'
import { generateBiblePlanCsv, HttpError } from '../services/biblePlaner.js'
import { getBibleBooks, getChaptersByBook, getParagraphs, getBibleVerses, getBibleVerseById } from '../services/bibleService.js'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const { filePath, outputFilename } = await generateBiblePlanCsv(req.body?.days)
    const encodedFilename = encodeURIComponent(outputFilename)
    const options = {
      headers: {
        'Content-Disposition': `attachment; filename="${outputFilename}"; filename*=UTF-8''${encodedFilename}`,
        'Content-Type': 'text/csv; charset=utf-8'
      }
    }

    res.download(filePath, outputFilename, options, (err) => {
      if (err) {
        console.error('파일 다운로드 오류:', err)
        if (!res.headersSent) {
          res.status(500).json({ error: '파일 다운로드 중 오류가 발생했습니다.' })
        } else {
          fs.unlink(filePath, () => {})
        }
      } else {
        fs.unlink(filePath, () => {})
      }
    })
  } catch (error) {
    console.error('/bible 처리 오류:', error)
    if (error instanceof HttpError) {
      return res.status(error.status).json({ error: error.message })
    }
    res.status(500).json({ error: '요청 처리 중 서버 오류가 발생했습니다.' })
  }
})

router.get('/books', async (req, res) => {
  try {
    const books = await getBibleBooks()
    res.json(books)
  } catch (error) {
    console.error('/bible/books 조회 오류:', error)
    res.status(500).json({ error: '성경 목록 조회 중 오류가 발생했습니다.' })
  }
})

router.get('/chapters', async (req, res) => {
  const { long_label: longLabel } = req.query

  if (!longLabel) {
    return res.status(400).json({ error: 'long_label이 필요합니다.' })
  }

  try {
    const chapters = await getChaptersByBook(longLabel)
    res.json(chapters)
  } catch (error) {
    console.error('/bible/chapters 조회 오류:', error)
    res.status(500).json({ error: error?.message ?? '장 조회 중 오류가 발생했습니다.' })
  }
})

router.get('/paragraphs', async (req, res) => {
  const { long_label: longLabel, chapter } = req.query

  if (!longLabel || chapter === undefined) {
    return res.status(400).json({ error: 'long_label과 chapter가 모두 필요합니다.' })
  }

  try {
    const paragraphs = await getParagraphs(longLabel, chapter)
    res.json(paragraphs)
  } catch (error) {
    console.error('/bible/paragraphs 조회 오류:', error)
    res.status(500).json({ error: error?.message ?? '절 조회 중 오류가 발생했습니다.' })
  }
})

router.post('/verse', async (req, res) => {
  const { long_label: longLabel, chapter, paragraph } = req.body ?? {}

  if (!longLabel || chapter === undefined || paragraph === undefined) {
    return res.status(400).json({ error: 'long_label, chapter, paragraphs를 모두 입력해주세요.' })
  }

  try {
    const data = await getBibleVerses(longLabel, chapter, paragraph)
    res.json(data[0])
  } catch (error) {
    console.error('/bible/verse 조회 오류:', error)
    res.status(500).json({ error: error?.message ?? '구절 조회 중 오류가 발생했습니다.' })
  }
})

router.get('/verse/:id', async (req, res) => {
  try {
    const verse = await getBibleVerseById(req.params.id)
    if (!verse) {
      return res.status(404).json({ error: '해당 bible_id를 찾을 수 없습니다.' })
    }
    res.json(verse)
  } catch (error) {
    console.error('/bible/verse/:id 조회 오류:', error)
    res.status(500).json({ error: error?.message ?? '구절 조회 중 오류가 발생했습니다.' })
  }
})

export default router
