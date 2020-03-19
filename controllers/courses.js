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
  res.status(200).json(res.advanceQuery);
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
  // Current User
  const currentUser = req.user;

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

  if (bootcamp.publisher != currentUser.id && currentUser.role != "admin") {
    return next(
      new ErrorResponse(
        `User with ID: ${currentUser.id} is not authorized to add course to Bootcamp with ID: ${bootcamp.id}`,
        403
      )
    );
  }

  const newCourse = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: newCourse
  });
});

/* 
    @desc    Update course
    @route   PUT /api/v1/courses/:id
    @access  Private
*/
const updateCourse = asyncHandler(async (req, res, next) => {
  // Current User
  const currentUser = req.user;

  let course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "publisher"
  });

  if (!course) {
    return next(
      new ErrorResponse(
        `No course with the id of ${req.params.bootcampId}`,
        404
      )
    );
  }

  // checking for ownership
  if (
    course.bootcamp.publisher != currentUser.id &&
    currentUser.role != "admin"
  ) {
    return next(
      new ErrorResponse(
        `User with ID: ${currentUser.id} is not authorized to update course of Bootcamp with ID: ${course.bootcamp.id}`,
        403
      )
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: course
  });
});

/* 
    @desc    delete course
    @route   DELETE /api/v1/courses/:id
    @access  Private
*/
const deleteCourse = asyncHandler(async (req, res, next) => {
  // Current User
  const currentUser = req.user;

  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "publisher"
  });

  if (!course) {
    return next(
      new ErrorResponse(`No Course found with ID : ${req.params.id}`, 404)
    );
  }

  // checking for ownership
  if (
    course.bootcamp.publisher != currentUser.id &&
    currentUser.role != "admin"
  ) {
    return next(
      new ErrorResponse(
        `User with ID: ${currentUser.id} is not authorized to delete course of Bootcamp with ID: ${course.bootcamp.id}`,
        403
      )
    );
  }

  course.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

module.exports = {
  getAllCourses,
  getSingleCourse,
  addCourse,
  updateCourse,
  deleteCourse
};
