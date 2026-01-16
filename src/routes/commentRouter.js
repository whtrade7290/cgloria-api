import express from 'express'
import { writeComment, getCommentList, deleteComment, editComment } from '../services/commentService.js'

const router = express.Router()

router.post('/comment', async (req, res) => {
  const { boardId, boardName } = req.body

  const data = await getCommentList(boardId, boardName)
  res.send(data)
})

router.post('/comment_write', async (req, res) => {
  const { boardId, boardName, comment, writerName, writer } = req.body

  try {
    const result = await writeComment(boardId, boardName, comment, writerName, writer)

    if (!result) {
      return res.status(404).json({ error: 'Comment not found' })
    }

    res.json(!!result)
  } catch (error) {
    console.error('Error fetching Comment:', error)
    res.status(500).json({ error: 'Error fetching Comment' })
  }
})

router.post('/comment_delete', async (req, res) => {
  const { id, commentId } = req.body
  const targetId = commentId ?? id

  if (targetId === undefined || targetId === null) {
    return res.status(400).json({ error: '삭제할 댓글 ID를 입력해주세요.' })
  }

  try {
    const result = await deleteComment(targetId)

    if (!result) {
      return res.status(404).json({ error: 'Comment not found' })
    }

    res.json(true)
  } catch (error) {
    console.error('Error deleting Comment:', error)
    res.status(500).json({ error: '댓글 삭제 중 오류가 발생했습니다.' })
  }
})

router.post('/comment_edit', async (req, res) => {
  const { id, commentId, comment, writerName } = req.body
  const targetId = commentId ?? id

  if (targetId === undefined || targetId === null) {
    return res.status(400).json({ error: '수정할 댓글 ID를 입력해주세요.' })
  }

  if (!comment || comment.trim() === '') {
    return res.status(400).json({ error: '수정할 내용을 입력해주세요.' })
  }

  try {
    const result = await editComment({ id: targetId, comment, writerName })

    if (!result) {
      return res.status(404).json({ error: 'Comment not found' })
    }

    res.json(true)
  } catch (error) {
    console.error('Error editing Comment:', error)
    res.status(500).json({ error: '댓글 수정 중 오류가 발생했습니다.' })
  }
})

export default router
