const Coupon = require("../models/couponModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsync = require("../middlewares/catchAsyncErrors");
exports.createCoupon = catchAsync(async (_0x54888a, _0x29b42e, _0x568def) => {
  const _0x3e63b1 = await Coupon.create(_0x54888a.body);
  _0x29b42e.status(0xc8).json({
    status: "success",
    data: _0x3e63b1
  });
});
exports.getCoupon = catchAsync(async (_0xc812ec, _0x44915a, _0x4142f2) => {
  const _0x52879f = await Coupon.find();
  _0x44915a.status(0xc8).json({
    status: "success",
    data: _0x52879f
  });
});
exports.updateCoupon = catchAsync(async (_0x432c7a, _0x295156, _0x58d385) => {
  const _0x291a58 = await Coupon.findByIdAndUpdate(_0x432c7a.params.couponId, _0x432c7a.body, {
    new: true,
    runValidators: true
  });
  if (!_0x291a58) {
    return _0x58d385(new ErrorHandler("No Coupon found with that ID", 0x194));
  }
  _0x295156.status(0xc8).json({
    status: "success",
    data: _0x291a58
  });
});
exports.deleteCoupon = catchAsync(async (_0x3c648d, _0xaf9a06, _0x281efd) => {
  const _0x6c84ce = await Coupon.findByIdAndDelete(_0x3c648d.params.couponId);
  if (!_0x6c84ce) {
    return _0x281efd(new ErrorHandler("No coupon found with given Id", 0x194));
  }
  _0xaf9a06.status(0xcc).json({
    status: "success"
  });
});
exports.couponValidate = catchAsync(async (_0x3962d4, _0x4249c3, _0x4c186a) => {
  const _0x3c0d48 = await Coupon.aggregate([{
    $addFields: {
      finalTotal: {
        $cond: [{
          $gte: [_0x5e1d49, "$minAmount"]
        }, {
          $subtract: [_0x5e1d49, {
            $min: [{
              $multiply: [_0x5e1d49, {
                $divide: ["$discount", 0x64]
              }]
            }, "$maxDiscount"]
          }]
        }, _0x5e1d49]
      },
      message: {
        $cond: [{
          $gte: [_0x5e1d49, "$minAmount"]
        }, "", {
          $concat: ["add \u20B9 ", {
            $toString: {
              $subtract: ["$minAmount", _0x5e1d49]
            }
          }, " more to avail this offer"]
        }]
      }
    }
  }, {
    $project: {
      _id: 0x0,
      subTitle: 0x1,
      couponName: 0x1,
      details: 0x1,
      minAmount: 0x1,
      finalTotal: 0x1,
      message: 0x1
    }
  }]);
  if (!_0x3c0d48) {
    return _0x4c186a(new ErrorHandler("Invalid coupon code.", 0x194));
  }
  _0x4249c3.status(0xc8).json({
    status: "success",
    data: _0x3c0d48
  });
});