const mongoose = require("mongoose");

const BootcampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    unique: true,
    trim: true,
    maxlength: [50, "Name cannot be more than 50 characters"]
  },

  slug: String,

  description: {
    type: String,
    required: [true, "Please add a description"],
    maxlength: [500, "description cannot be more than 500 characters"]
  },

  website: {
    type: String,
    match: [
      /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      "Please enter a valid URL with http or https"
    ]
  },

  phone: {
    type: String,
    maxlength: [20, "Phone number can not be longer than 20 characters"]
  },

  email: {
    type: String,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please Enter a valid email address"
    ]
  },

  address: {
    type: String,
    required: [true, "Please enter your address"]
  },

  location: {
    //GeoJSON Point
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"] // 'location.type' must be 'Point'
    },
    coordinates: {
      type: [Number],
      index: "2dsphere"
    },
    formatedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String
  },

  careers: {
    type: [String],
    required: true,
    enum: [
      "Web Development",
      "Mobile Development",
      "UI/UX",
      "Data Science",
      "Business",
      "Others"
    ]
  },

  averageRating: {
    type: Number,
    min: [1, "must be atleast 1"],
    max: [10, "can not be more than 10"]
  },

  avergaeCost: {
    type: Number
  },

  photo: {
    type: String,
    default: "no-photo.jpg"
  },

  housing: {
    type: Boolean,
    default: false
  },
  jobAssistance: {
    type: Boolean,
    default: false
  },
  jobGuarantee: {
    type: Boolean,
    default: false
  },
  acceptGi: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Bootcamp", BootcampSchema);
