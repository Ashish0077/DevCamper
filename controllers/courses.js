const Course = require("../models/Course");
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

module.exports = {
  getAllCourses,
  getSingleCourse
};
