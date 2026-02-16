import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'

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

export const singleUpload = upload.single('fileField')

export const multiUpload = upload.array('fileField', 6)

export const uploadFields = upload.fields([
  { name: 'deleteFile', maxCount: 6 }, // 'deleteFile' 필드에서 최대 6개의 파일 허용
  { name: 'fileField', maxCount: 6 } // 'fileField' 필드에서 최대 6개의 파일 허용
])
