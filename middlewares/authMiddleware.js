const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = asyncHandler(async (req, res, next) => {
  const authheader = req?.headers?.authorization;
  const token = authheader && authheader.split(" ")[1];
  if (!token) {
    res.status(400);
    throw new Error("Undefined token");
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    //if decoded return decoded.id

    //check if user still exist
    const isUserExists = await User.exists({ _id: decoded.id });
    if (!isUserExists) {
      throw new Error("Invalid User");
    }
    const user = await User.findOne({ _id: decoded.id }, { password: 0 });
    //attach the data to the request then next()
    req.userId = decoded.id;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json(error);
  }
});

module.exports = authMiddleware;
