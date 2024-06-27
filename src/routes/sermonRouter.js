import express from 'express';
import { getSermonList, totalSermonCount, getSermonContent } from '../services/sermonService.js';

const router = express.Router();

router.post('/sermon', async (req, res) => {
  const {startRow, pageSize} = req.body
  const data = await getSermonList(startRow, pageSize)
  res.send(data);
});

router.get('/sermon_count', async (req, res) => {
  const count = await totalSermonCount();
  res.json(count);
});

router.post('/sermon_detail', async (req, res) => {
  const {id} = req.body;
  try {
    const content = await getSermonContent(id);
    if (!content) {
      return res.status(404).json({ error: 'Sermon not found' });
    }
    console.log(content);
    res.json(content);

  } catch (error) {
    console.error('Error fetching sermon:', error);
    res.status(500).json({ error: 'Error fetching sermon' });
  }
});


export default router;
