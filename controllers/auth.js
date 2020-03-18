const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");
const User = require("../models/User");

/* 
    @desc    Register User
    @route   POST /api/v1/auth/register
    @access  Public
*/
const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // creating the user
  const user = await User.create({
    name,
    email,
    password,
    role
  });

  if (!user) {
    return next(new ErrorResponse("Unable to create User", 500));
  }

  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    token: token
  });
});

/* 
    @desc    Login User
    @route   POST /api/v1/auth/login
    @access  Public
*/
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // validate email and password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  // creating the user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }

  // checking if the password is correct or not
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }

  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    token: token
  });
});

module.exports = {
  registerUser,
  loginUser
};
