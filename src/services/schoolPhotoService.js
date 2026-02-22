import { prisma } from '../utils/prismaClient.js'

export async function getschoolPhotoList(startRow, pageSize, searchWord) {
  if (searchWord === undefined) {
    searchWord = ''
  }

  try {
    const data = await prisma.school_photo.findMany({
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

export async function totalschoolPhotoCount(searchWord) {
  if (searchWord === undefined) {
    searchWord = ''
  }
  try {
    return await prisma.school_photo.count({
      where: {
        deleted: false,
        title: { contains: searchWord }
      }
    })
  } catch (error) {
    console.error(error)
  }
}

export async function getschoolPhotoContent(id) {
  try {
    const data = await prisma.school_photo.findUnique({
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

export async function writeSchoolPhotoContent({ title, content, writer, writer_name, files }) {
  try {
    return await prisma.school_photo.create({
      data: {
        title: title,
        content: content,
        writer: writer,
        writer_name: writer_name,
        files: files
      }
    })
  } catch (error) {
    console.error(error)
  }
}

export async function logicalDeleteSchoolPhoto(id) {
  try {
    return prisma.school_photo.update({
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

export function editSchoolPhotoContent({ id, title, content, files }) {
  try {
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
  } catch (error) {
    console.error(error)
  }
}
