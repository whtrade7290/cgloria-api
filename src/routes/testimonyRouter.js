import express from 'express';
import { getTestimonyList, totalTestimonyCount, getTestimonyContent } from '../services/testimonyService.js';

const router = express.Router();

router.post('/testimony', async (req, res) => {
  const {startRow, pageSize} = req.body
  const data = await getTestimonyList(startRow, pageSize)
  res.send(data);
});

router.get('/testimony_count', async (req, res) => {
  const count = await totalTestimonyCount();
  res.json(count);
});

router.post('/testimony_detail', async (req, res) => {
  const {id} = req.body;
  try {
    const content = await getTestimonyContent(id);
    if (!content) {
      return res.status(404).json({ error: 'testimony not found' });
    }
    console.log(content);
    res.json(content);

  } catch (error) {
    console.error('Error fetching testimony:', error);
    res.status(500).json({ error: 'Error fetching testimony' });
  }
});


export default router;
