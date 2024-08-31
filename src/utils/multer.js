import multer from 'multer'
import path from 'path'
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

// S3 클라이언트 설정
const s3 = new S3Client({
  region: process.env.AWS_REGION, // 사용 중인 S3 리전
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
})

// Multer 설정
const storage = multer.memoryStorage()
export const upload = multer({ storage })

export const deleteToS3 = async (deleteKeyArr) => {
  const bucketName = 'cgloria-bucket'
  // console.log("deleteKeyArr: ", deleteKeyArr);

  // 모든 비동기 작업이 완료될 때까지 기다림
  const testArr = await Promise.all(
    deleteKeyArr.map(async (key) => {
      const command = new DeleteObjectCommand({ Bucket: bucketName, Key: key })
      // console.log("command: ", command);

      try {
        const response = await s3.send(command)
        // console.log(`삭제된 파일: ${key}`, response); // 응답 출력
        return response
      } catch (error) {
        console.error(`파일 삭제 실패: ${key}`, error)
        return error
      }
    })
  )

  // console.log("testArr: ", testArr);

  return testArr
}

// 파일 업로드 함수
export const uploadToS3 = async (file) => {
  const date = Date.now().toString() + '-'
  const filename = path.parse(file.originalname)?.name ?? ''
  const extension = path.parse(file.originalname)?.ext ?? ''
  const params = {
    Bucket: 'cgloria-bucket',
    Key: `cgloria-photo/${date}${file.originalname}`, // S3에 저장될 파일 이름
    Body: file.buffer, // 파일의 버퍼 데이터
    ContentType: file.mimetype,
    ACL: 'public-read' // 공개 액세스 권한 설정
  }

  try {
    const command = new PutObjectCommand(params)
    const response = await s3.send(command)
    return {
      status: response['$metadata']?.httpStatusCode ?? '',
      key: params?.Key,
      filename,
      extension,
      date
    }
  } catch (error) {
    console.error('파일 업로드 실패:', error)
    throw error // 오류를 다시 throw하여 상위 catch에서 처리할 수 있도록 합니다.
  }
}
