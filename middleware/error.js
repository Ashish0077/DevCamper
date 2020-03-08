function errorHandler(err, req, res, next) {
  // log for the developer
  console.log(err.stack.red);

  res.status(500).json({
    success: false,
    error: err.message
  });
}

module.exports = errorHandler;
