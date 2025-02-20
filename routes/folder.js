const express = require("express");
const {
  addFolder,
  getFolders,
  getFolder,
  addFileToFolder,

  deleteFolder,
  sendFile,
  deleteFileFromFolder,
  downloadFile,
} = require("../controller/folder");
const upload = require("../middlewares/upload");
const { protect } = require("../middlewares/auth");
const router = express.Router();
router.post("/", protect, addFolder);
router.post("/file", protect, upload.single("file"), addFileToFolder);
router.get("/", protect, getFolders);
router.get("/:id", protect, getFolder);
router.delete("/:id", protect, deleteFolder);
router.post("/send/:folderId", protect, sendFile);
router.delete("/file/:folderId", protect, deleteFileFromFolder);
router.post("/file/download", protect, downloadFile);
module.exports = router;
