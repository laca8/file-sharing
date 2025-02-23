const User = require("../models/User");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");
const bcrypt = require("bcryptjs");

const createToken = (payload) => {
  return jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.EXPIRE_TIME,
  });
};
const register = async (req, res, next) => {
  try {
    const userExist = await User.findOne({ username: req.body.username });
    if (userExist) {
      return next(new ApiError("user is already exist", 500));
    }
    const user = await User.create({
      username: req.body.username,
      password: req.body.password,
    });
    const createdUser = {
      username: user.username,
    };
    const token = createToken(user._id);
    res.status(201).json({ createdUser, token });
  } catch (error) {
    console.log(error);
    return next(new ApiError(error.message, 500));
  }
};
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    if (!user) {
      return next(new ApiError("user not found", 404));
    }

    const match = await bcrypt.compareSync(password, user.password);
    if (!match) {
      return next(new ApiError("password error", 404));
    }
    const createdUser = {
      username: user.username,
      admin: user.admin,
      _id: user._id,
    };
    const token = createToken(user._id);
    return res.status(201).json({ createdUser, token });
  } catch (error) {
    console.log(error);

    return next(new ApiError(error.message, 500));
  }
};
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("username admin _id  ");
    //console.log(usersFilter);

    return res.status(200).send(users);
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete({ _id: req.params.id });
    //console.log(usersFilter);

    return res.status(200).send("user deleted...");
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const user = await User.findById({ _id: req.params.id });
    if (user) {
      const salt = await bcrypt.genSalt(10);
      const newPassword = await bcrypt.hash(password, salt);
      // console.log(newPassword, password);

      await User.findByIdAndUpdate(
        {
          _id: req.params.id,
        },
        {
          password: newPassword,
        },
        {
          new: true,
        }
      );
    }
    //console.log(usersFilter);

    return res.status(200).send("user deleted...");
  } catch (error) {
    console.log(error);

    return next(new ApiError(error.message, 500));
  }
};
module.exports = {
  register,
  login,
  getUsers,
  deleteUser,
  updatePassword,
};
