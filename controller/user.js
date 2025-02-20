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
    const users = await User.find({}).select("username _id ");
    //console.log(usersFilter);

    return res.status(200).send(users);
  } catch (error) {
    return next(new ApiError(error.message, 500));
  }
};
module.exports = {
  register,
  login,
  getUsers,
};
