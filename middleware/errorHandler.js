const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  if (err instanceof ErrorResponse) {
    // If the error is an instance of ErrorResponse, handle it accordingly
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  } else {
    // If it's not an instance of ErrorResponse, handle other errors
    console.error(err.stack); // Log the error for debugging purposes
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

module.exports = errorHandler;
