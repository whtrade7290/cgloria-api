import express from 'express'
import fs from 'fs'
import { generateBiblePlanCsv, HttpError } from '../services/biblePlaner.js'

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

export default router
