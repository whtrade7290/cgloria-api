import { prisma } from '../utils/prismaClient.js'

export async function getschoolPhotoList(startRow, pageSize) {
  const data = await prisma.school_photo.findMany({
    orderBy: {
      id: 'desc'
    },
    take: pageSize,
    skip: startRow
  })

  console.log('data: ', data)

  return data.map((item) => ({
    ...item,
    id: Number(item.id)
  }))
}

export async function totalschoolPhotoCount() {
  return await prisma.school_photo.count()
}

export async function getschoolPhotoContent(id) {
  const data = await prisma.school_photo.findUnique({
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

export async function writeSchoolPhotoContent({ title, content, writer, files }) {
  console.log('files: ', files)
  return await prisma.school_photo.create({
    data: {
      title: title,
      content: content,
      writer: writer,
      files: files
    }
  })
}
