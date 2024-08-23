import jwt from 'jsonwebtoken'
import fs from 'fs'

const SECRET_KEY = fs.readFileSync('key/jwt-secret.key', 'utf8')
const REFRESH_SECRET_KEY = fs.readFileSync('key/jwt-refresh-secret.key', 'utf8')

const makeToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, {
    expiresIn: '1h'
  })
}

const makeRefreshToken = () => {
  return jwt.sign({}, REFRESH_SECRET_KEY, {
    algorithm: 'HS256',
    expiresIn: '1h'
  })
}

const auth = (req, res, next) => {
  let token = ''
  console.log('req.headers.authorization: ', req.headers.authorization)
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    token = req.headers.authorization.split(' ')[1]
  } else {
    return next('token none')
  }

  console.log('req.headers.authorization: ', req.headers.authorization)

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      next(err.message)
    } else {
      req.decoded = decoded
      next()
    }
  })
}

export { auth, makeToken, makeRefreshToken }
