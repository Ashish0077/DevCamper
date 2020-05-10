const ErrorResponse = require("../utils/errorResponse");

function errorHandler(err, req, res, next) {
  let error = { ...err };
  error.message = err.message;

  // log for the developer
  console.log(err);

  // mongoose bad ObjectID
  if (err.name == "CastError") {
    const message = `Resource not found with ID : ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // mongoose duplicate key
  if (err.code == 11000) {
    const message = `Duplicate Field Value entered : ${JSON.stringify(
      err.keyValue
    )}`;
    error = new ErrorResponse(message, 400);
  }

  // mongoose validation error
  if (err.name == "ValidationError") {
    const message = Object.values(err.errors).map((value) => value.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error"
  });
}

module.exports = errorHandler;
