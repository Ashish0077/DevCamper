const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

// Protect Routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // extracting token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    console.log(`${token}`.cyan);
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // make sure token exist
  if (!token) {
    return next(new ErrorResponse("Not Autherized to access this route", 401));
  }

  // verifying token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return next(new ErrorResponse("Not Autherized to access this route", 401));
  }
});

// Only Authenticate specific roles
const authenticateRoles = roles => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(
      new ErrorResponse(
        `${req.user.role} Role is not authorized for this action`,
        403
      )
    );
  }
  next();
};

module.exports = {
  protect,
  authenticateRoles
};
