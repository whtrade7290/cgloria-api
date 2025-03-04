import { prisma } from '../utils/prismaClient.js'

export async function getPhotoList(startRow, pageSize, searchWord) {

  if (searchWord === undefined) {
    searchWord = ''
  } 
  
  try {
    const data = await prisma.photo.findMany({
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
  } catch (error) {
    console.error('Error fetching photo list from the database:', error)
    throw new Error('사진 목록을 가져오는 중 오류가 발생했습니다.')
  }
}

export async function totalPhotoCount(searchWord) {

  if (searchWord === undefined) {
    searchWord = ''
  } 

  return await prisma.photo.count({
    where: {
      deleted: false,
      title: {contains: searchWord}
    }
  })
}

export async function getPhotoContent(id) {
  const data = await prisma.photo.findUnique({
    where: { id: parseInt(id) } // id는 integer 형식으로 파싱하여 사용
  })

  return {
    ...data,
    id: Number(data.id)
  }
}

export async function writePhotoContent({ title, content, writer, writer_name, files }) {
  return await prisma.photo.create({
    data: {
      title: title,
      content: content,
      writer: writer,
      writer_name: writer_name,
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

export function editPhotoContent({ id, title, content, files = [] }) {
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
