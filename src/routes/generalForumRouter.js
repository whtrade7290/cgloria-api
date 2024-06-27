import express from 'express';
import { getGeneralForumList, totalGeneralForumCount, getGeneralForumContent } from '../services/generalForumService.js';

const router = express.Router();

router.post('/generalForum', async (req, res) => {
  const {startRow, pageSize} = req.body
  const data = await getGeneralForumList(startRow, pageSize)
  res.send(data);
});

router.get('/generalForum_count', async (req, res) => {
  const count = await totalGeneralForumCount();
  res.json(count);
});

router.post('/generalForum_detail', async (req, res) => {
  const {id} = req.body;
  try {
    const content = await getGeneralForumContent(id);
    if (!content) {
      return res.status(404).json({ error: 'generalForum not found' });
    }
    console.log(content);
    res.json(content);

  } catch (error) {
    console.error('Error fetching generalForum:', error);
    res.status(500).json({ error: 'Error fetching generalForum' });
  }
});


export default router;
