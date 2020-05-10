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

module.exports = mongoose.model("Review", ReviewSchema);
