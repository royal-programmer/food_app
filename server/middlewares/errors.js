const ErrorHandler = require("../utils/errorHandler");
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === "DEVELOPMENT") {
    res.status(err.statusCode).json({
      success: false,
      error: err,
      errMessage: err.message,
      stack: err.stack
    });
  }
  if (process.env.NODE_ENV === "PRODUCTION") {
    let error = {
      ...err
    };
    error.message = err.message;
    if (err.name == "castError") {
      const message = "Resource not found. Invalid: " + err.path;
      error = new ErrorHandler(message, 400);
    }
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors).map(val => val.message).join(', ');
      error = new ErrorHandler(message, 400);
    }
    if (err.code === 11000) {
      const message = "Duplicate " + Object.keys(err.keyValue) + " entered";
      error = new ErrorHandler(message, 400);
    }
    if (err.name === "JsonWebTokenError") {
      error = new ErrorHandler("JSON Web Token is invalid. Try Again!!!", 400);
    }
    if (err.name === "TokenExpiredError") {
      error = new ErrorHandler("JSON Web Token is expired. Try Again!!!", 400);
    }
    res.status(error.statusCode).json({
      success: false,
      message: error.message || "Internal Server Error"
    });
  }
};