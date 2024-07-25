import express from 'express';
import { getWithDiaryList, totalWithDiaryCount, writeWithDiaryContent, getWithDiaryContent} from '../services/withDiaryService.js';
import  upload  from "../utils/multer.js";

const router = express.Router();

router.post('/withDiary', async (req, res) => {
  const {startRow, pageSize, withDiary} = req.body
  const data = await getWithDiaryList(startRow, pageSize, withDiary)
  res.send(data);
});

router.post('/withDiary_count', async (req, res) => {
  const {withDiary} = req.body
  const count = await totalWithDiaryCount(withDiary);
  res.json(count);
});

router.post('/withDiary_detail', async (req, res) => {
  const {id} = req.body;
  try {
    const content = await getWithDiaryContent(id);
    if (!content) {
      return res.status(404).json({ error: 'WithDiary not found' });
    }
    console.log(content);
    res.json(content);

  } catch (error) {
    console.error('Error fetching WithDiary:', error);
    res.status(500).json({ error: 'Error fetching WithDiary' });
  }
});

router.post('/withDiary_write',upload.single('fileField'),  async (req, res) => {
  const {title, content, writer, withDiaryNum} = req.body;
  const fileData = req.fileData || {}; 

  console.log("withDiaryNum: ", withDiaryNum);
  try {
    await writeWithDiaryContent({
      title,
      content,
      writer,
      extension: fileData.extension ?? '',
      fileDate: fileData.date ?? '',
      filename: fileData.filename ?? '',
      withDiaryNum: Number(withDiaryNum)
    });

  } catch (error) {
    console.error('Error fetching:', error);
    res.status(500).json({ error: 'Error fetching WithDiary' });
  }
})

export default router;
