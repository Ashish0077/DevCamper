const ErrorResponse = require("../utils/errorResponse");

function errorHandler(err, req, res, next) {
  let error = { ...err };
  error.message = err.message;

  // log for the developer
  console.log(err.stack.red);

  // mongoose bad ObjectID
  if (err.name == "CastError") {
    const message = `Bootcamp not found with ID : ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error"
  });
}

module.exports = errorHandler;
