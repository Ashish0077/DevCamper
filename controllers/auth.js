const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

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

/* 
      @desc    Forgot Password
      @route   POST /api/v1/auth/forgetpassword
      @access  public
  */
const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse("There is no user with this email", 404));
  }

  // get reset method
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // create reset URL
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password, Please make a PUT request to \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset",
      message
    });

    res.status(200).json({
      success: true,
      data: "Email Sent"
    });
  } catch (error) {
    console.log(error);
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse("Email Could not be sent", 500));
  }
});

/* 
    @desc    Reset Password
    @route   PUT /api/v1/auth/resetpassword/:resettoken
    @access  Private
*/
const resetPassword = asyncHandler(async (req, res, next) => {
  //get Hashed Token
  const resetToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: resetToken,
    resetPasswordTokenExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse("Invalid Token", 400));
  }

  // set new password
  user.password = req.body.password;
  user.resetPasswordTokenExpire = undefined;
  user.resetPasswordToken = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

/* 
    @desc    Update the details 
    @route   PUT /api/v1/auth/updatedetails
    @access  Private
*/
const updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email
  }

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

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
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails
};
