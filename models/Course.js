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

// calulates the average and updates the bootcamp data
CourseSchema.statics.getAverageCourse = async function(bootcampId) {
  console.log("Calculating Average Cost");

  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId }
    },
    {
      $group: { _id: "$bootcamp", averageCost: { $avg: "$tuition" } }
    }
  ]);

  try {
    const bootcamp = await this.model("Bootcamp").findByIdAndUpdate(
      bootcampId,
      {
        averageCost: Math.ceil(obj[0].averageCost / 10) * 10
      }
    );
  } catch (error) {
    console.error(error);
  }
};

// call getAverageCost after save
CourseSchema.post("save", async function() {
  this.constructor.getAverageCourse(this.bootcamp);
});

// call getAverageCost before remove
CourseSchema.pre("remove", async function() {
  this.constructor.getAverageCourse(this.bootcamp);
});

module.exports = mongoose.model("Course", CourseSchema);
