import { prisma } from '../utils/prismaClient.js'

export async function getCommentList(boardId, boardName) {
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

  return data.map((item) => ({
    ...item,
    id: Number(item.id)
  }))
}

// export async function totalSermonCount() {
//   return await prisma.sermons.count({
//     where: {
//       deleted: false
//     }
//   })
// }

export async function writeComment(boardId, boardName, comment, writerName, writer) {
  return await prisma.comments.create({
    data: {
      board_id: boardId,
      board_name: boardName,
      content: comment,
      writer_name: writerName,
      writer: writer
    }
  })
}

// export async function logicalDeleteSermon(id) {
//   return prisma.sermons.update({
//     where: {
//       id: id
//     },
//     data: {
//       deleted: true
//     }
//   })
// }
