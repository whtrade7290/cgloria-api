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
    id: Number(data.id),
    title: data.title,
    content: data.content,
    writer: data.writer,
    filename: data.filename,
    extension: data.extension,
    fileDate: data.fileDate,
    create_at: data.create_at,
    update_at: data.update_at,
    deleted: data.deleted
  }
}

export async function writeWeeklyContent({
  title,
  content,
  writer,
  filename,
  extension,
  fileDate
}) {
  return await prisma.weekly_bible_verses.create({
    data: {
      title: title,
      content: content,
      writer: writer,
      filename: filename,
      extension: extension,
      fileDate: fileDate
    }
  })
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

export function editWeeklyContent({ id, title, content, extension, fileDate, filename }) {
  if (extension !== '' && fileDate !== '' && filename !== '') {
    return prisma.weekly_bible_verses.update({
      where: {
        id: id
      },
      data: {
        title: title,
        content: content,
        update_at: new Date(),
        extension: extension,
        fileDate: fileDate,
        filename: filename
      }
    })
  } else {
    return prisma.weekly_bible_verses.update({
      where: {
        id: id
      },
      data: {
        title: title,
        content: content,
        update_at: new Date()
      }
    })
  }
}
