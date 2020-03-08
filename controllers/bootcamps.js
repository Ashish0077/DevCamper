const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");

/* 
    @desc    get all bootcamps
    @route   GET /api/v1/bootcamps
    @access  Public  
*/
async function getAllBootcamps(req, res, next) {
  try {
    const bootcamps = await Bootcamp.find({});
    res.status(200).json({
      success: true,
      data: bootcamps
    });
  } catch (error) {
    next(error);
  }
}

/* 
    @desc    get single bootcamps
    @route   GET /api/v1/bootcamps/:id
    @access  Public  
*/
async function getBootcamp(req, res, next) {
  try {
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
  } catch (error) {
    // res.status(400).json({
    //   success: false
    // });
    next(error);
  }
}

/* 
    @desc    create new bootcamp
    @route   POST /api/v1/bootcamps
    @access  Private  
*/
async function createBootcamp(req, res, next) {
  try {
    const data = req.body;
    const newBootcamp = await Bootcamp.create(data);
    res.status(201).json({
      success: true,
      data: newBootcamp
    });
  } catch (error) {
    next(error);
  }
}

/* 
    @desc    update bootcamp
    @route   PUT /api/v1/bootcamps/:id
    @access  Private  
*/
async function updateBootcamp(req, res, next) {
  try {
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
  } catch (error) {
    next(error);
  }
}

/* 
    @desc    delete bootcamp
    @route   DELETE /api/v1/bootcamps/:id
    @access  Private  
*/
async function deleteBootcamp(req, res, next) {
  try {
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
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp
};
