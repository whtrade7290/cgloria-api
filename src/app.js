// app.js
import express from 'express'
import detectPort from 'detect-port'
import bodyParser from 'body-parser'
import cors from 'cors'
import morgan from 'morgan'
import bcrypt from 'bcrypt'
import path from 'path'
import { signIn, signUp, findUser } from '../src/services/userService.js'
import {
  auth,
  makeAccessToken,
  makeRefreshToken,
  checkingAccessToken,
  checkingRefreshToken
} from './auth.js'

// 테스트 데이터 생성
// import makeTestData from '../src/utils/makeTestData.js';
// makeTestData

import sermonRouter from './routes/sermonRouter.js'
import columnRouter from './routes/columnRouter.js'
import weeklyRouter from './routes/weeklyBibleVersesRouter.js'
import classMeetingRouter from './routes/classMeetingRouter.js'
import libraryRouter from './routes/libraryRouter.js'
import generalForumRouter from './routes/generalForumRouter.js'
import testimonyRouter from './routes/testimonyRouter.js'
import noticeRouter from './routes/noticeRouter.js'
import withDiaryRouter from './routes/withDiaryRouter.js'
import photoRouter from './routes/photoRouter.js'
import schoolPhotoRouter from './routes/schoolPhotoRouter.js'
import commentRouter from './routes/commentRouter.js'

const app = express()

// server setup
let port
async function configServer() {
  port = 3000 || (await detectPort(3000))
}
// auth()
configServer()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(express.json())
app.use('/sermon', sermonRouter)
app.use('/column', columnRouter)
app.use('/weekly', weeklyRouter)
app.use('/classMeeting', classMeetingRouter)
app.use('/library', libraryRouter)
app.use('/generalForum', generalForumRouter)
app.use('/testimony', testimonyRouter)
app.use('/notice', noticeRouter)
app.use('/withDiary', auth, withDiaryRouter)
app.use('/photo', photoRouter)
app.use('/school_photo', schoolPhotoRouter)
app.use('/comment', commentRouter)

app.use('/uploads', express.static(path.join('', 'uploads')))

app.post('/signUp', async (req, res) => {
  const { username, password } = req.body

  // 비밀번호 암호화
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const obj = signUp(username, hashedPassword)

    res.json(obj)
  } catch (error) {
    console.error('Error signing up:', error)
    res.status(500).json({ error: 'Error signing up' })
  }
})

app.post('/signIn', async (req, res) => {
  const { username, password } = req.body
  const payload = {
    username: username,
    password: password
  }

  const accessToken = makeAccessToken(payload)
  const refreshToken = makeRefreshToken(payload)

  try {
    const user = await signIn(username)

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    const logedUser = {
      id: parseInt(user.id),
      username: user.username,
      name: user.name,
      create_at: user.create_at,
      update_at: user.update_at,
      role: user.role,
      deleted: user.deleted,
      withDiary: user.withDiary ?? 0
    }

    res.status(200).json({
      success: true,
      message: 'Login Success',
      user: logedUser,
      token: accessToken,
      refreshToken: refreshToken
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ error: 'Error fetching users' })
  }
})

app.post('/check_Token', async (req, res) => {
  const { accessToken, refreshToken } = req.body

  const accessResult = await checkingAccessToken(accessToken)
  const refreshResult = await checkingRefreshToken(refreshToken)

  let payload = {
    username: '',
    password: ''
  }

  if (refreshResult.decoded?.username && refreshResult.decoded?.password) {
    payload.username = refreshResult.decoded.username
    payload.password = refreshResult.decoded.password
  }

  if (!accessResult.valid || accessResult.expired) {
    if (refreshResult.valid && !refreshResult.expired) {
      // Refresh Token이 유효하고 만료되지 않은 경우, 새 Access Token 발급
      const newAccessToken = makeAccessToken(payload) // 새 Access Token 발급 함수 호출
      res.status(200).json({
        success: 0,
        message: 'Access Token refreshed',
        accessToken: newAccessToken
      })
    } else {
      // Refresh Token이 유효하지 않거나 만료된 경우, 로그아웃 처리
      res.status(200).json({
        success: 1,
        message: 'Refresh Token is invalid or expired. Please log in again.'
      })
    }
  } else {
    // Access Token과 Refresh Token 모두 유효한 경우
    res.status(200).json({
      success: 2,
      message: 'Access Token is valid',
      accessToken: accessToken
    })
  }
})

app.post('/find_user', async (req, res) => {
  const { username } = req.body

  if (!username) {
    res.status(500).json({ error: 'Error fetching users' })
  }

  const user = await findUser(username)

  if (user) {
    res.status(200).json({
      id: Number(user.id),
      username: user.username,
      name: user.name
    })
  } else {
    res.status(404).json({
      message: 'User not found'
    })
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
