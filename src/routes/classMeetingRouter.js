import express from 'express';
import { getClassMeetingList, totalClassMeetingCount, getClassMeetingContent } from '../services/classMeetingService.js';

const router = express.Router();

router.post('/classMeeting', async (req, res) => {
  const {startRow, pageSize} = req.body
  const data = await getClassMeetingList(startRow, pageSize)
  res.send(data);
});

router.get('/classMeeting_count', async (req, res) => {
  const count = await totalClassMeetingCount();
  res.json(count);
});

router.post('/classMeeting_detail', async (req, res) => {
  const {id} = req.body;
  try {
    const content = await getClassMeetingContent(id);
    if (!content) {
      return res.status(404).json({ error: 'classMeeting not found' });
    }
    console.log(content);
    res.json(content);

  } catch (error) {
    console.error('Error fetching classMeeting:', error);
    res.status(500).json({ error: 'Error fetching classMeeting' });
  }
});


export default router;
