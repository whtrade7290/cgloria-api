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

export async function getCommentCounts(boardName, boardIds = []) {
  if (!Array.isArray(boardIds) || boardIds.length === 0) {
    return {}
  }

  const normalizedBoardName =
    typeof boardName === 'string'
      ? boardName.trim()
      : String(boardName ?? '').trim()

  if (!normalizedBoardName) {
    return {}
  }

  const normalizedIds = boardIds.map((id) => Number(id)).filter((id) => !Number.isNaN(id))

  if (normalizedIds.length === 0) {
    return {}
  }

  try {
    const grouped = await prisma.comments.groupBy({
      by: ['board_id'],
      where: {
        board_name: normalizedBoardName,
        deleted: false,
        board_id: {
          in: normalizedIds
        }
      },
      _count: {
        board_id: true
      }
    })

    return grouped.reduce((acc, item) => {
      acc[item.board_id] = item._count.board_id
      return acc
    }, {})
  } catch (error) {
    console.error(error)
    throw error
  }
}
