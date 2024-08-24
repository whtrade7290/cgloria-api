import jwt from 'jsonwebtoken'
import fs from 'fs'

const SECRET_KEY = fs.readFileSync('key/jwt-secret.key', 'utf8')
const REFRESH_SECRET_KEY = fs.readFileSync('key/jwt-refresh-secret.key', 'utf8')

const makeAccessToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, {
    expiresIn: '1h'
  })
}

const makeRefreshToken = (payload) => {
  return jwt.sign(payload, REFRESH_SECRET_KEY, {
    algorithm: 'HS256',
    expiresIn: '24h'
  })
}

const checkingAccessToken = async (accessToken) => {

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(accessToken, SECRET_KEY)
    return {
      valid: true,
      expired: false,
      decoded
    }
  } catch (error) {
    return {
      valid: false,
      expired: error.name === 'TokenExpiredError',
      decoded: null
    }
  }
}

const checkingRefreshToken = async (refreshToken) => {
  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET_KEY)
    return {
      valid: true,
      expired: false,
      decoded
    }
  } catch (error) {
    return {
      valid: false,
      expired: error.name === 'TokenExpiredError',
      decoded: null
    }
  }
}

const auth = (req, res, next) => {
  let token = ''
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    token = req.headers.authorization.split(' ')[1]
  } else {
    return next('token none')
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      next(err.message)
    } else {
      req.decoded = decoded
      next()
    }
  })
}

export { auth, makeAccessToken, makeRefreshToken, checkingAccessToken, checkingRefreshToken }
