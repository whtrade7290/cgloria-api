import express from 'express';
import { getColumnList, totalColumnCount, getColumnContent } from '../services/columnService.js';

const router = express.Router();

router.post('/column', async (req, res) => {
  const {startRow, pageSize} = req.body
  const data = await getColumnList(startRow, pageSize)
  res.send(data);
});

router.get('/column_count', async (req, res) => {
  const count = await totalColumnCount();
  res.json(count);
});

router.post('/column_detail', async (req, res) => {
  const {id} = req.body;
  try {
    const content = await getColumnContent(id);
    if (!content) {
      return res.status(404).json({ error: 'column not found' });
    }
    console.log(content);
    res.json(content);

  } catch (error) {
    console.error('Error fetching column:', error);
    res.status(500).json({ error: 'Error fetching column' });
  }
});

export default router;
