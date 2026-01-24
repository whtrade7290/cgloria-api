import { prisma } from '../utils/prismaClient.js'
import { fetchProfileImageUrlByWriter } from '../utils/profileImage.js'

const MAIN_CONTENT_BOARDS = ['sermon', 'column', 'weekly_bible_verse', 'class_meeting', 'testimony']
const LANGUAGE_AWARE_BOARDS = ['column', 'class_meeting']
const SUPPORTED_LANGUAGES = ['ko', 'ja']
const DEFAULT_LANGUAGE = 'ko'

const hasMainContentFeature = (board) => MAIN_CONTENT_BOARDS.includes(board)
const hasLanguageField = (board) => LANGUAGE_AWARE_BOARDS.includes(board)

const normalizeLanguage = (language) => {
  if (typeof language !== 'string') return undefined
  const normalized = language.trim().toLowerCase()
  return SUPPORTED_LANGUAGES.includes(normalized) ? normalized : undefined
}

const resolveLanguageForWrite = (board, language) => {
  if (!hasLanguageField(board)) return undefined
  return normalizeLanguage(language) ?? DEFAULT_LANGUAGE
}

const resolveLanguageForUpdate = async (tx, board, id, language) => {
  if (!hasLanguageField(board)) return undefined
  const normalized = normalizeLanguage(language)
  if (normalized) return normalized

  const current = await tx[board].findUnique({
    where: { id },
    select: { language: true }
  })

  return current?.language ?? DEFAULT_LANGUAGE
}

const parseMainContentFlag = (value) => {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    const lowered = value.trim().toLowerCase()
    if (lowered === 'true') return true
    if (lowered === 'false') return false
  }
  if (typeof value === 'number') {
    return value === 1
  }
  return false
}

const resetExistingMainContent = async (tx, board, language) => {
  const where = { mainContent: true }
  if (hasLanguageField(board)) {
    where.language = language ?? DEFAULT_LANGUAGE
  }

  await tx[board].updateMany({
    where,
    data: { mainContent: false }
  })
}

export async function writeContent({
  title,
  content,
  writer,
  writer_name,
  files,
  board,
  mainContent,
  language
}) {

  const normalizedMainContent = parseMainContentFlag(mainContent) === true
  const boardSupportsMainContent = hasMainContentFeature(board)
  const boardLanguage = resolveLanguageForWrite(board, language)

  try {
    return await prisma.$transaction(async (tx) => {
      // mainContent가 true라면 기존 것을 모두 false로
      if (boardSupportsMainContent && normalizedMainContent) {
        await resetExistingMainContent(tx, board, boardLanguage)
      }

      let data = {
          title,
          content,
          writer,
          writer_name,
          files
      }

      if (boardSupportsMainContent) {
        data.mainContent = normalizedMainContent
      }

      if (boardLanguage) {
        data.language = boardLanguage
      }

      // 새로운 레코드 생성
      const created = await tx[board].create({
        data: data
      });

      return created;
    });
  } catch (error) {
    console.error("writeContent error:", error);
    throw error;
  }
}



export async function getContentList(startRow, pageSize, searchWord, board) {
  if (searchWord === undefined) {
    searchWord = ''
  }

  try {
    const data = await prisma[board].findMany({
      where: {
        deleted: false,
        title: { contains: searchWord }
      },
      orderBy: {
        id: 'desc'
      },
      take: pageSize,
      skip: startRow
    })

    return data.map((item) => ({
      ...item,
      id: Number(item.id)
    }))
  } catch (error) {
    console.error('Error fetching photo list from the database:', error)
    throw new Error('데이터를 가져오는 중 오류가 발생했습니다.')
  }
}

export async function getContentById(id, board) {
  try {
    const data = await prisma[board].findUnique({
      where: { id: parseInt(id) } // id는 integer 형식으로 파싱하여 사용
    })

    if (!data) return null

    const writerProfileImageUrl = await fetchProfileImageUrlByWriter(data.writer)

    return {
      ...data,
      id: Number(data.id),
      writerProfileImageUrl
    }
  } catch (error) {
    console.error(error)
  }
}

export async function editContent({ id, title, content, files, board, mainContent, language }) {
  const normalizedMainContent = parseMainContentFlag(mainContent) === true
  const boardSupportsMainContent = hasMainContentFeature(board)
  const boardHasLanguage = hasLanguageField(board)

  try {
    const updateData = {
      title,
      content
    }

    if (boardSupportsMainContent) {
      updateData.mainContent = normalizedMainContent
    }

    if (files !== undefined) {
      updateData.files = JSON.stringify(files)
    }

    if (boardHasLanguage && normalizeLanguage(language)) {
      updateData.language = normalizeLanguage(language)
    }

    if (boardSupportsMainContent && normalizedMainContent) {
      return await prisma.$transaction(async (tx) => {
        const effectiveLanguage = boardHasLanguage
          ? await resolveLanguageForUpdate(tx, board, id, language)
          : undefined

        await resetExistingMainContent(tx, board, effectiveLanguage)

        if (boardHasLanguage && !updateData.language && effectiveLanguage) {
          updateData.language = effectiveLanguage
        }

        return tx[board].update({
          where: { id },
          data: updateData
        })
      })
    }

    // 수정 쿼리 실행
    return await prisma[board].update({
      where: { id },
      data: updateData
    })

  } catch (error) {
    console.error("editContent error:", error);
    throw error;
  }
}

export async function totalContentCount(searchWord, board) {
  if (searchWord === undefined) {
    searchWord = ''
  }

  try {
    return await prisma[board].count({
      where: {
        deleted: false,
        title: { contains: searchWord }
      }
    })
  } catch (error) {
    console.error(error)
  }
}

export async function logicalDeleteContent(id, board) {
  try {
    return prisma[board].update({
      where: {
        id: id
      },
      data: {
        deleted: true
      }
    })
  } catch (error) {
    console.error(error)
  }
}

export async function totalPhotoCount(searchWord) {
  if (searchWord === undefined) {
    searchWord = ''
  }

  try {
    return await prisma.photo.count({
      where: {
        deleted: false,
        title: { contains: searchWord }
      }
    })
  } catch (error) {
    console.error(error)
  }
}

export async function getMainContent(board, language) {
  try {
    const where = { mainContent: true }

    if (hasLanguageField(board)) {
      where.language = normalizeLanguage(language) ?? DEFAULT_LANGUAGE
    }

    const data = await prisma[board].findFirst({
      where
    })

    if (!data) return null

    return {
      ...data,
      id: Number(data.id)
    }
  } catch (error) {
    console.error(error)
  }
}
