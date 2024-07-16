import multer from 'multer';

let filename = "";
let extension = "";
let date = "";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const match = file.originalname.match(/^([\w\d_-]*)\.?([\w\d]*)$/);
     filename = match[1];
     extension = '.' + match[2];
     date = Date.now().toString();

      req.fileData = {
      filename: filename,
      extension: extension,
      date: date
    };

    cb(null, filename + '_' + date + extension)
  }
})

const upload = multer({ storage: storage })

export default upload;
    



