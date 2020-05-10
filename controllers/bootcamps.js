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
  res.status(200).json(res.advanceQuery);
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

  // adding publisher to the bootcamp
  data.publisher = req.user;

  // Checking for published bootcamp
  const publishedBootcamp = await Bootcamp.findOne({
    publisher: data.publisher
  });

  // if the user is not admin, they can only add one bootcamp
  if (data.publisher.role != "admin" && publishedBootcamp) {
    return (
      next(
        new ErrorResponse(
          `The user with ID: ${data.publisher.id} has already published a bootcamp`
        )
      ),
      400
    );
  }

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
  // current user
  const currentUser = req.user;

  // finding bootcamp with provided id
  let bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp Not found with ID : ${req.params.id}`, 404)
    );
  }

  // making sure if the user owns the bootcamp or not
  if (bootcamp.publisher != currentUser.id && currentUser.role != "admin") {
    return next(
      new ErrorResponse(
        `User with ID: ${currentUser.id} is not authorized for updating bootcamp with ID: ${bootcamp.id}`,
        403
      )
    );
  }

  // extracting updated data
  const updateData = req.body;

  bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true
  });

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
  // current user
  const currentUser = req.user;

  // finding bootcamp with provided id
  let bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp Not found with ID : ${req.params.id}`, 404)
    );
  }

  // making sure if the user owns the bootcamp or not
  if (bootcamp.publisher != currentUser.id && currentUser.role != "admin") {
    return next(
      new ErrorResponse(
        `User with ID: ${currentUser.id} is not authorized for deleting bootcamp with ID: ${bootcamp.id}`,
        403
      )
    );
  }

  bootcamp.remove();

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
  // current user
  const currentUser = req.user;

  // finding bootcamp with provided id
  let bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp Not found with ID : ${req.params.id}`, 404)
    );
  }

  // making sure if the user owns the bootcamp or not
  if (bootcamp.publisher != currentUser.id && currentUser.role != "admin") {
    return next(
      new ErrorResponse(
        `User with ID: ${currentUser.id} is not authorized for updating photo of bootcamp with ID: ${bootcamp.id}`,
        403
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse("Please Upload a file", 400));
  }

  const file = req.files.file;
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

  // uploading file to storage
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse("Problem with file upload", 500));
    }

    // updating bootcmap with the updated photo
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
