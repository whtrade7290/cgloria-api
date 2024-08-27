import multer from 'multer'
import AWS from 'aws-sdk';
import multerS3 from 'multer-s3';
import fs from 'fs'

const ACCESS_KEY_ID = fs.readFileSync('key/accessKeyId.key', 'utf8')
const SECRET_ACCESS_KEY = fs.readFileSync('key/secretAccessKey.key', 'utf8')

 // AWS S3 클라이언트 설정
AWS.config.update({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
  region: 'ap-northeast-1'
});

const s3 = new AWS.S3();

// multer-s3를 사용한 파일 업로드 설정
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'cgloria-bucket',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, "cgloria-photo/" + Date.now().toString() + '-' + file.originalname);
    }
  })
});

export default upload
