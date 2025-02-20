const express = require("express");
const { addFile, upload } = require("../controller/file");
const { protect } = require("../middlewares/auth");
const router = express.Router();
router.post("/:folderId", protect, upload.single("file"), addFile);
module.exports = router;
