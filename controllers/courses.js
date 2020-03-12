const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");

/* 
    @desc    get all courses
    @route   GET /api/v1/courses
    @route   GET /api/v1/bootcamps/:bootcampsId/courses
    @access  Public  
*/
const getAllCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find({}).populate({
      path: "bootcamp",
      select: "name description"
    });
  }

  const courses = await query;

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses
  });
});

/* 
    @desc    get single courses
    @route   GET /api/v1/courses/:id
    @access  Public  
*/
const getSingleCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description"
  });

  if (!course) {
    return next(new ErrorResponse("No course with id of ", req.params.id), 404);
  }

  res.status(200).json({
    success: true,
    data: course
  });
});

/* 
    @desc    Add course
    @route   POST /api/v1/bootcamps/:bootcampId/courses
    @access  Private
*/
const addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp with the id of ${req.params.bootcampId}`,
        404
      )
    );
  }

  const newCourse = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: newCourse
  });
});

module.exports = {
  getAllCourses,
  getSingleCourse,
  addCourse
};
