const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trime: true,
    required: [true, "Please add a Title"]
  },
  description: {
    type: String,
    required: [true, "Please add a Description"]
  },
  weeks: {
    type: String,
    required: [true, "Please add Number of Weeks"]
  },
  tuition: {
    type: Number,
    required: [true, "Please tuition cost"]
  },
  minimumSkill: {
    type: String,
    required: true,
    enum: ["beginner", "intermediate", "advance"]
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true
  }
});

module.exports = mongoose.model("Course", CourseSchema);
