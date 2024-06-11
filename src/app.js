// app.js
import express from 'express';
import detectPort from 'detect-port';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import bcrypt from 'bcrypt';
import { newToken } from '../src/utils/auth.js'
import {login} from '../src/services/userService.js';
import {getSermonList} from '../src/services/boardService.js';



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
app.use(morgan('dev')); // log requestc

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  // 비밀번호 암호화
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
    const obj = {
      id: parseInt(user.id), 
      username: user.username,
      password: user.password,
      create_at: user.create_at,
      update_at: user.update_at,
      role: user.role,
      deleted: user.deleted,
      // token
    }
    res.json(obj);
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ error: 'Error signing up' });
  }
});



app.post('/login', async (req, res) => {
  const {username, password } = req.body
  /**
   * Todo: 세션이나 쿠키 처리 하기 user,token
   */
  try {

    const user = await login(username, password);

  if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = newToken(user);
    console.log("Todo: 세션이나 쿠키 처리 하기 user,token");
    console.log("user: ", user.username);
    console.log("token: ", token);
    
    const logedUser = {
      id: parseInt(user.id), 
      username: user.username,
      create_at: user.create_at,
      update_at: user.update_at,
      role: user.role,
      deleted: user.deleted,
      token: token
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

app.get('/sermon', (req, res) => {
 const data =  getSermonList()

 console.log("data: ", data);
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


