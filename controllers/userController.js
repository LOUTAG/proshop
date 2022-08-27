const mongoose = require("mongoose");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../config/token");

module.exports.register = asyncHandler(async (req, res) => {
  //1- Get inputs value
  const { firstName, lastName, email, password } = req?.body;

  //2- Check name format
  const nameRegex = /^[a-zA-Z.-. ]{2,20}$/;
  if (!nameRegex.test(firstName)) {
    res.status(400);
    throw new Error("Invalid firstName");
  }

  if (!nameRegex.test(lastName)) {
    res.status(400);
    throw new Error("Invalid lastName");
  }

  //3- Check email format
  const emailRegex = /^[a-z0-9.-]+@+[a-z-]+[.]+[a-z]{2,6}$/;
  if (!emailRegex.test(email)) {
    res.status(400);
    throw new Error("Invalid email");
  }

  //4- Check password format
  const passwordRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-+=.<>_~]).{8,32}$/;
  if (!passwordRegex.test(password)) {
    res.status(400);
    throw new Error("Invalid password");
  }

  //5 - Check if user already exists
  const userExists = await User.findOne({ email: email });
  if (userExists) {
    res.status(400);
    throw new Error("Email adress already registered");
  }
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    firstName,
    lastName,
    email,
    password,
  });
  const token = await user.createVerifyAccountToken();
  await user.save();
  //later add email with token inside
  res.json("Your account has been created");
});

module.exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    res.status(400);
    throw new Error("Please provide an email");
  }
  if (!password) {
    res.status(400);
    throw new Error("Please provide a password");
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    res.status(404);
    throw new Error(`${email} doesn\'t exist`);
  }
  //check if passwordMatch
  const isPasswordMatched = await user.isPasswordMatched(password);
  if (!isPasswordMatched) {
    res.status(401);
    throw new Error("Incorrect password");
  }
  res.json({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    isAdmin: user.isAdmin,
    profilePhoto: user.profilePhoto,
    accessToken: generateAccessToken(user._id),
    refreshToken: generateRefreshToken(user._id),
  });
});

module.exports.profile = asyncHandler(async (req, res) => {
  res.json("profile controller");
});

module.exports.updateProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updateUser = await user.save();
    res.json({
      _id: updateUser._id,
      firstName: updateUser.firstName,
      lastName: updateUser.lastName,
      email: updateUser.email,
      isAdmin: updateUser.isAdmin,
      profilePhoto: updateUser.profilePhoto,
      accessToken: generateAccessToken(updateUser._id),
      refreshToken: generateRefreshToken(updateUser._id),
    });
  } catch (error) {
    throw error;
  }
});

module.exports.refreshAccessToken = asyncHandler(async (req, res) => {
  const authHeader = req?.headers?.authorization;
  const refreshToken = authHeader && authHeader.split(" ")[1];

  try {
    //Is refreshToken valid ?
    if (!refreshToken) throw new Error("Undefined refreshToken");

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
    //check if user still exist
    const isUserExists = await User.exists({ _id: decoded.id });
    if (!isUserExists) throw new Error("Invalid User");

    //refresh accessToken
    const refreshAccessToken = generateAccessToken(decoded.id);
    res.json({ refreshAccessToken });
  } catch (error) {
    res.status(401);
    throw error;
  }
});
