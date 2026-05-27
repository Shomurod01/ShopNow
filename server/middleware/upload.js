const multer = require('multer');
const path = require('path');
const fs = require('fs');

// make sure the uploads folder exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// where to save files and what to name them
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // add a timestamp and random number to avoid name collisions
    const timestamp = Date.now();
    const randomNum = Math.round(Math.random() * 1000000000);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + timestamp + '-' + randomNum + ext);
  },
});

// only allow image files
const fileFilter = function (req, file, cb) {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extOk = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = allowedTypes.test(file.mimetype);

  if (extOk && mimeOk) {
    return cb(null, true);
  }

  cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5mb max
    files: 5,
  },
});

module.exports = upload;
