import { prisma } from '../utils/prismaClient.js'

export async function getNoticeList(startRow, pageSize) {
  const data = await prisma.notice.findMany({
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

export async function totalNoticeCount() {
  return await prisma.notice.count({
    where: {
      deleted: false
    }
  })
}

export async function getNoticeContent(id) {
  const data = await prisma.notice.findUnique({
    where: { id: parseInt(id) } // id는 integer 형식으로 파싱하여 사용
  })

  return {
    ...data,
    id: Number(data.id)
  }
}

export async function writeNoticeContent({
  title,
  content,
  writer,
  filename,
  extension,
  fileDate
}) {
  return await prisma.notice.create({
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

export async function logicalDeleteNotice(id) {
  return prisma.notice.update({
    where: {
      id: id
    },
    data: {
      deleted: true
    }
  })
}

export function editNoticeContent({ id, title, content, extension, fileDate, filename }) {
  if (extension !== '' && fileDate !== '' && filename !== '') {
    return prisma.notice.update({
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
    return prisma.notice.update({
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
