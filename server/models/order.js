const mongoose = require("mongoose");
const orderSchema = mongoose.Schema({
  deliveryInfo: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    phoneNo: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    }
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant"
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  orderItems: [{
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    fooditem: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "FoodItem"
    }
  }],
  paymentInfo: {
    id: {
      type: String
    },
    status: {
      type: String
    }
  },
  paidAt: {
    type: Date
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0x0
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0x0
  },
  deliveryCharge: {
    type: Number,
    required: true,
    default: 0x0
  },
  finalTotal: {
    type: Number,
    required: true,
    default: 0x0
  },
  orderStatus: {
    type: String,
    required: true,
    default: "Processing"
  },
  deliveredAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
orderSchema.pre("save", async function (_0x1256a2) {
  try {
    for (const _0x542912 of this.orderItems) {
      const _0x1d6e98 = await mongoose.model("FoodItem").findById(_0x542912.fooditem);
      if (!_0x1d6e98) {
        throw new Error("Food item not found.");
      }
      if (_0x1d6e98.stock < _0x542912.quantity) {
        throw new Error("Insufficient stock for '" + _0x542912.name + "' in this order.");
      }
      _0x1d6e98.stock -= _0x542912.quantity;
      await _0x1d6e98.save();
    }
    _0x1256a2();
  } catch (_0x45c602) {
    _0x1256a2(_0x45c602);
  }
});
module.exports = mongoose.model("Order", orderSchema);