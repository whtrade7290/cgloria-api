import { prisma } from '../utils/prismaClient.js'

export async function getschoolPhotoList(startRow, pageSize, searchWord) {

  if (searchWord === undefined) {
    searchWord = ''
  } 

  const data = await prisma.school_photo.findMany({
    where: {
      deleted: false,
      title: {contains: searchWord}
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

export async function totalschoolPhotoCount(searchWord) {

  if (searchWord === undefined) {
    searchWord = ''
  }   

  return await prisma.school_photo.count({
    where: {
      deleted: false,
      title: {contains: searchWord}
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

export async function writeSchoolPhotoContent({ title, content, writer, writer_name, files }) {
  return await prisma.school_photo.create({
    data: {
      title: title,
      content: content,
      writer: writer,
      writer_name: writer_name,
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
