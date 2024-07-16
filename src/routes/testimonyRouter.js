import express from 'express';
import { getTestimonyList, totalTestimonyCount, getTestimonyContent, writeTestimonyContent } from '../services/testimonyService.js';
import  upload  from "../utils/multer.js";

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

router.post('/testimony_write',upload.single('fileField'),  async (req, res) => {
  const {title, content, writer} = req.body;
  const fileData = req.fileData || {}; 

  try {
    await writeTestimonyContent({
      title,
      content,
      writer,
      extension: fileData.extension ?? '',
      fileDate: fileData.date ?? '',
      filename: fileData.filename ?? ''
    });

  } catch (error) {
    console.error('Error fetching:', error);
    res.status(500).json({ error: 'Error fetching testimony' });
  }
})


export default router;
