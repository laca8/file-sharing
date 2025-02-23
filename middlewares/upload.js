const fs = require("fs");
const multer = require("multer");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
// const cloudinary = require("cloudinary").v2;
// // إعداد Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });
// إضافة التحكم في الحجم في ملف config.js
const FILE_SIZE_LIMITS = {
  default: 1 * 1024 * 1024, // 1MB للملفات الأخرى
};

const ALLOWED_FILE_TYPES = {
  image: ["image/jpeg", "image/png", "image/gif", "image/jpg"],
  pdf: ["application/pdf"],
  document: [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
};
const uploadDir = "/tmp/uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Files will be stored in 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(
      null,
      path.parse(file.originalname).name +
        "_" +
        Date.now() +
        path.parse(file.originalname).ext
    ); // Unique filename
  },
});

const fileFilter = (req, file, cb) => {
  // Accept only specific file types
  const allowedTypes = [].concat(...Object.values(ALLOWED_FILE_TYPES));
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1 * 1024 * 1024, // 1MB file size limit
  },
});
module.exports = upload;
