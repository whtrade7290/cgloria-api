import { prisma } from '../utils/prismaClient.js'

export async function getPhotoList(startRow, pageSize) {
  const data = await prisma.photo.findMany({
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

export async function totalPhotoCount() {
  return await prisma.photo.count({
    where: {
      deleted: false
    }
  })
}

export async function getPhotoContent(id) {
  const data = await prisma.photo.findUnique({
    where: { id: parseInt(id) } // id는 integer 형식으로 파싱하여 사용
  })

  return {
    id: Number(data.id),
    title: data.title,
    content: data.content,
    writer: data.writer,
    files: data.files,
    create_at: data.create_at,
    update_at: data.update_at,
    deleted: data.deleted
  }
}

export async function writePhotoContent({ title, content, writer, files }) {
  return await prisma.photo.create({
    data: {
      title: title,
      content: content,
      writer: writer,
      files: files
    }
  })
}

export async function logicalDeletePhoto(id) {
  return prisma.photo.update({
    where: {
      id: id
    },
    data: {
      deleted: true
    }
  })
}

export function editPhotoContent({ id, title, content, files }) {
  if (files.length === 0) {
    return prisma.photo.update({
      where: {
        id: id
      },
      data: {
        title: title,
        content: content
      }
    })
  } else {
    return prisma.photo.update({
      where: {
        id: id
      },
      data: {
        title: title,
        content: content,
        files: JSON.stringify(files)
      }
    })
  }
}
