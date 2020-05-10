const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trime: true,
    required: [true, "Please add a Title for the Review"],
    maxlength: 100
  },
  text: {
    type: String,
    required: [true, "Please add a some text"]
  },
  rating: {
    type: Number,
    max: 10,
    min: 1,
    required: [true, "Please add a rating between 1 and 10"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  }
});

// preventing users from submitting one review per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

// calulates the average and updates the rating
ReviewSchema.statics.getAverageRating = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId }
    },
    {
      $group: { _id: "$bootcamp", averageRating: { $avg: "$rating" } }
    }
  ]);

  try {
    const bootcamp = await this.model("Bootcamp").findByIdAndUpdate(
      bootcampId,
      {
        averageRating: obj[0].averageRating
      }
    );
  } catch (error) {
    console.error(error);
  }
};

// call getAverageCost after save
ReviewSchema.post("save", async function () {
  this.constructor.getAverageRating(this.bootcamp);
});

// call getAverageCost before remove
ReviewSchema.pre("remove", async function () {
  this.constructor.getAverageRating(this.bootcamp);
});

module.exports = mongoose.model("Review", ReviewSchema);
