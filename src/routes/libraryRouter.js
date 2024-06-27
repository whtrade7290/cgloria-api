import express from 'express';
import { getLibraryList, totalLibraryCount, getLibraryContent } from '../services/libraryService.js';

const router = express.Router();

router.post('/library', async (req, res) => {
  const {startRow, pageSize} = req.body
  const data = await getLibraryList(startRow, pageSize)
  res.send(data);
});

router.get('/library_count', async (req, res) => {
  const count = await totalLibraryCount();
  res.json(count);
});

router.post('/library_detail', async (req, res) => {
  const {id} = req.body;
  try {
    const content = await getLibraryContent(id);
    if (!content) {
      return res.status(404).json({ error: 'library not found' });
    }
    console.log(content);
    res.json(content);

  } catch (error) {
    console.error('Error fetching library:', error);
    res.status(500).json({ error: 'Error fetching library' });
  }
});


export default router;
