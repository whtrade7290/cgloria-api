import fs from 'fs'
import path from 'path'
import { createObjectCsvWriter } from 'csv-writer'
import { prisma } from '../utils/prismaClient.js'

const RESULT_DIR = path.join(process.cwd(), 'result')

export class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

function ensureResultDir() {
  if (!fs.existsSync(RESULT_DIR)) {
    fs.mkdirSync(RESULT_DIR, { recursive: true })
  }
}

export function validateDaysInput(days) {
  const parsedDays = Number(days)
  if (!Number.isInteger(parsedDays) || parsedDays <= 0) {
    throw new HttpError(400, '유효한 통독 일수를 입력하세요.')
  }
  return parsedDays
}

export async function fetchBibleChapters() {
  const chapters = await prisma.bible.findMany({
    distinct: ['book', 'chapter'],
    select: {
      idx: true,
      long_label: true,
      chapter: true,
      book: true,
      countOfChapter: true
    },
    orderBy: {
      idx: 'asc'
    }
  })

  return chapters.map((row) => ({
    ...row,
    idx: Number(row.idx),
    chapter: Number(row.chapter),
    book: Number(row.book),
    countOfChapter: Number(row.countOfChapter)
  }))
}

export function buildReadingPlan(results, days) {
  const allCount = results.reduce((sum, obj) => sum + obj.countOfChapter, 0)
  const countAvg = Math.floor(allCount / days)

  try {
    return divideBibleByDays(results, countAvg, 0.01, days)
  } catch (error) {
    throw new HttpError(500, '통독 데이터를 분할하지 못했습니다.')
  }
}

export async function createPlanCsv(bibleList, days) {
  ensureResultDir()
  const outputFilename = `성경통독표(${days}일).csv`
  const filePath = path.join(RESULT_DIR, outputFilename)

  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: [
      { id: 'date', title: '날짜' },
      { id: 'startLabel', title: '성경(시작)' },
      { id: 'startChapter', title: '장(시작)' },
      { id: 'endLabel', title: '성경(끝)' },
      { id: 'endChapter', title: '장(끝)' },
      { id: 'addSum', title: '글 수' }
    ]
  })

  const records = bibleList.map((item, date) => ({
    date: date + 1,
    startLabel: item.startChapter.long_label,
    startChapter: item.startChapter.chapter,
    endLabel: item.endChapter.long_label,
    endChapter: item.endChapter.chapter,
    addSum: item.endChapter.addSum
  }))

  await csvWriter.writeRecords(records)
  return { filePath, outputFilename }
}

export function buildBibleChunks(results, countAvg, range) {
  const bibleList = []
  const min = Math.floor(countAvg - countAvg * range)
  let addSum = 0

  let chpterObj = {
    startChapter: { idx: 0, long_label: '', chapter: 0 },
    endChapter: { idx: 0, long_label: '', chapter: 0 }
  }

  for (let i = 0; i < results.length; i += 1) {
    const obj = results[i]

    if (addSum === 0) {
      chpterObj.startChapter = {
        idx: obj.idx,
        long_label: obj.long_label,
        chapter: obj.chapter,
        addSum
      }
    }

    addSum += obj.countOfChapter

    if (addSum > min) {
      chpterObj.endChapter = {
        idx: obj.idx,
        long_label: obj.long_label,
        chapter: obj.chapter,
        addSum
      }

      bibleList.push(chpterObj)
      addSum = 0
      chpterObj = {
        startChapter: { idx: 0, long_label: '', chapter: 0 },
        endChapter: { idx: 0, long_label: '', chapter: 0 }
      }
    }
  }

  if (addSum > 0) {
    const last = results[results.length - 1]
    chpterObj.endChapter = {
      idx: last.idx,
      long_label: last.long_label,
      chapter: last.chapter,
      addSum
    }
    bibleList.push(chpterObj)
  }

  return bibleList
}

export function divideBibleByDays(results, countAvg, range, days, options = {}) {
  const { tolerance = 0, maxIterations = 5000, step = 0.001 } = options
  let currentRange = Math.max(step, range)
  let bestPlan = null
  let bestDiff = Infinity

  for (let i = 0; i < maxIterations; i += 1) {
    const bibleList = buildBibleChunks(results, countAvg, currentRange)
    const diff = Math.abs(bibleList.length - days)

    if (diff < bestDiff) {
      bestDiff = diff
      bestPlan = bibleList
    }

    if (diff <= tolerance) {
      return bibleList
    }

    if (bibleList.length < days) {
      currentRange += step
    } else {
      currentRange = Math.max(step, currentRange - step)
    }
  }

  if (!bestPlan) {
    throw new Error('성경 통독 데이터를 분할할 수 없습니다.')
  }

  return bestPlan
}

export async function generateBiblePlanCsv(days) {
  const normalizedDays = validateDaysInput(days)
  const bibleData = await fetchBibleChapters()
  const biblePlan = buildReadingPlan(bibleData, normalizedDays)
  return createPlanCsv(biblePlan, normalizedDays)
}
