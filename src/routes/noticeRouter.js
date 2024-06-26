import express from 'express';
import { getNoticeList, totalNoticeCount, getNoticeContent } from '../services/noticeService.js';

const router = express.Router();

router.post('/notice', async (req, res) => {
  const {startRow, pageSize} = req.body
  const data = await getNoticeList(startRow, pageSize)
  res.send(data);
});

router.get('/notice_count', async (req, res) => {
  const count = await totalNoticeCount();
  res.json(count);
});

router.post('/notice_detail', async (req, res) => {
  const {id} = req.body;
  try {
    const content = await getNoticeContent(id);
    if (!content) {
      return res.status(404).json({ error: 'Notice not found' });
    }
    console.log(content);
    res.json(content);

  } catch (error) {
    console.error('Error fetching notice:', error);
    res.status(500).json({ error: 'Error fetching notice' });
  }
});


export default router;
