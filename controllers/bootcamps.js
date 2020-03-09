const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");
const geoCoder = require("../utils/geoCoder");

/* 
    @desc    get all bootcamps
    @route   GET /api/v1/bootcamps
    @access  Public  
*/
const getAllBootcamps = asyncHandler(async (req, res, next) => {
  // extracting select fields and fixing the query
  let fields;
  if (req.query.select != undefined) {
    fields = req.query.select.split(",").join(" ");
    fields.trim();
    if (fields.length == 0 || fields == "all") {
      fields = undefined;
    }
    delete req.query.select;
  }

  // adding dollar operator for mongoose in the query
  let queryStr = JSON.stringify(req.query);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  req.query = JSON.parse(queryStr);

  const bootcamps = await Bootcamp.find(req.query).select(fields);
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  });
});

/* 
    @desc    get single bootcamps
    @route   GET /api/v1/bootcamps/:id
    @access  Public  
*/
const getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp Not found with ID : ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: bootcamp
  });
});

/* 
    @desc    create new bootcamp
    @route   POST /api/v1/bootcamps
    @access  Private  
*/
const createBootcamp = asyncHandler(async (req, res, next) => {
  const data = req.body;
  const newBootcamp = await Bootcamp.create(data);
  res.status(201).json({
    success: true,
    data: newBootcamp
  });
});

/* 
    @desc    update bootcamp
    @route   PUT /api/v1/bootcamps/:id
    @access  Private  
*/
const updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp Not found with ID : ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: bootcamp
  });
});

/* 
    @desc    delete bootcamp
    @route   DELETE /api/v1/bootcamps/:id
    @access  Private  
*/
const deleteBootcamp = asyncHandler(async (req, res, next) => {
  const deletedBootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  if (!deletedBootcamp) {
    return next(
      new ErrorResponse(`Bootcamp Not found with ID : ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: {}
  });
});

/* 
    @desc    get bootcamps within a radius
    @route   GET /api/v1/bootcamps/radius/:zipcode/:distance/:unit
    @access  Private  
*/
const getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance, unit } = req.params;
  // latitude and longitude
  const loc = await geoCoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // calculate radius
  // dividing distance by radius of earth
  // earth radius = 3963 Miles or 6378 Km
  let radius;
  if (unit == "mi") {
    radius = distance / 3963;
  } else {
    radius = distance / 6378;
  }

  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] }
    }
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  });
});

module.exports = {
  getAllBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius
};
