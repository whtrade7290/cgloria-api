import { prisma } from '../utils/prismaClient.js'

export async function getschoolPhotoList(startRow, pageSize) {
  const data = await prisma.school_photo.findMany({
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

export async function totalschoolPhotoCount() {
  return await prisma.school_photo.count({
    where: {
      deleted: false
    }
  })
}

export async function getschoolPhotoContent(id) {
  const data = await prisma.school_photo.findUnique({
    where: { id: parseInt(id) } // id는 integer 형식으로 파싱하여 사용
  })

  return {
    ...data,
    id: Number(data.id)
  }
}

export async function writeSchoolPhotoContent({ title, content, writer, files }) {
  return await prisma.school_photo.create({
    data: {
      title: title,
      content: content,
      writer: writer,
      files: files
    }
  })
}

export async function logicalDeleteSchoolPhoto(id) {
  return prisma.school_photo.update({
    where: {
      id: id
    },
    data: {
      deleted: true
    }
  })
}

export function editSchoolPhotoContent({ id, title, content, files }) {
  if (files.length === 0) {
    return prisma.school_photo.update({
      where: {
        id: id
      },
      data: {
        title: title,
        content: content
      }
    })
  } else {
    return prisma.school_photo.update({
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
