import { prisma } from '../utils/prismaClient.js'

export async function getWithDiaryList(startRow, pageSize, roomId) {
  console.log('roomId: ', roomId)
  const data = await prisma.withDiary.findMany({
    where: {
      diaryRoomId: Number(roomId),
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

export async function totalWithDiaryCount(id) {
  console.log("id: ", id);
  return await prisma.withDiary.count({
    where: {
      diaryRoomId: id
    }
  })
}

export async function getWithDiaryContent(id) {
  const data = await prisma.withDiary.findUnique({
    where: { id: parseInt(id) } // id는 integer 형식으로 파싱하여 사용
  })

  return {
    ...data,
    id: Number(data.id)
  }
}

export async function writeWithDiaryContent({
  title,
  content,
  writer,
  filename,
  extension,
  fileDate,
  withDiaryNum
}) {
  return await prisma.withDiary.create({
    data: {
      title: title,
      content: content,
      writer: writer,
      filename: filename,
      extension: extension,
      fileDate: fileDate,
      withDiaryNum: withDiaryNum
    }
  })
}

export async function logicalDeleteWithDiary(id) {
  return prisma.withDiary.update({
    where: {
      id: id
    },
    data: {
      deleted: true
    }
  })
}

export function editWithDiaryContent({ id, title, content, extension, fileDate, filename }) {
  if (extension !== '' && fileDate !== '' && filename !== '') {
    return prisma.withDiary.update({
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
    return prisma.withDiary.update({
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

export async function createDiaryRoomWithUsers(teamName, userIdList) {
  console.log('teamName: ', teamName)
  console.log('userIdList: ', userIdList)

  try {
    const diaryRoom = await prisma.$transaction(async (tx) => {
      // Step 1: Create the diary room
      const createdDiaryRoom = await tx.withDiaryRoom.create({
        data: {
          cohort: teamName,
          creator: 'test1'
        }
      })

      // Step 2: Create UserDiaryRoom entries for each user
      const userDiaryRooms = userIdList.map((userId) => ({
        userId,
        diaryRoomId: createdDiaryRoom.id
      }))

      await tx.userDiaryRoom.createMany({
        data: userDiaryRooms
      })

      return createdDiaryRoom
    })

    return diaryRoom
  } catch (error) {
    console.error('Error creating diary room and users:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

export function fetchWithDiaryRoomList(userId) {
  const result = prisma.userDiaryRoom.findMany({
    where: {
      userId: userId
    },
    include: {
      diaryRoom: true // withDiaryRoom 데이터를 함께 가져옴
    }
  })

  return result
}

export function getWithDiaryRoom(roomId) {
  return prisma.withDiaryRoom.findUnique({
    where: {
      id: Number(roomId)
    }
  })
}




