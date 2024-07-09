const User = require("../models/user");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const {
  promisify
} = require("util");
const ErrorHandler = require("../utils/errorHandler");
const Email = require("../utils/email");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const cloudinary = require("cloudinary").v2;
const createSendToken = (user, statuscode, res) => {
  const token = jwt.sign({
    id: user._id
  }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME + "d"
  });
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_EXPIRES_TIME * 24 * 60 * 60 * 1000),
    httpOnly: true
  };
  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;
  res.status(statuscode).json({
    success: true,
    token: token,
    data: {
      user: user
    }
  });
};
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME , //"df8dnez80"
  api_key: process.env.CLOUDINARY_API_KEY ,//"385231413173631"
  api_secret: process.env.CLOUDINARY_API_SECRET //"c6Eka2VMeuOk7Od0JvHFTCNxzDE"
});
exports.signup = catchAsyncErrors(async (req, res, next) => {
  const {
    name,
    email,
    password,
    passwordConfirm,
    phoneNumber
  } = req.body;
  const result = await cloudinary.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale"
  });
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    phoneNumber,
    avatar: {
      public_id: result.public_id,
      url: result.secure_url
    }
  });
  createSendToken(newUser, 200, res);
});
exports.login = catchAsyncErrors(async (req, res, next) => {
  const {
    email,
    password
  } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password", 400));
  }
  const user = await User.findOne({
    email
  }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }
  createSendToken(user, 200, res);
});
exports.protect = catchAsyncErrors(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(new ErrorHandler("You are not logged in! Please log in to get access.", 401));
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);
  if (!currentUser || currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new ErrorHandler("User recently changed password ! please log in again.", 401));
  }
  req.user = currentUser;
  next();
});
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user: user
  });
});
exports.updatePassword = async (req, res, next) => {
  try {
    console.log(req.body);
    const {
      oldPassword,
      newPassword,
      newPasswordConfirm
    } = req.body;
    const user = await User.findById(req.user.id).select("+password");
    if (!(await user.correctPassword(oldPassword, user.password))) {
      return next(new ErrorHandler("Old password is incorrect", 400));
    }
    user.password = newPassword;
    user.passwordConfirm = newPasswordConfirm;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Password updated successfully"
    });
  } catch (err) {
    console.error(err);
    return next(new ErrorHandler("Internal Server Error", 500));
  }
};
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const updatedData = {
    name: req.body.name,
    email: req.body.email
  };
  if (req.body.avatar !== "") {
    const result = await cloudinary.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale"
    });
    updatedData.avatar = {
      public_id: result.public_id,
      url: result.secure_url
    };
  }
  res.status(200).json({
    success: true
  });
});
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email
  });
  if (!user) {
    return next(new ErrorHandler("There is no user with email address .", 401));
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({
    validateBeforeSave: false
  });
  try {
    const resetURL = process.env.FRONTEND_URL + "/users/resetPassword/" + resetToken;
    await new Email(user, resetURL).sendPasswordReset();
    return res.status(200).json({
      status: "success",
      message: "Token sent to email!"
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({
      validateBeforeSave: false
    });
    return next(new ErrorHandler("There was an error sending the email, try again later!", 500));
  }
});
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {
      $gt: Date.now()
    }
  });
  if (!user) {
    return next(new ErrorHandler("Token is invalid or has expired", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  createSendToken(user, 200, res);
});
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("jwt", null, {
    expires: new Date(Date.now()),
    httpOnly: true
  });
  res.status(200).json({
    success: true,
    message: "Logged out"
  });
});