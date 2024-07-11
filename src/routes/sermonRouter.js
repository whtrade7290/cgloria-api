import express from 'express';
import { getSermonList, totalSermonCount, getSermonContent, writeSermonContent } from '../services/sermonService.js';
import multer from 'multer';

let filename = "";
let extension = "";
let date = "";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const match = file.originalname.match(/^([\w\d_-]*)\.?([\w\d]*)$/);
     filename = match[1];
     extension = '.' + match[2];
     date = Date.now().toString();
    cb(null, filename + '_' + date + extension)
  }
})

const upload = multer({ storage: storage })

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



router.post('/sermon_write',upload.single('avatar'),  async (req, res) => {
  console.log("filename: ", filename);
  console.log("extension: ", extension);
  console.log("date: ", date);
  const {title, content, writer} = req.body;
  const obj = {
    title: title,
    content: content,
    writer: writer,
    filename: filename,
    extension: extension,
    fileDate: date
  }
  try {
   const result = await writeSermonContent(obj)
  } catch (error) {
    console.error('Error fetching sermon:', error);
    res.status(500).json({ error: 'Error fetching sermon' });
  }
})

export default router;
