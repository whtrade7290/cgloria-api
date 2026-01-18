import express from 'express'
import multer from 'multer'
import { parse } from 'csv-parse/sync'
import {
  createSchedule,
  createSchedules,
  getSchedulesBetween,
  logScheduleUpload,
  DEFAULT_SCHEDULE_COLOR,
  updateSchedule,
  deleteSchedule
} from '../services/scheduleService.js'
import { findUserById } from '../services/userService.js'

const router = express.Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
})

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/
const parseCsv = (buffer) => {
  return parse(buffer.toString('utf8'), {
    columns: true,
    skip_empty_lines: true,
    trim: true
  })
}

const normalizeDate = (value) => (typeof value === 'string' ? value.trim() : '')
const normalizeText = (value) => (typeof value === 'string' ? value.trim() : '')

const buildDate = (dateString, endOfDay = false) => {
  if (!DATE_REGEX.test(dateString)) return null
  const [year, month, day] = dateString.split('-').map((value) => Number(value))
  if (!year || !month || !day) {
    return null
  }

  return new Date(
    Date.UTC(year, month - 1, day, endOfDay ? 23 : 0, endOfDay ? 59 : 0, endOfDay ? 59 : 0)
  )
}

const toPlainSchedule = (schedule) => {
  if (!schedule) return null

  return {
    id: schedule.id ? Number(schedule.id) : undefined,
    title: schedule.title,
    start: schedule.start ? schedule.start.toISOString().slice(0, 10) : undefined,
    end: schedule.end ? schedule.end.toISOString().slice(0, 10) : undefined,
    color: schedule.color || DEFAULT_SCHEDULE_COLOR
  }
}

const extractUserId = (body = {}) => {
  return body.userId ?? body.user_id ?? body.adminId ?? body.id
}

const resolveAdminUser = async (req, res) => {
  const userId = extractUserId(req.body)
  if (!userId) {
    res.status(400).json({ message: 'userId가 필요합니다.' })
    return null
  }

  const user = await findUserById(userId)
  if (!user) {
    res.status(404).json({ message: '사용자를 찾을 수 없습니다.' })
    return null
  }

  if (user.role !== 'ADMIN') {
    res.status(403).json({ message: '관리자만 접근할 수 있습니다.' })
    return null
  }

  return user
}

const normalizeColor = (value) => {
  if (!value) return DEFAULT_SCHEDULE_COLOR
  if (typeof value !== 'string') return DEFAULT_SCHEDULE_COLOR
  const trimmed = value.trim()
  if (!trimmed) return DEFAULT_SCHEDULE_COLOR
  const upper = trimmed.toUpperCase()
  const regex = /^#([0-9A-F]{6})$/
  return regex.test(upper) ? upper : DEFAULT_SCHEDULE_COLOR
}

const buildSchedulePayload = ({ title, start, end, color, adminUser, errors }) => {
  const normalizedTitle = normalizeText(title)
  const normalizedStart = normalizeDate(start)
  let normalizedEnd = normalizeDate(end)
  const normalizedColor = normalizeColor(color)

  if (!normalizedTitle) {
    errors.push('제목이 필요합니다.')
  }

  if (!normalizedStart) {
    errors.push('시작일이 필요합니다.')
  } else if (!DATE_REGEX.test(normalizedStart)) {
    errors.push('시작일 형식이 올바르지 않습니다.')
  }

  if (!normalizedEnd) {
    normalizedEnd = normalizedStart
  } else if (!DATE_REGEX.test(normalizedEnd)) {
    errors.push('종료일 형식이 올바르지 않습니다.')
  }

  const startDate = buildDate(normalizedStart)
  const endDate = buildDate(normalizedEnd, true)

  if (!startDate || !endDate) {
    errors.push('날짜 변환에 실패했습니다.')
  }

  if (errors.length > 0) {
    return null
  }

  return {
    title: normalizedTitle,
    start: startDate,
    end: endDate,
    color: normalizedColor,
    created_by: adminUser?.username ?? null
  }
}

const handleValidationErrors = (res, errors) => {
  if (errors.length > 0) {
    res.status(400).json({ message: errors.join('\n') })
    return true
  }
  return false
}

const parseScheduleId = (idParam) => {
  if (!idParam) return null
  const parsed = Number(idParam)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null
}

