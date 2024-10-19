import { prisma } from '../utils/prismaClient.js'

export async function getWithDiaryList(startRow = 0, pageSize = 0, roomId = 0) {
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
  console.log('id: ', id)
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
  writer_name,
  filename,
  extension,
  fileDate,
  diaryRoomId
}) {
  return await prisma.withDiary.create({
    data: {
      title: title,
      content: content,
      writer: writer,
      writer_name: writer_name,
      filename: filename,
      extension: extension,
      fileDate: fileDate,
      diaryRoomId: diaryRoomId
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

export function editWithDiaryContent({ id, title, content, uuid, filename, extension, fileType }) {
  if (uuid && filename && extension && fileType) {
    return prisma.withDiary.update({
      where: {
        id: id
      },
      data: {
        title,
        content,
        mainContent,
        update_at: new Date(),
        uuid,
        filename,
        extension,
        fileType
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

export async function createDiaryRoomWithUsers(teamName, userIdList, creator, creator_name) {
  console.log('teamName: ', teamName)
  console.log('userIdList: ', userIdList)

  try {
    const diaryRoom = await prisma.$transaction(async (tx) => {
      // Step 1: Create the diary room
      const createdDiaryRoom = await tx.withDiaryRoom.create({
        data: {
          roomName: teamName,
          creator: creator,
          creator_name: creator_name
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
  try {
    const result = prisma.userDiaryRoom.findMany({
      where: {
        userId: userId
      },
      include: {
        diaryRoom: true // withDiaryRoom 데이터를 함께 가져옴
      }
    })

    return result
  } catch (error) {
    console.error('Error fetching:', error)
    res.status(500).json({ error: 'Error fetching WithDiary RoomList' })
  }
}

export function getWithDiaryRoom(roomId) {
  return prisma.withDiaryRoom.findUnique({
    where: {
      id: Number(roomId)
    }
  })
}
