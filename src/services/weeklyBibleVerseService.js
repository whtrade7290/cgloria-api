import { prisma } from '../utils/prismaClient.js'

const validateDateInput = (value) => {
  if (!value) return null
  const parsed = new Date(value)
  if (isNaN(parsed.getTime())) {
    return null
  }
  return parsed
}

export async function getWeeklyBibleVersesByDateRange({ from, to }) {
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
    orderBy: {
      create_at: 'asc'
    },
    select: {
      id: true,
      title: true,
      content: true,
      writer: true,
      writer_name: true,
      files: true,
      mainContent: true,
      create_at: true,
      update_at: true,
      longLabel: true,
      chapter: true,
      paragraph: true,
      sentence: true,
      readingPart: true
    }
  })

  return weeklyRecords.map((record) => ({
    ...record,
    id: Number(record.id),
    chapter: record.chapter ?? null,
    paragraph: record.paragraph ?? null,
    readingPart: record.readingPart ?? 'all'
  }))
}

export async function getWeeklyVerseReferencesByDateRange({ from, to }) {
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
      OR: [
        { longLabel: { not: null } },
        { chapter: { not: null } },
        { paragraph: { not: null } },
        { sentence: { not: null } }
      ],
      create_at: {
        gte: rangeStart,
        lte: rangeEnd
      }
    },
    select: {
      id: true,
      longLabel: true,
      chapter: true,
      paragraph: true,
      sentence: true,
      readingPart: true,
      title: true,
      content: true
    },
    orderBy: {
      create_at: 'asc'
    }
  })

  return records.map((row) => ({
    id: Number(row.id),
    longLabel: row.longLabel ?? null,
    chapter: row.chapter ?? null,
    paragraph: row.paragraph ?? null,
    sentence: row.sentence ?? null,
    readingPart: row.readingPart ?? 'all',
    title: row.title ?? '',
    content: row.content ?? ''
  }))
}
