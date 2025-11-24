import { prisma } from '../utils/prismaClient.js'

export async function getWithDiaryList(startRow = 0, pageSize = 0, roomId = 0) {
  try {
    const data = await prisma.with_diary.findMany({
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
  } catch (error) {
    console.error(error)
  }
}

export async function getWithDiaryAll() {
  try {
    const data = await prisma.with_diary_room.findMany({
      orderBy: {
        id: 'desc'
      }
    })

    return data.map((item) => ({
      id: Number(item.id),
      roomName: item.roomName,
      creator_name: item.creator_name,
      update_at: item.update_at
    }))
  } catch (error) {
    console.error(error)
  }
}

export async function totalWithDiaryCount(id) {
  try {
    return await prisma.with_diary.count({
      where: {
        diaryRoomId: id
      }
    })
  } catch (error) {
    console.error(error)
  }
}

export async function getWithDiaryContent(id) {
  try {
    const data = await prisma.with_diary.findUnique({
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

export async function writeWithDiaryContent({
  title,
  content,
  writer,
  writer_name,
  files,
  diaryRoomId
}) {
  try {
    return await prisma.with_diary.create({
      data: {
        title: title,
        content: content,
        writer: writer,
        writer_name: writer_name,
        files,
        diaryRoomId: diaryRoomId
      }
    })
  } catch (error) {
    console.error(error)
  }
}

export async function logicalDeleteWithDiary(id) {
  try {
    return prisma.with_diary.update({
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

export function editWithDiaryContent({ id, title, content, files }) {
  try {
    if (files) {
      return prisma.with_diary.update({
        where: {
          id: id
        },
        data: {
          title,
          content,
          update_at: new Date(),
          files
        }
      })
    } else {
      return prisma.with_diary.update({
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
  } catch (error) {
    console.error(error)
  }
}

export async function createDiaryRoomWithUsers(teamName, userIdList, creator, creator_name) {
  try {
    const diaryRoom = await prisma.$transaction(async (tx) => {
      // Step 1: Create the diary room
      const createdDiaryRoom = await tx.with_diary_room.create({
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

      await tx.user_diary_room.createMany({
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

export async function fetchWithDiaryRoomList(userId) {
  try {
    return prisma.user_diary_room.findMany({
      where: { userId },
      include: { diaryRoom: true }
    })
  } catch (error) {
    console.error('Error fetching:', error)
    res.status(500).json({ error: 'Error fetching WithDiary RoomList' })
  }
}

export function getWithDiaryRoom(roomId) {
  try {
    return prisma.with_diary_room.findUnique({
      where: {
        id: Number(roomId)
      }
    })
  } catch (error) {
    console.error(error)
  }
}
