const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");
const geoCoder = require("../utils/geoCoder");
const path = require("path");

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

  // extracting sorting parameters
  let sortBy;
  if (req.query.sort) {
    sortBy = req.query.sort.split(",").join(" ");
    delete req.query.sort;
  } else {
    sortBy = "-createdAt";
  }

  // pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();
  if (req.query.page) delete req.query.page;
  if (req.query.limit) delete req.query.limit;

  // adding dollar operator for mongoose in the query
  let queryStr = JSON.stringify(req.query);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  req.query = JSON.parse(queryStr);

  const bootcamps = await Bootcamp.find(req.query)
    .populate({
      path: "courses",
      select: "title description weeks"
    })
    .select(fields)
    .sort(sortBy)
    .skip(startIndex)
    .limit(limit);

  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit: limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit: limit
    };
  }

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination: pagination,
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
  const deletedBootcamp = await Bootcamp.findById(req.params.id);
  if (!deletedBootcamp) {
    return next(
      new ErrorResponse(`Bootcamp Not found with ID : ${req.params.id}`, 404)
    );
  }

  deletedBootcamp.remove();

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

/* 
    @desc    Upload Photo for bootcamp
    @route   PUT /api/v1/bootcamps/:id/photo
    @access  Private
*/
const uploadBootcampPhoto = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp Not found with ID : ${req.params.id}`, 404)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse("Please Upload a file", 400));
  }

  const file = req.files.file;
  console.log(file);

  // checking if it is a image file or not
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse("Please Upload an Image File", 400));
  }

  // checking file size
  if (file.size > process.env.MAX_FILE_UPLOAD_SIZE) {
    return next(
      new ErrorResponse(
        "Please Upload an Image less than",
        process.env.MAX_FILE_UPLOAD_SIZE
      ),
      400
    );
  }

  // create custom file name
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse("Problem with file upload", 500));
    }

    await Bootcamp.findByIdAndUpdate(req.params._id, { photo: file.name });
    res.status(200).json({
      success: true,
      data: file.name
    });
  });
});

module.exports = {
  getAllBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  uploadBootcampPhoto
};
