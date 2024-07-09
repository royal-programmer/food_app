const Fooditem = require("../models/foodItem");
const ErrorHandler = require("../utils/errorHandler");
const catchAsync = require("../middlewares/catchAsyncErrors");
exports.getAllFoodItems = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.storeId) {
    filter = {
      restaurant: req.params.storeId
    };
  }
  const foodItems = await Fooditem.find(filter);
  res.status(200).json({
    status: "success",
    results: foodItems.length,
    data: foodItems
  });
});
exports.createFoodItem = catchAsync(async (req, res, next) => {
  const newItem = await Fooditem.create(req.body);
  res.status(201).json({
    status: "success",
    data: newItem
  });
});
exports.getFoodItem = catchAsync(async (req, res, next) => {
  const foodItem = await Fooditem.findById(req.params.foodId);
  if (!foodItem) {
    return next(new ErrorHandler("No foodItem found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: foodItem
  });
});
exports.updateFoodItem = catchAsync(async (req, res, next) => {
  const updatedItem = await Fooditem.findByIdAndUpdate(req.params.foodId, req.body, {
    new: true,
    runValidators: true
  });
  if (!updatedItem) {
    return next(new ErrorHandler("No document found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: updatedItem
  });
});
exports.deleteFoodItem = catchAsync(async (req, res, next) => {
  const deletedItem = await Fooditem.findByIdAndDelete(req.params.foodId);
  if (!deletedItem) {
    return next(new ErrorHandler("No document found with that ID", 404));
  }
  res.status(204).json({
    status: "success"
  });
});