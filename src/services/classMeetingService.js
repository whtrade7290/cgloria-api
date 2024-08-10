import { prisma } from '../utils/prismaClient.js'

export async function getClassMeetingList(startRow, pageSize) {
  const data = await prisma.class_meeting.findMany({
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

export async function totalClassMeetingCount() {
  return await prisma.class_meeting.count({
    where: {
      deleted: false
    }
  })
}

export async function getClassMeetingContent(id) {
  const data = await prisma.class_meeting.findUnique({
    where: { id: parseInt(id) } // id는 integer 형식으로 파싱하여 사용
  })

  return {
    id: Number(data.id),
    title: data.title,
    content: data.content,
    writer: data.writer,
    filename: data.filename,
    extension: data.extension,
    fileDate: data.fileDate,
    create_at: data.create_at,
    update_at: data.update_at,
    deleted: data.deleted
  }
}

export async function writeClassMeetingContent({
  title,
  content,
  writer,
  filename,
  extension,
  fileDate
}) {
  return await prisma.class_meeting.create({
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

export async function logicalDeleteClassMeeting(id) {
  return prisma.class_meeting.update({
    where: {
      id: id
    },
    data: {
      deleted: true
    }
  })
}

export function editClassMeetingContent({ id, title, content, extension, fileDate, filename }) {
  if (extension !== '' && fileDate !== '' && filename !== '') {
    return prisma.class_meeting.update({
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
    return prisma.class_meeting.update({
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
