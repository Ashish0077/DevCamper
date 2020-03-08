const errorResponse = require("../utils/errorResponse");

function errorHandler(err, req, res, next) {
  // log for the developer
  console.log(err.stack.red);

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Server Error"
  });
}

module.exports = errorHandler;
