// app.js
import express from 'express'
import detectPort from 'detect-port'
import bodyParser from 'body-parser'
import cors from 'cors'
import morgan from 'morgan'
import bcrypt from 'bcrypt'
import path from 'path'
import {
  signIn,
  signUp,
  editPassword,
  findUser,
  findDisApproveUsers,
  approveUser,
  revokeApproveStatus,
  getApprovedUsers,
  updateUserRole
} from '../src/services/userService.js'
import {
  auth,
  makeAccessToken,
  makeRefreshToken,
  checkingAccessToken,
  checkingRefreshToken
} from './auth.js'
// test
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
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


const app = express()

const env =
  process.env.NODE_ENV === 'prod' ? 'prod' : process.env.NODE_ENV === 'stage' ? 'stage' : 'local'
  

// server setup
let port
async function configServer() {
  const port = 3000 || (await detectPort(3000))
  app.listen(port, () => {
    console.log(`production server :${port}`)
  })
}

// auth()
configServer()

if (env === 'prod') {
  const allowedOrigins = ['https://cgloria.duckdns.org', 'https://www.cgloria.duckdns.org']
  app.use((req, res, next) => {
    const origin = req.headers.origin
    if (allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin)
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-Refresh-Token')
    res.header('Access-Control-Allow-Credentials', 'true')
    if (req.method === 'OPTIONS') return res.sendStatus(204)
    next()
  })
} else {
  app.use(cors())
}
console.log('__dirname: ',__dirname);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(express.json())
app.use('/sermon', sermonRouter)
app.use('/column', columnRouter)
app.use('/weekly_bible_verse', weeklyRouter)
app.use('/class_meeting', classMeetingRouter)
app.use('/sunday_school_resource', libraryRouter)
app.use('/general_forum', generalForumRouter)
app.use('/testimony', testimonyRouter)
app.use('/notice', noticeRouter)
app.use('/withDiary', auth, withDiaryRouter)
app.use('/photo_board', photoRouter)
app.use('/school_photo_board', schoolPhotoRouter)
app.use('/comment', commentRouter)

app.use('/uploads', express.static(path.join('', env === 'local' ? 'uploads' : 'src/uploads')))

app.post('/signUp', async (req, res) => {
  const { username, password, name, email } = req.body

  // 비밀번호 암호화
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const obj = await signUp(username, hashedPassword, name, email)

    console.log('obj: ', obj)

    res.json(obj)
  } catch (error) {
    console.error('Error signing up:', error)
    res.status(500).json({ error: 'Error signing up' })
  }
})

app.post('/editPassword', async (req, res) => {
  const { username, password, name, email } = req.body

  // 비밀번호 암호화
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const obj = await editPassword(username, hashedPassword, name, email)

    console.log('obj: ', obj)

    res.json(obj)
  } catch (error) {
    console.error('Error edit password:', error)
    res.status(500).json({ error: 'Error edit password' })
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
      email: user.email,
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
  const { accessToken, refreshToken, skipAuth } = req.body

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
      accessToken: accessToken,
      skipAuth
    })
  }
})

app.post('/find_user', async (req, res) => {
  const { username } = req.body

  if (!username) {
    res.status(500).json({ error: 'Error fetching users' })
  }
  console.log('username: ', username)
  const user = await findUser(username)
  console.log('user: ', user)

  if (user) {
    res.status(200).json({
      id: Number(user.id),
      username: user.username,
      name: user.name,
      role: user.role,
      email: user.email,
      create_at: user.create_at
    })
  } else {
    res.status(200).json(user)
  }
})

app.get('/disapproveUsers', async (req, res) => {
  try {
    const users = await findDisApproveUsers()
    console.log('users: ', users)

    const responseUsers = users.map((user) => {
      return {
        id: Number(user.id),
        username: user.username,
        name: user.name,
        role: user.role
      }
    })

    // users가 없거나 빈 배열일 경우 빈 목록을 반환
    res.status(200).json(responseUsers || [])
  } catch (error) {
    // 예외 발생 시 처리
    console.error('Error fetching disapproved users: ', error)
    res.status(500).json({ message: 'An error occurred while fetching disapproved users' })
  }
})

const approveUserHandler = async (req, res) => {
  try {
    const { id } = req.body
    if (!id) return res.status(400).json({ message: 'ID is required' })

    const result = await approveUser(id)
    if (!result) return res.status(404).json({ message: 'Update failed or user not found' })

    res.status(200).json({
      ...result,
      id: Number(result.id)
    })
  } catch (error) {
    console.error('Error updating approval status:', error)
    res.status(500).json({ message: 'An error occurred while updating approval status' })
  }
}

app.post('/approveUser', approveUserHandler)
app.post('/updateApproveStatus', approveUserHandler)

app.post('/approvedUsers', async (req, res) => {
  const { startRow = 0, pageSize = 10, searchWord = '' } = req.body ?? {}

  try {
    const users = await getApprovedUsers({ startRow, pageSize, searchWord })
    res.status(200).json(users)
  } catch (error) {
    console.error('Error fetching approved users:', error)
    res.status(500).json({ message: 'An error occurred while fetching approved users' })
  }
})

app.post('/revokeApproveStatus', async (req, res) => {
  try {
    const { id } = req.body
    if (!id) return res.status(400).json({ message: 'ID is required' })

    const result = await revokeApproveStatus(id)
    if (!result) return res.status(404).json({ message: 'Update failed or user not found' })

    res.status(200).json({
      ...result,
      id: Number(result.id)
    })
  } catch (error) {
    console.error('Error revoking approval status:', error)
    res.status(500).json({ message: 'An error occurred while revoking approval status' })
  }
})

app.post('/updateUserRole', async (req, res) => {
  try {
    const { id, role } = req.body
    if (!id) return res.status(400).json({ message: 'ID is required' })
    if (!role) return res.status(400).json({ message: 'Role is required' })

    const result = await updateUserRole(id, role)
    if (!result) {
      return res.status(404).json({ message: 'Update failed or user not found' })
    }

    res.status(200).json(result)
  } catch (error) {
    console.error('Error updating user role:', error)
    res.status(500).json({ message: 'An error occurred while updating user role' })
  }
})
