const Folder = require("../models/Folder");
const User = require("../models/User");
const dotenv = require("dotenv");
const ApiError = require("../utils/apiError");
const fs = require("fs");
const axios = require("axios");
const path = require("path");
const cloudinary = require("cloudinary").v2;
dotenv.config({ path: "../.env" });

// إعداد Cloudinary
cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_SECRET,
});
//add folder
const addFolder = async (req, res, next) => {
  const { name, files } = req.body;
  try {
    const folders = await Folder.find({ userId: req.user._id });
    console.log(folders.length);

    const folder = await Folder.create({
      maxSize: 100 / Number(folders.length),
      name,
      files,
      userId: req.user._id,
    });
    res.status(201).json(folder);
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};
//delete folder
const deleteFolder = async (req, res, next) => {
  try {
    const folderExist = await Folder.findOne({
      userId: req.user._id,
      _id: req.params.id,
    });
    if (!folderExist) {
      return next(new ApiError("folder not found...", 500));
    }
    await folderExist.files.map((x) => {
      console.log(x.publicId);
      // حذف الملف من Cloudinary
      cloudinary.uploader.destroy(x.publicId);
    });
    const folder = await Folder.findOneAndDelete({
      _id: req.params.id,
    });

    return res.status(400).json("folder deleted...");
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};
//get all folders
const getFolders = async (req, res, next) => {
  try {
    const folders = await Folder.find({ userId: req.user._id });

    res.status(200).json(folders);
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};
//get folder
const getFolder = async (req, res, next) => {
  try {
    const folder = await Folder.findOne({
      _id: req.params.id,
    });

    res.status(200).json(folder);
  } catch (error) {
    console.log(error);

    return next(new ApiError(error.message, 500));
  }
};
//add file to folder
const addFileToFolder = async (req, res, next) => {
  try {
    // console.log(req.body.folderId.toString());
    // console.log(req.file);
    const fileExtension = req?.file?.originalname
      .split(".")
      .pop()
      .toLowerCase();
    let resource_type;
    console.log(fileExtension);

    // Set resource_type based on file extension
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension)) {
      resource_type = "image";
    } else if (
      ["pdf", "doc", "docx", "xls", "xlsx", "txt"].includes(fileExtension)
    ) {
      resource_type = "raw";
    } else {
      return next(new ApiError("Unsupported file type", 400));
    }
    console.log(resource_type);

    const folder = await Folder.findOne({
      _id: req.body.folderId,
      userId: req.user._id,
    });
    if (!folder) {
      return next(new ApiError("folder not found", 500));
    }
    // التحقق من وجود الملف
    if (!req.file) {
      return next(new ApiError("no file uploaded", 400));
    }

    // تحويل الملف إلى Base64
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: resource_type,
    });
    // console.log(result);
    // حذف الملف المؤقت

    const update = await Folder.findOneAndUpdate(
      {
        _id: req.body.folderId,
        userId: req.user._id,
      },
      {
        $push: {
          files: {
            name: req.file.originalname,
            url: result.secure_url,
            size: req.file.size,
            type: req.file.mimetype,
            publicId: result.public_id,
            createdAt: new Date(),
          },
        },
      },
      {
        new: true,
      }
    );
    // console.log(update);

    fs.unlinkSync(req.file.path);

    res.status(201).json(update);
  } catch (error) {
    console.log(error);
    return next(new ApiError(error.message, 500));
  }
};
//delete file fro folders
const deleteFileFromFolder = async (req, res, next) => {
  const { folderId } = req.params;
  const { id } = req.body;
  // console.log(req.body);

  try {
    const folder = await Folder.findOne({
      _id: folderId,
      userId: req.user._id,
    });
    if (!folder) {
      return next(new ApiError("folder not found", 500));
    }

    // حذف الملف من Cloudinary
    await cloudinary.uploader.destroy(id);
    const update = await Folder.findOneAndUpdate(
      {
        _id: req.params.folderId,
        userId: req.user._id,
      },
      {
        $pull: {
          files: {
            publicId: id,
          },
        },
      },
      {
        new: true,
      }
    );

    res.status(201).json("file deleted");
  } catch (error) {
    console.log(error);
    return next(new ApiError(error.message, 500));
  }
};
//download file
const downloadFile = async (req, res, next) => {
  try {
    const publicId = req.body.url;
    // Fetch resource details to confirm it exists
    const { resource } = await cloudinary.api.resource(publicId);

    // Generate download URL
    const url = cloudinary.url(publicId, { flags: "attachment" });

    // Redirect to Cloudinary URL for download
    res.redirect(url);
  } catch (error) {
    console.log(error);
    return next(new ApiError(error.message, 500));
  }
};

//send file from user to another user and create recieved folder
const sendFile = async (req, res, next) => {
  const { username, fileId } = req.body;
  const { folderId } = req.params;

  try {
    const userReciever = await User.findOne({ username: username });
    if (!userReciever) {
      return next(new ApiError("user not found", 500));
    }
    // console.log(req.body);
    const folder = await Folder.findById({ _id: folderId });
    if (!userReciever) {
      return next(new ApiError("folder not found", 500));
    }
    const fileExist = folder.files.filter((x) => x.publicId == fileId);
    // console.log(fileExist);
    fileExist.comment = req.body.comment;
    const folder_exist = await Folder.findOne({
      name: "Received",
      userId: userReciever._id,
    });
    if (!folder_exist) {
      console.log(req.body.comment);
      // console.log(fileExist);

      const folder_created = await Folder.create({
        name: "Received",
        userId: userReciever._id,
        files: fileExist,
      });
      return res.status(200).json(folder_created);
    } else {
      console.log("exist");
      // console.log(fileExist);

      const update = await Folder.findOneAndUpdate(
        {
          name: "Received",
          userId: userReciever._id,
        },
        {
          $push: {
            files: {
              name: fileExist[0].name,
              size: fileExist[0].size,
              type: fileExist[0].type,
              url: fileExist[0].url,
              publicId: fileExist[0].publicId,
              comment: req.body.comment,
              createdAt: fileExist[0].createdAt,
            },
          },
        },
        {
          $set: {
            size: {
              $sum: "$files.size", // Sum up the sizes of all files in the `files` array
            },
          },
        },
        {
          new: true,
        }
      );

      return res.status(200).json(update);
    }
  } catch (error) {
    console.log(error);
    return next(new ApiError(error.message, 500));
  }
};
module.exports = {
  addFolder,
  getFolders,
  getFolder,
  addFileToFolder,
  deleteFolder,
  sendFile,
  deleteFileFromFolder,
  downloadFile,
};
