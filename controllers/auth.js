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

  res.status(200).json({
    success: true
  });
});

module.exports = {
  registerUser
};
