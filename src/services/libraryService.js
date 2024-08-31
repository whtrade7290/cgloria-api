import { prisma } from '../utils/prismaClient.js'

export async function getLibraryList(startRow, pageSize) {
  const data = await prisma.sunday_school_resources.findMany({
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

export async function totalLibraryCount() {
  return await prisma.sunday_school_resources.count()
}

export async function getLibraryContent(id) {
  const data = await prisma.sunday_school_resources.findUnique({
    where: { id: parseInt(id) } // id는 integer 형식으로 파싱하여 사용
  })

  return {
    ...data,
    id: Number(data.id)
  }
}

export async function writeLibraryContent({
  title,
  content,
  writer,
  filename,
  extension,
  fileDate
}) {
  return await prisma.sunday_school_resources.create({
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

export function editLibraryContent({ id, title, content, extension, fileDate, filename }) {
  if (extension !== '' && fileDate !== '' && filename !== '') {
    return prisma.sunday_school_resources.update({
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
    return prisma.sunday_school_resources.update({
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

export async function logicalDeleteLibrary(id) {
  return prisma.notice.update({
    where: {
      id: id
    },
    data: {
      deleted: true
    }
  })
}
