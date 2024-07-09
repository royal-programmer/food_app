const mongoose = require("mongoose");
const Restaurant = require("./restaurant");
const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    require: [true, "Review can not be empty !"]
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
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
reviewSchema.statics.calcAverageRatings = async function (restaurantId) {
  const stats = await this.aggregate([{
    $match: {
      restaurant: restaurantId
    }
  }, {
    $group: {
      _id: "$restaurant",
      nRating: {
        $sum: 1
      },
      avgRating: {
        $avg: "$rating"
      }
    }
  }]);
  if (stats.length > 0) {
    await Restaurant.findByIdAndUpdate(restaurantId, {
      numOfReviews: stats[0].nRating,
      ratings: stats[0].avgRating
    });
  } else {
    await Restaurant.findByIdAndUpdate(restaurantId, {
      numOfReviews: 0,
      ratings: 3.5
    });
  }
};
reviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.restaurant);
});
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this._originalQuery = this.getQuery();
  next();
});
reviewSchema.post(/^findOneAnd/, async function () {
  const doc = await this.model.findOne(this._originalQuery);
  if (doc) {
    await doc.constructor.calcAverageRatings(doc.restaurant);
  }
});
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;