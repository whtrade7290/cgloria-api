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
    ...data,
    id: Number(data.id)
  }
}

export async function writeClassMeetingContent({
  title,
  content,
  writer,
  mainContent,
  filename,
  extension,
  fileDate
}) {
  if (mainContent) {
    prisma.$transaction(async (prisma) => {
      const createResult = await prisma.class_meeting.create({
        data: {
          title: title,
          content: content,
          writer: writer,
          mainContent: mainContent,
          filename: filename,
          extension: extension,
          fileDate: fileDate
        }
      })
      return await prisma.class_meeting.updateMany({
        data: {
          mainContent: !mainContent
        },
        where: {
          id: { not: createResult.id }
        }
      })
    })
  } else {
    return await prisma.class_meeting.create({
      data: {
        title: title,
        content: content,
        writer: writer,
        mainContent: mainContent,
        filename: filename,
        extension: extension,
        fileDate: fileDate
      }
    })
  }
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

export async function editClassMeetingContent({
  id,
  title,
  content,
  mainContent,
  extension,
  fileDate,
  filename
}) {
  let result = {}

  if (mainContent) {
    result = await prisma.$transaction(async (prisma) => {
      let updateResult

      if (extension !== '' && fileDate !== '' && filename !== '') {
        updateResult = await prisma.class_meeting.update({
          where: { id },
          data: {
            title,
            content,
            mainContent,
            update_at: new Date(),
            extension,
            fileDate,
            filename
          }
        })
      } else {
        updateResult = await prisma.class_meeting.update({
          where: { id },
          data: {
            title,
            content,
            mainContent,
            update_at: new Date()
          }
        })
      }

      const updateManyResult = await prisma.class_meeting.updateMany({
        data: { mainContent: false },
        where: { id: { not: updateResult.id } }
      })

      return { updateResult, updateManyResult }
    })
  } else {
    if (extension !== '' && fileDate !== '' && filename !== '') {
      result = await prisma.class_meeting.update({
        where: { id },
        data: {
          title,
          content,
          mainContent,
          update_at: new Date(),
          extension,
          fileDate,
          filename
        }
      })
    } else {
      result = await prisma.class_meeting.update({
        where: { id },
        data: {
          title,
          content,
          mainContent,
          update_at: new Date()
        }
      })
    }
  }

  return result
}

export async function getMainClassMeeting() {
  const data = await prisma.class_meeting.findFirstOrThrow({
    where: {
      deleted: false,
      mainContent: true
    }
  })
  return {
    ...data,
    id: Number(data.id)
  }
}
