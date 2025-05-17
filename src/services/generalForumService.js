import { prisma } from '../utils/prismaClient.js'

export async function getGeneralForumList(startRow, pageSize, searchWord) {
  if (searchWord === undefined) {
    searchWord = ''
  }

  const data = await prisma.general_forum.findMany({
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
}

export async function totalGeneralForumCount(searchWord) {
  if (searchWord === undefined) {
    searchWord = ''
  }

  return await prisma.general_forum.count({
    where: {
      deleted: false,
      title: { contains: searchWord }
    }
  })
}

export async function getGeneralForumContent(id) {
  const data = await prisma.general_forum.findUnique({
    where: { id: parseInt(id) } // id는 integer 형식으로 파싱하여 사용
  })

  return {
    ...data,
    id: Number(data.id)
  }
}

export async function writeGeneralForumContent({
  title,
  content,
  writer,
  writer_name,
  uuid,
  filename,
  extension,
  fileType
}) {
  return await prisma.general_forum.create({
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

export async function logicalDeleteGeneralForum(id) {
  return prisma.general_forum.update({
    where: {
      id: id
    },
    data: {
      deleted: true
    }
  })
}

export function editGeneralForumContent({
  id,
  title,
  content,
  uuid,
  filename,
  extension,
  fileType
}) {
  if (uuid && filename && extension && fileType) {
    return prisma.general_forum.update({
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
    return prisma.general_forum.update({
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
