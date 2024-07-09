const Order = require("../models/order");
const {
  ObjectId
} = require("mongodb");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    orderItems,
    deliveryInfo,
    itemsPrice,
    taxPrice,
    deliveryCharge,
    finalTotal,
    paymentInfo
  } = req.body;
  const newOrder = await Order.create({
    orderItems,
    deliveryInfo,
    itemsPrice,
    taxPrice,
    deliveryCharge,
    finalTotal,
    paymentInfo,
    paidAt: Date.now(),
    user: req.user.id,
    restaurant: req.body.restaurant
  });
  res.status(200).json({
    success: true,
    order: newOrder
  });
});
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("user", "name email").populate("restaurant").exec();
  if (!order) {
    return next(new ErrorHandler("No Order found with this ID", 0x194));
  }
  res.status(200).json({
    success: true,
    order: order
  });
});
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const userId = new ObjectId(req.user.id);
  const orders = await Order.find({
    user: userId
  }).populate("user", "name email").populate("restaurant").exec();
  res.status(200).json({
    success: true,
    orders: orders
  });
});
exports.allOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();
  let totalAmount = 0;
  orders.forEach(order => {
    totalAmount += order.finalTotal;
  });
  res.status(200).json({
    success: true,
    totalAmount: totalAmount,
    orders: orders
  });
});