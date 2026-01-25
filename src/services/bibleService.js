import { prisma } from '../utils/prismaClient.js'

export async function getBibleBooks() {
  const rows = await prisma.bible.findMany({
    distinct: ['long_label'],
    select: { long_label: true },
    orderBy: {
      long_label: 'asc'
    }
  })

  return rows.map((row) => row.long_label)
}

export async function getChaptersByBook(longLabel) {
  if (!longLabel) {
    throw new Error('long_label을 입력해주세요.')
  }

  const rows = await prisma.bible.findMany({
    where: {
      long_label: longLabel
    },
    distinct: ['chapter'],
    select: { chapter: true },
    orderBy: {
      chapter: 'asc'
    }
  })

  return rows.map((row) => Number(row.chapter))
}

export async function getParagraphs(longLabel, chapter) {
  if (!longLabel || (chapter === undefined || chapter === null)) {
    throw new Error('long_label과 chapter를 모두 입력해주세요.')
  }

  const parsedChapter = Number(chapter)

  if (!Number.isInteger(parsedChapter) || parsedChapter <= 0) {
    throw new Error('chapter는 1 이상의 정수여야 합니다.')
  }

  const rows = await prisma.bible.findMany({
    where: {
      long_label: longLabel,
      chapter: parsedChapter
    },
    select: { paragraph: true },
    orderBy: {
      paragraph: 'asc'
    }
  })

  return rows.map((row) => Number(row.paragraph))
}

export async function getBibleVerseById(idx) {
  const parsedId = Number(idx)
  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    throw new Error('유효한 bible_id를 입력해주세요.')
  }

  const row = await prisma.bible.findUnique({
    where: { idx: parsedId }
  })

  if (!row) {
    return null
  }

  return {
    ...row,
    idx: Number(row.idx),
    chapter: Number(row.chapter),
    paragraph: Number(row.paragraph),
    cate: Number(row.cate),
    book: Number(row.book),
    count: Number(row.count),
    countOfChapter: Number(row.countOfChapter)
  }
}

export async function getBibleVersesByIds(ids) {
  if (!Array.isArray(ids) || ids.length === 0) {
    return []
  }

  const normalizedIds = ids
    .map((value) => Number(value))
    .filter((num) => Number.isInteger(num) && num > 0)

  if (normalizedIds.length === 0) {
    return []
  }

  const rows = await prisma.bible.findMany({
    where: {
      idx: { in: normalizedIds }
    }
  })

  const formatted = rows.map((row) => ({
    ...row,
    idx: Number(row.idx),
    chapter: Number(row.chapter),
      paragraph: Number(row.paragraph),
      cate: Number(row.cate),
      book: Number(row.book),
      count: Number(row.count),
      countOfChapter: Number(row.countOfChapter)
  }))

  const rowMap = new Map(formatted.map((row) => [row.idx, row]))

  return normalizedIds.map((id) => rowMap.get(id)).filter(Boolean)
}

const normalizeParagraphInput = (paragraphs) => {
  if (paragraphs === undefined || paragraphs === null) {
    return []
  }

  let list = []

  if (Array.isArray(paragraphs)) {
    list = paragraphs
  } else if (typeof paragraphs === 'string') {
    list = paragraphs
      .split(',')
      .map((value) => value.trim())
      .filter((value) => value.length > 0)
  } else {
    list = [paragraphs]
  }

  const normalized = list
    .map((value) => Number(value))
    .filter((num) => Number.isInteger(num) && num > 0)

  return Array.from(new Set(normalized)).sort((a, b) => a - b)
}

export async function getBibleVerses(longLabel, chapter, paragraph) {
  if (!longLabel) {
    throw new Error('long_label을 입력해주세요.')
  }

  const parsedChapter = Number(chapter)
  if (!Number.isInteger(parsedChapter) || parsedChapter <= 0) {
    throw new Error('chapter는 1 이상의 정수여야 합니다.')
  }

  const normalizedParagraph = normalizeParagraphInput(paragraph)
  if (normalizedParagraph.length === 0) {
    throw new Error('하나 이상의 paragraph를 입력해주세요.')
  }

  const rows = await prisma.bible.findMany({
    where: {
      long_label: longLabel,
      chapter: parsedChapter,
      paragraph: { in: normalizedParagraph }
    },
    orderBy: {
      paragraph: 'asc'
    }
  })

  return rows.map((row) => ({
    ...row,
    idx: Number(row.idx),
    chapter: Number(row.chapter),
    paragraph: Number(row.paragraph),
    cate: Number(row.cate),
    book: Number(row.book),
    count: Number(row.count),
    countOfChapter: Number(row.countOfChapter)
  }))
}
