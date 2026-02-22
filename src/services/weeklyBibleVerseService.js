import { prisma } from '../utils/prismaClient.js'

const validateDateInput = (value) => {
  if (!value) return null
  const parsed = new Date(value)
  if (isNaN(parsed.getTime())) {
    return null
  }
  return parsed
}

export async function getWeeklyBibleVersesWithBiblesByDateRange({ from, to }) {
  const fromDate = validateDateInput(from)
  const toDate = validateDateInput(to)

  if (!fromDate || !toDate) {
    throw new Error('유효한 날짜(from/to)를 입력해주세요.')
  }

  let rangeStart = fromDate
  let rangeEnd = toDate

  if (fromDate > toDate) {
    rangeStart = toDate
    rangeEnd = fromDate
  }

  rangeStart = new Date(rangeStart)
  rangeEnd = new Date(rangeEnd)
  rangeStart.setHours(0, 0, 0, 0)
  rangeEnd.setHours(23, 59, 59, 999)

  const weeklyRecords = await prisma.weekly_bible_verse.findMany({
    where: {
      deleted: false,
      create_at: {
        gte: rangeStart,
        lte: rangeEnd
      }
    },
    include: {
      bible: true
    },
    orderBy: {
      create_at: 'asc'
    }
  })

  return weeklyRecords.map((record) => ({
    ...record,
    id: Number(record.id)
  }))
}

export async function getBibleIdsByWeeklyDateRange({ from, to }) {
  const fromDate = validateDateInput(from)
  const toDate = validateDateInput(to)

  if (!fromDate || !toDate) {
    throw new Error('유효한 날짜(from/to)를 입력해주세요.')
  }

  let rangeStart = fromDate
  let rangeEnd = toDate

  if (fromDate > toDate) {
    rangeStart = toDate
    rangeEnd = fromDate
  }

  rangeStart = new Date(rangeStart)
  rangeEnd = new Date(rangeEnd)
  rangeStart.setHours(0, 0, 0, 0)
  rangeEnd.setHours(23, 59, 59, 999)

  const records = await prisma.weekly_bible_verse.findMany({
    where: {
      deleted: false,
      bible_id: { not: null },
      create_at: {
        gte: rangeStart,
        lte: rangeEnd
      }
    },
    select: {
      bible_id: true
    },
    orderBy: {
      create_at: 'asc'
    }
  })

  return records
    .map((row) => Number(row.bible_id))
    .filter((id, index, arr) => Number.isInteger(id) && id > 0 && arr.indexOf(id) === index)
}

export async function getWeeklyBibleVerseWithBible(id, includeBible) {
  const record = await prisma.weekly_bible_verse.findUnique({
    where: { id: Number(id) }
  })

  if (!record) {
    return null
  }

  const formattedRecord = {
    ...record,
    id: Number(record.id)
  }

  if (!includeBible || !record?.bible_id) {
    return formattedRecord
  }

  const bible = await prisma.bible.findUnique({
    where: { idx: Number(record.bible_id) }
  })

  return {
    ...formattedRecord,
    bible
  }
}
