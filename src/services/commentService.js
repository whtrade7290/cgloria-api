import { prisma } from '../utils/prismaClient.js'
import { fetchProfileImageUrlByWriter } from '../utils/profileImage.js'

export async function getCommentList(boardId, boardName) {
  try {
    const data = await prisma.comments.findMany({
      where: {
        deleted: false,
        board_id: boardId,
        board_name: boardName
      },
      orderBy: {
        id: 'desc'
      }
    })

    const normalized = data.map((item) => ({
      ...item,
      id: Number(item.id)
    }))

    await Promise.all(
      normalized.map(async (item) => {
        item.writerProfileImageUrl = await fetchProfileImageUrlByWriter(item.writer)
      })
    )

    return normalized
  } catch (error) {
    console.error(error)
  }
}

// export async function totalSermonCount() {
//   return await prisma.sermons.count({
//     where: {
//       deleted: false
//     }
//   })
// }

export async function writeComment(boardId, boardName, comment, writerName, writer) {
  try {
    return await prisma.comments.create({
      data: {
        board_id: boardId,
        board_name: boardName,
        content: comment,
        writer_name: writerName,
        writer: writer
      }
    })
  } catch (error) {
    console.error(error)
  }
}

export async function deleteComment(id) {
  const commentId = Number(id)
  try {
    return await prisma.comments.update({
      where: { id: commentId },
      data: { deleted: true }
    })
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function editComment({ id, comment, writerName }) {
  const commentId = Number(id)
  try {
    return await prisma.comments.update({
      where: { id: commentId },
      data: {
        content: comment,
        ...(writerName && { writer_name: writerName }),
        update_at: new Date()
      }
    })
  } catch (error) {
    console.error(error)
    throw error
  }
}
