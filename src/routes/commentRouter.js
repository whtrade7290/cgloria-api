import express from 'express'
import { writeComment, getCommentList } from '../services/commentService.js'

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

export default router
