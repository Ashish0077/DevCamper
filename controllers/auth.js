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

  sendTokenResponse(user, 200, res);
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

  sendTokenResponse(user, 200, res);
});

/* 
    @desc    Get Current User
    @route   GET /api/v1/auth/me
    @access  Private
*/
const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.find({ _id: req.user.id });
  res.status(200).json({
    success: true,
    data: user
  });
});

// Get token from the model, create cookie and send response
function sendTokenResponse(user, statusCode, res) {
  // create token
  const token = user.getSignedJwtToken();

  const options = {
    // current dateTime + 30 days
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV == "production") {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      token: token
    });
}

module.exports = {
  registerUser,
  loginUser,
  getMe
};
