import express from 'express';
import { getNoticeList, totalNoticeCount, getNoticeContent, writeNoticeContent, logicalDeleteNotice } from '../services/noticeService.js';
import  upload  from "../utils/multer.js";

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

router.post('/notice_write',upload.single('fileField'),  async (req, res) => {
   const {title, content, writer} = req.body;

   const fileData = req.fileData || {}; 

  try {
    await writeNoticeContent({
      title,
      content,
      writer,
      extension: fileData.extension ?? '',
      fileDate: fileData.date ?? '',
      filename: fileData.filename ?? ''
    });
 
  } catch (error) {
    console.error('Error fetching notice:', error);
    res.status(500).json({ error: 'Error fetching notice' });
  }
})

router.post('/notice_delete', async (req, res) => {
  const {id} = req.body;
  try {
    const result = await logicalDeleteNotice(id);
    
    if (!result) {
      return res.status(404).json({ error: 'Notice not found' });
    }
    res.json(!!result);
  } catch (error) {
    console.error('Error fetching Notice:', error);
    res.status(500).json({ error: 'Error fetching Notice' });
  }
});

export default router;
