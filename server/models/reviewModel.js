const mongoose = require("mongoose");
const Restaurant = require("./restaurant");
const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    require: [true, "Review can not be empty !"]
  },
  rating: {
    type: Number,
    min: 0x1,
    max: 0x5
  },
  restaurant: {
    type: mongoose.Schema.ObjectId,
    ref: "Restaurant"
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Review must belong to a user"]
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
});
reviewSchema.statics.calcAverageRatings = async function (_0x434be7) {
  const _0x45fe2e = await this.aggregate([{
    $match: {
      restaurant: _0x434be7
    }
  }, {
    $group: {
      _id: "$restaurant",
      nRating: {
        $sum: 0x1
      },
      avgRating: {
        $avg: "$rating"
      }
    }
  }]);
  if (_0x45fe2e.length > 0x0) {
    await Restaurant.findByIdAndUpdate(_0x434be7, {
      numOfReviews: _0x45fe2e[0x0].nRating,
      ratings: _0x45fe2e[0x0].avgRating
    });
  } else {
    await Restaurant.findByIdAndUpdate(_0x434be7, {
      numOfReviews: 0x0,
      ratings: 3.5
    });
  }
};
reviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.restaurant);
});
reviewSchema.pre(/^findOneAnd/, async function (_0x3a9fb4) {
  this._originalQuery = this.getQuery();
  _0x3a9fb4();
});
reviewSchema.post(/^findOneAnd/, async function () {
  const _0xbb52a4 = await this.model.findOne(this._originalQuery);
  if (_0xbb52a4) {
    await _0xbb52a4.constructor.calcAverageRatings(_0xbb52a4.restaurant);
  }
});
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;