router.post('/csv_upload', upload.single('file'), async (req, res) => {
  const adminUser = await resolveAdminUser(req, res)
  if (!adminUser) {
    return
  }

  if (!req.file) {
    return res.status(400).json({ message: 'CSV 파일이 필요합니다.' })
  }

  let records = []
  try {
    records = parseCsv(req.file.buffer)
  } catch (error) {
    console.error('CSV 파싱 실패:', error)
    return res.status(400).json({ message: 'CSV 파싱에 실패했습니다.' })
  }

  const validEntries = []
  const errors = []

  records.forEach((row, index) => {
    const rowNumber = index + 2 // header = row 1
    const title = normalizeText(row.title)
    const start = normalizeDate(row.start)
    let end = normalizeDate(row.end)
    const color = DEFAULT_SCHEDULE_COLOR
    const reasons = []

    if (!title) {
      reasons.push('제목이 비어 있음')
    }

    if (!start) {
      reasons.push('시작일이 비어 있음')
    } else if (!DATE_REGEX.test(start)) {
      reasons.push('날짜 형식이 올바르지 않음')
    }

    if (!end) {
      end = start
    } else if (!DATE_REGEX.test(end)) {
      reasons.push('종료일 형식이 올바르지 않음')
    }

    if (reasons.length > 0) {
      errors.push({ row: rowNumber, reason: reasons.join(', ') })
      return
    }

    const startDate = buildDate(start)
    const endDate = buildDate(end, true)

    if (!startDate || !endDate) {
      errors.push({ row: rowNumber, reason: '날짜 변환에 실패했습니다.' })
      return
    }

    validEntries.push({
      title,
      start: startDate,
      end: endDate,
      color,
      created_by: adminUser.username ?? null
    })
  })

  let successCount = 0
  if (validEntries.length > 0) {
    try {
      successCount = await createSchedules(validEntries)
    } catch (error) {
      return res.status(500).json({ message: '스케줄 저장 중 오류가 발생했습니다.' })
    }
  }

  const failCount = errors.length

  await logScheduleUpload({
    filename: req.file.originalname,
    uploader: adminUser.username,
    successCount,
    failCount,
    errors
  })

  res.json({
    successCount,
    failCount,
    errors
  })
})

router.get('/', async (req, res) => {
  const start = normalizeDate(req.query.start)
  const end = normalizeDate(req.query.end)

  if (!start || !end) {
    return res.status(400).json({ message: 'start와 end 파라미터가 필요합니다.' })
  }

  if (!DATE_REGEX.test(start) || !DATE_REGEX.test(end)) {
    return res.status(400).json({ message: '날짜 형식이 올바르지 않습니다. (YYYY-MM-DD)' })
  }

  const startDate = buildDate(start)
  const endDate = buildDate(end, true)

  try {
    const schedules = await getSchedulesBetween(startDate, endDate)
    const events = schedules.map((schedule) => toPlainSchedule(schedule))

    res.json(events)
  } catch (error) {
    res.status(500).json({ message: '스케줄 조회 중 오류가 발생했습니다.' })
  }
})

router.post('/single', async (req, res) => {
  const adminUser = await resolveAdminUser(req, res)
  if (!adminUser) {
    return
  }

  const errors = []
  const payload = buildSchedulePayload({
    title: req.body.title,
    start: req.body.start,
    end: req.body.end,
    color: req.body.color,
    adminUser,
    errors
  })

  if (handleValidationErrors(res, errors) || !payload) {
    return
  }

  try {
    const created = await createSchedule(payload)

    res.json({
      success: true,
      schedule: toPlainSchedule(created)
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: '스케줄 생성 중 오류가 발생했습니다.' })
  }
})

router.put('/:id', async (req, res) => {
  const adminUser = await resolveAdminUser(req, res)
  if (!adminUser) {
    return
  }

  const scheduleId = parseScheduleId(req.params.id)
  if (!scheduleId) {
    return res.status(400).json({ message: '유효한 스케줄 ID가 필요합니다.' })
  }

  const errors = []
  const payload = buildSchedulePayload({
    title: req.body.title,
    start: req.body.start,
    end: req.body.end,
    color: req.body.color,
    adminUser: null,
    errors
  })

  if (handleValidationErrors(res, errors) || !payload) {
    return
  }

  try {
    const updated = await updateSchedule(scheduleId, {
      title: payload.title,
      start: payload.start,
      end: payload.end,
      color: payload.color,
      update_at: new Date()
    })

    res.json({
      success: true,
      schedule: toPlainSchedule(updated)
    })
  } catch (error) {
    console.error(error)
    if (error.code === 'P2025') {
      return res.status(404).json({ message: '스케줄을 찾을 수 없습니다.' })
    }
    res.status(500).json({ message: '스케줄 수정 중 오류가 발생했습니다.' })
  }
})

router.delete('/:id', async (req, res) => {
  const adminUser = await resolveAdminUser(req, res)
  if (!adminUser) {
    return
  }

  const scheduleId = parseScheduleId(req.params.id)
  if (!scheduleId) {
    return res.status(400).json({ message: '유효한 스케줄 ID가 필요합니다.' })
  }

  try {
    await deleteSchedule(scheduleId)
    res.json({ success: true })
  } catch (error) {
    console.error(error)
    if (error.code === 'P2025') {
      return res.status(404).json({ message: '스케줄을 찾을 수 없습니다.' })
    }
    res.status(500).json({ message: '스케줄 삭제 중 오류가 발생했습니다.' })
  }
})

router.get('/csv_sample', (req, res) => {
  const header = 'title,start,end'
  const rows = [
    ['속회 방학', '2026-01-01', '2026-01-01'],
    ['새벽 예배', '2026-01-02', '2026-01-01']
  ]

  const csv = [header, ...rows.map((row) => row.join(','))].join('\n')
  res.setHeader('Content-Type', 'text/csv; charset=utf-8')
  res.setHeader('Content-Disposition', 'attachment; filename="schedule-sample.csv"')
  res.send(csv)
})

export default router
