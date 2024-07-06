class ErrorHandler extends Error {
  constructor(_0x1e6841, _0x4d51bd) {
    super(_0x1e6841);
    this.statusCode = _0x4d51bd;
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = ErrorHandler;