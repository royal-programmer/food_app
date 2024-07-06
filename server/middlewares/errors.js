const ErrorHandler = require("../utils/errorHandler");
module.exports = (_0x2cbcc5, _0xdadd2d, _0x4650b2, _0x2d2160) => {
  _0x2cbcc5.statusCode = _0x2cbcc5.statusCode || 0x1f4;
  if (process.env.NODE_ENV === "DEVELOPMENT") {
    _0x4650b2.status(_0x2cbcc5.statusCode).json({
      success: false,
      error: _0x2cbcc5,
      errMessage: _0x2cbcc5.message,
      stack: _0x2cbcc5.stack
    });
  }
  if (process.env.NODE_ENV === "PRODUCTION") {
    let _0x43cc3c = {
      ..._0x2cbcc5
    };
    _0x43cc3c.message = _0x2cbcc5.message;
    if (_0x2cbcc5.name == "castError") {
      const _0x2828ec = "Resource not found. Invalid: " + _0x2cbcc5.path;
      _0x43cc3c = new ErrorHandler(_0x2828ec, 0x190);
    }
    if (_0x2cbcc5.name === "ValidationError") {
      const _0x203968 = Object.values(_0x2cbcc5.errors).map(_0x369124 => _0x369124.message);
      _0x43cc3c = new ErrorHandler(_0x203968, 0x190);
    }
    if (_0x2cbcc5.code === 0x2af8) {
      const _0x493272 = "Duplicate " + Object.keys(_0x2cbcc5.keyValue) + " entered";
      _0x43cc3c = new ErrorHandler(_0x493272, 0x190);
    }
    if (_0x2cbcc5.name === "JsonWebTokenError") {
      _0x43cc3c = new ErrorHandler("JSON Web Token is invalid. Try Again!!!", 0x190);
    }
    if (_0x2cbcc5.name === "TokenExpiredError") {
      _0x43cc3c = new ErrorHandler("JSON Web Token is expired. Try Again!!!", 0x190);
    }
    _0x4650b2.status(_0x43cc3c.statusCode).json({
      success: false,
      message: _0x43cc3c.message || "Internal Server Error"
    });
  }
};