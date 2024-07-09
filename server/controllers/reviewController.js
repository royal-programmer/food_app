const AppError = require("../utils/errorHandler");
const Review = require("../models/reviewModel");
const catchAsync = require("../middlewares/catchAsyncErrors");
exports.setUserRestaurantIds = (req, res, next) => {
  if (!req.body.user) {
    req.body.user = req.user.id;
  }
  if (!req.body.restaurant) {
    req.body.restaurant = req.params.storeId;
  }
  next();
};
exports.createReviews = catchAsync(async (req, res, next) => {
  const review = await Review.create(req.body);
  res.status(201).json({
    status: "success",
    data: review
  });
});
exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) {
    filter = {
      restaurant: req.params.tourId
    };
  }
  const reviews = await Review.find(filter);
  res.status(0xc8).json({
    status: "success",
    data: reviews
  });
});
exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId);
  if (!review) {
    return next(new AppError("No Review with given Id", 404));
  }
  res.status(200).json({
    status: "success",
    data: review
  });
});
exports.updateReview = catchAsync(async (req, res, next) => {
  const updatedReview = await Review.findByIdAndUpdate(req.params.reviewId, req.body, {
    new: true,
    runValidators: true
  });
  if (!updatedReview) {
    return next(new AppError("No Review with given Id", 404));
  }
  res.status(200).json({
    status: "success",
    data: updatedReview
  });
});
exports.deleteReview = catchAsync(async (req, res, next) => {
  const deleteReview = await Review.findByIdAndDelete(req.params.reviewId);
  if (!deleteReview) {
    return next(new AppError("No Review with given Id", 404));
  }
  res.status(204).json({
    status: "success"
  });
});