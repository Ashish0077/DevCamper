const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");
const User = require("../models/User");

/* 
    @desc    Register User
    @route   POST /api/v1/auth/register
    @access  Public
*/
const registerUser = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true
  });
});

module.exports = {
  registerUser
};
