import express from 'express';
import { getGeneralForumList, totalGeneralForumCount, getGeneralForumContent, writeGeneralForumContent } from '../services/generalForumService.js';
import  upload  from "../utils/multer.js";

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

router.post('/generalForum_write',upload.single('fileField'),  async (req, res) => {
  const {title, content, writer} = req.body;
  const fileData = req.fileData || {}; 

  try {
    await writeGeneralForumContent({
      title,
      content,
      writer,
      extension: fileData.extension ?? '',
      fileDate: fileData.date ?? '',
      filename: fileData.filename ?? ''
    });

  } catch (error) {
    console.error('Error fetching:', error);
    res.status(500).json({ error: 'Error fetching generalForum' });
  }
})


export default router;
