import { prisma } from '../utils/prismaClient.js'

export async function getLibraryList(startRow, pageSize, searchWord) {
  if (searchWord === undefined) {
    searchWord = ''
  }

  try {
    const data = await prisma.sunday_school_resources.findMany({
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
    console.error(error)
  }
}

export async function totalLibraryCount(searchWord) {
  if (searchWord === undefined) {
    searchWord = ''
  }

  try {
    return await prisma.sunday_school_resources.count({
      where: {
        deleted: false,
        title: { contains: searchWord }
      }
    })
  } catch (error) {
    console.error(error)
  }
}

export async function getLibraryContent(id) {
  try {
    const data = await prisma.sunday_school_resources.findUnique({
      where: { id: parseInt(id) } // id는 integer 형식으로 파싱하여 사용
    })

    return {
      ...data,
      id: Number(data.id)
    }
  } catch (error) {
    console.error(error)
  }
}

export async function writeLibraryContent({
  title,
  content,
  writer,
  writer_name,
  uuid,
  filename,
  extension,
  fileType
}) {
  return await prisma.sunday_school_resources.create({
    data: {
      title,
      content,
      writer,
      writer_name,
      uuid,
      filename,
      extension,
      fileType
    }
  })
}

export function editLibraryContent({ id, title, content, uuid, filename, extension, fileType }) {
  try {
    if (uuid && filename && extension && fileType) {
      return prisma.sunday_school_resources.update({
        where: {
          id: id
        },
        data: {
          title,
          content,
          update_at: new Date(),
          uuid,
          filename,
          extension,
          fileType
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
  } catch (error) {
    console.error(error)
  }
}

export async function logicalDeleteLibrary(id) {
  try {
    return prisma.notice.update({
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
