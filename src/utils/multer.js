import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import { processUploadedImages } from './imageProcessor.js'

const upload = multer({
  storage: multer.diskStorage({
    filename(req, file, done) {
      const UUID = uuidv4()
      const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8') // UTF-8로 변환
      const safeFileName = `${UUID}_${originalName}` // 안전한 파일명
      done(null, safeFileName)
    },
    destination(req, file, done) {
      const uploadFolder = 'uploads/'
      if (!fs.existsSync(uploadFolder)) {
        fs.mkdirSync(uploadFolder, { recursive: true })
      }
      done(null, uploadFolder)
    }
  })
})

const withImageProcessing = (multerMiddleware) => {
  return (req, res, next) => {
    multerMiddleware(req, res, async (err) => {
      if (err) {
        return next(err)
      }

      try {
        await processUploadedImages(req)
      } catch (error) {
        console.error('이미지 후처리 중 오류가 발생했습니다.', error)
      }

      next()
    })
  }
}

export const deleteFile = (deleteKey) => {
  console.log('deleteKey: ', deleteKey)
  if (deleteKey) {
    fs.unlink(deleteKey, (err) => {
      if (err) {
        console.error('파일 삭제 중 오류 발생:', err)
        return false
      } else {
        console.log('파일이 성공적으로 삭제되었습니다.')
        return true
      }
    })
  }
  return true
}

export const singleUpload = withImageProcessing(upload.single('fileField'))

export const multiUpload = withImageProcessing(upload.array('fileField', 6))

export const uploadFields = withImageProcessing(
  upload.fields([
    { name: 'deleteFile', maxCount: 6 }, // 'deleteFile' 필드에서 최대 6개의 파일 허용
    { name: 'fileField', maxCount: 6 } // 'fileField' 필드에서 최대 6개의 파일 허용
  ])
)
