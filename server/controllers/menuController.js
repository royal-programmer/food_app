const Menu = require("../models/menu");
const ErrorHandler = require("../utils/errorHandler");
const catchAsync = require("../middlewares/catchAsyncErrors");
exports.getAllMenus = catchAsync(async (req, res, next) => {
  let filter;
  if (req.params.storeId) {
    filter = {
      restaurant: req.params.storeId
    };
  }
  const menus = await Menu.find(filter).populate({
    path: "menu.items",
    model: "FoodItem"
  }).exec();
  res.status(200).json({
    status: "success",
    count: menus.length,
    data: menus
  });
});
exports.createMenu = catchAsync(async (req, res, next) => {
  const newMenu = await Menu.create(req.body);
  res.status(201).json({
    status: "success",
    data: newMenu
  });
});
exports.deleteMenu = catchAsync(async (req, res, next) => {
  const deletedMenu = await Menu.findByIdAndDelete(req.params.menuId);
  if (!deletedMenu) {
    return next(new ErrorHandler("No document found with that ID", 404));
  }
  res.status(204).json({
    status: "success"
  });
});