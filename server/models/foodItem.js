const mongoose = require("mongoose");
const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter FoodItem name"],
    trim: true,
    maxLength: [0x64, "FoodItem name cannot exceed 100 characters "]
  },
  price: {
    type: Number,
    required: [true, "Please enter FoodItem price"],
    maxLength: [0x5, "FoodItem name cannot exceed 5 characters "],
    default: 0x0
  },
  description: {
    type: String,
    required: [true, "Please enter FoodItem description"]
  },
  ratings: {
    type: Number,
    default: 0x0
  },
  images: [{
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  }],
  menu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Menu"
  },
  stock: {
    type: Number,
    required: [true, "Please enter foodItem stock"],
    maxLength: [0x5, "foodItems can't exceed 5 characters"],
    default: 0x0
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant"
  },
  numOfReviews: {
    type: Number,
    default: 0x0
  },
  reviews: [{
    name: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true
    },
    Comment: {
      type: String,
      required: true
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model("FoodItem", foodSchema);