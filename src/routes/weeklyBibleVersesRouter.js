import express from 'express';
import { getWeeklyList, totalWeeklyCount, getWeeklyContent, writeWeeklyContent } from '../services/weeklyService.js';
import  upload  from "../utils/multer.js";

const router = express.Router();

router.post('/weekly', async (req, res) => {
  const {startRow, pageSize} = req.body
  const data = await getWeeklyList(startRow, pageSize)
  res.send(data);
});

router.get('/weekly_count', async (req, res) => {
  const count = await totalWeeklyCount();
  res.json(count);
});

router.post('/weekly_detail', async (req, res) => {
  const {id} = req.body;
  try {
    const content = await getWeeklyContent(id);
    if (!content) {
      return res.status(404).json({ error: 'weekly not found' });
    }
    console.log(content);
    res.json(content);

  } catch (error) {
    console.error('Error fetching weekly:', error);
    res.status(500).json({ error: 'Error fetching weekly' });
  }
});

router.post('/weekly_write',upload.single('fileField'),  async (req, res) => {
  const {title, content, writer} = req.body;
  const fileData = req.fileData || {}; 

  try {
    await writeWeeklyContent({
      title,
      content,
      writer,
      extension: fileData.extension ?? '',
      fileDate: fileData.date ?? '',
      filename: fileData.filename ?? ''
    });

  } catch (error) {
    console.error('Error fetching:', error);
    res.status(500).json({ error: 'Error fetching weekly' });
  }
})


export default router;
