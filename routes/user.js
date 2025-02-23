const express = require("express");
const {
  register,
  login,
  getUsers,
  deleteUser,
  updatePassword,
} = require("../controller/user");
const { protect, allowTo } = require("../middlewares/auth");
const router = express.Router();
router.post("/register", protect, allowTo, register);
router.post("/login", login);
router.get("/", protect, getUsers);
router.delete("/:id", protect, allowTo, deleteUser);
router.patch("/:id", protect, updatePassword);
module.exports = router;
