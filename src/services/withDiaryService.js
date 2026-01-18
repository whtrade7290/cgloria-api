import { prisma } from '../utils/prismaClient.js'
import { fetchProfileImageUrlByWriter } from '../utils/profileImage.js'

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

    if (!data) {
      return null
    }

    const writerProfileImageUrl = await fetchProfileImageUrlByWriter(data.writer)

    return {
      ...data,
      id: Number(data.id),
      writerProfileImageUrl
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

export async function getDiaryRoomUsers(diaryRoomId) {
  if (!diaryRoomId && diaryRoomId !== 0) {
    return []
  }

  try {
    const rows = await prisma.user_diary_room.findMany({
      where: {
        diaryRoomId: Number(diaryRoomId)
      },
      orderBy: {
        createdAt: 'asc'
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
            role: true,
            create_at: true,
            update_at: true
          }
        }
      }
    })

    return rows.map((row) => ({
      id: row.id,
      diaryRoomId: row.diaryRoomId,
      createdAt: row.createdAt,
      userId: Number(row.userId),
      user: row.user
        ? {
            ...row.user,
            id: Number(row.user.id)
          }
        : null
    }))
  } catch (error) {
    console.error('getDiaryRoomUsers error:', error)
    throw error
  }
}

export async function removeDiaryRoomUser({ diaryRoomId, userId }) {
  if (!diaryRoomId && diaryRoomId !== 0) {
    throw new Error('diaryRoomId is required')
  }
  if (!userId && userId !== 0) {
    throw new Error('userId is required')
  }

  try {
    const result = await prisma.user_diary_room.deleteMany({
      where: {
        diaryRoomId: Number(diaryRoomId),
        userId: BigInt(userId)
      }
    })

    return result.count > 0
  } catch (error) {
    console.error('removeDiaryRoomUser error:', error)
    throw error
  }
}

export async function removeDiaryRoom(diaryRoomId) {
  if (!diaryRoomId && diaryRoomId !== 0) {
    throw new Error('diaryRoomId is required')
  }

  try {
    return await prisma.$transaction(async (tx) => {
      await tx.user_diary_room.deleteMany({
        where: { diaryRoomId: Number(diaryRoomId) }
      })

      const result = await tx.with_diary_room.delete({
        where: { id: Number(diaryRoomId) }
      })

      return result
    })
  } catch (error) {
    console.error('removeDiaryRoom error:', error)
    throw error
  }
}
