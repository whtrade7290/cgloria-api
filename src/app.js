// app.js
import express from 'express';
import detectPort from 'detect-port';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import bcrypt from 'bcrypt';
import path from 'path';
import { signIn, signUp } from '../src/services/userService.js';

// 테스트 데이터 생성
// import makeTestData from '../src/utils/makeTestData.js';
// makeTestData

import sermonRouter from './routes/sermonRouter.js';
import columnRouter from './routes/columnRouter.js';
import weeklyRouter from './routes/weeklyBibleVersesRouter.js';
import classMeetingRouter from './routes/classMeetingRouter.js';
import libraryRouter from './routes/libraryRouter.js';
import generalForumRouter from './routes/generalForumRouter.js';
import testimonyRouter from './routes/testimonyRouter.js';
import noticeRouter from './routes/noticeRouter.js';
import withDiaryRouter from './routes/withDiaryRouter.js';
import photoRouter from './routes/photoRouter.js';
import schoolPhotoRouter from './routes/schoolPhotoRouter.js';


const app = express();

// server setup
let port;
async function configServer() {
  port = 3000 || (await detectPort(3000));
}

configServer()

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev')); 
app.use(express.json())
app.use('/sermon', sermonRouter)
app.use('/column', columnRouter)
app.use('/weekly', weeklyRouter)
app.use('/classMeeting', classMeetingRouter)
app.use('/library', libraryRouter)
app.use('/generalForum', generalForumRouter)
app.use('/testimony', testimonyRouter)
app.use('/notice', noticeRouter)
app.use('/withDiary', withDiaryRouter)
app.use('/photo', photoRouter)
app.use('/school_photo', schoolPhotoRouter)

app.use('/uploads', express.static(path.join("", 'uploads')));


app.post('/signUp', async (req, res) => {
  const { username, password } = req.body;

  // 비밀번호 암호화
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const obj = signUp(username, hashedPassword)

    res.json(obj);
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ error: 'Error signing up' });
  }
});



app.post('/signIn', async (req, res) => {
  const {username, password } = req.body
  /**
   * Todo: 세션이나 쿠키 처리 하기 user,token
   */
  try {

    const user = await signIn(username, password);

  if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    console.log("user: ", user);
    
    const logedUser = {
      id: parseInt(user.id), 
      username: user.username,
      create_at: user.create_at,
      update_at: user.update_at,
      role: user.role,
      deleted: user.deleted,
      withDiary: user.withDiary ?? 0
    }

    res.status(200).json({
        success: true,
        message: 'Login Success',
        user: logedUser
    });
    
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
  
});




app.get('/');

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


