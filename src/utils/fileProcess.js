import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

export let tempFilePath;

export function uploadFile(files) {

const uploadedFile = files.upload;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const absolutePath = path.resolve(__dirname, '..');
const uploadDirectory = path.join(absolutePath, '/uploads/');
tempFilePath = path.join(uploadDirectory, uploadedFile.name);

  uploadedFile.mv(tempFilePath, (err) => {
    if (err) {
        console.log("err: ", err);
      return false
    }
  });

  return true;
}

const cleanTempFolder = () => {
    const tempDir = 'src/uploads/upload';
    console.log("폴더 비우기 실행" , new Date());

  fs.readdir(tempDir, (err, files) => {
    if (err) {
      console.error('Error reading temp directory:', err);
      return;
    }

    if (files.length === 0) {
      console.log('upload 폴더에 파일이 존재하지 않음');
      return;
    }

    // 모든 파일을 삭제하는 비동기 함수
    const deleteFiles = () => {
      files.forEach(file => {
        const filePath = path.join(tempDir, file);
        fs.unlink(filePath, err => {
          if (err) {
            console.error(`Error deleting file ${file}:`, err);
          } else {
            console.log(`Deleted file: ${file}`);
          }
        });
      });
    };

    // 모든 파일 삭제 후 폴더 삭제
    deleteFiles();
  });
};

// 주기적으로 temp 폴더 비우기 (예: 매일 자정에 실행)
setInterval(cleanTempFolder, 24 * 60 * 60 * 1000); // 24시간마다 실행