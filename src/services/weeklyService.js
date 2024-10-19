import { prisma } from '../utils/prismaClient.js'

export async function getWeeklyList(startRow, pageSize) {
  const data = await prisma.weekly_bible_verses.findMany({
    where: {
      deleted: false
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
}

export async function totalWeeklyCount() {
  return await prisma.weekly_bible_verses.count({
    where: {
      deleted: false
    }
  })
}

export async function getWeeklyContent(id) {
  const data = await prisma.weekly_bible_verses.findUnique({
    where: { id: parseInt(id) } // id는 integer 형식으로 파싱하여 사용
  })

  return {
    ...data,
    id: Number(data.id)
  }
}

export async function writeWeeklyContent({
  title,
  content,
  writer,
  writer_name,
  mainContent,
  uuid,
  filename,
  extension,
  fileType
}) {
  if (mainContent) {
    prisma.$transaction(async (prisma) => {
      const createResult = await prisma.weekly_bible_verses.create({
        data: {
          title,
          content,
          writer,
          writer_name,
          mainContent,
          uuid,
          filename,
          extension,
          fileType
        }
      })
      return await prisma.weekly_bible_verses.updateMany({
        data: {
          mainContent: !mainContent
        },
        where: {
          id: { not: createResult.id }
        }
      })
    })
  } else {
    return await prisma.weekly_bible_verses.create({
      data: {
        title,
        content,
        writer,
        writer_name,
        mainContent,
        uuid,
        filename,
        extension,
        fileType
      }
    })
  }
}

export async function logicalDeleteWeekly(id) {
  return prisma.weekly_bible_verses.update({
    where: {
      id: id
    },
    data: {
      deleted: true
    }
  })
}

export async function editWeeklyContent({
  id,
  title,
  content,
  mainContent,
  uuid,
  filename,
  extension,
  fileType
}) {
  let result = {}

  if (mainContent) {
    result = await prisma.$transaction(async (prisma) => {
      let updateResult

      if (uuid && filename && extension && fileType) {
        updateResult = await prisma.weekly_bible_verses.update({
          where: { id },
          data: {
            title,
            content,
            mainContent,
            update_at: new Date(),
            uuid,
            filename,
            extension,
            fileType
          }
        })
      } else {
        updateResult = await prisma.weekly_bible_verses.update({
          where: { id },
          data: {
            title,
            content,
            mainContent,
            update_at: new Date()
          }
        })
      }

      const updateManyResult = await prisma.weekly_bible_verses.updateMany({
        data: { mainContent: false },
        where: { id: { not: updateResult.id } }
      })

      return { updateResult, updateManyResult }
    })
  } else {
    if (uuid && filename && extension && fileType) {
      result = await prisma.weekly_bible_verses.update({
        where: { id },
        data: {
          title,
          content,
          mainContent,
          update_at: new Date(),
          uuid,
          filename,
          extension,
          fileType
        }
      })
    } else {
      result = await prisma.weekly_bible_verses.update({
        where: { id },
        data: {
          title,
          content,
          mainContent,
          update_at: new Date()
        }
      })
    }
  }

  return result
}

export async function getMainWeekly() {
  const data = await prisma.weekly_bible_verses.findFirstOrThrow({
    where: {
      deleted: false,
      mainContent: true
    }
  })
  console.log('data: ', data)

  return {
    ...data,
    id: Number(data.id)
  }
}
