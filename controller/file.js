const File = require("../models/File");
const Folder = require("../models/Folder");
const ApiError = require("../utils/apiError");
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Files will be stored in 'uploads' directory
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

// File filter function
// const fileFilter = (req, file, cb) => {
//   // Accept only specific file types

//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Invalid file type"), false);
//   }
// };

const upload = multer({
  storage: storage,
  // fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
});
const addFile = async (req, res, next) => {
  try {
    console.log(req.file);

    const folder = await Folder.findOne({ _id: req.params.folderId });
    if (!folder) {
      return next(new ApiError("folder not found", 500));
    }
    const file = await File.create({
      folderId: req.params.folderId,
      userId: req.user._id,
      name: req.file.filename,
      size: req.file.size,
      type: req.file.mimetype,
    });
    console.log(folder.files);

    const update = await Folder.findOneAndUpdate(
      {
        _id: req.params.folderId,
      },
      { $push: { files: file._id } }
    );
    console.log(update.files);

    res.status(201).json(file);
  } catch (error) {
    console.log(error);

    return next(new ApiError(error.message, 500));
  }
};
module.exports = {
  addFile,
  upload,
};
