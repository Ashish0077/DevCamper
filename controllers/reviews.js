const Review = require("../models/Review");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");

/* 
    @desc    get all reviews
    @route   GET /api/v1/reviews
    @route   GET /api/v1/bootcamps/:bootcampsId/reviews
    @access  Public  
*/
const getAllReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      success: "true",
      count: reviews.length,
      data: reviews
    });
  }

  res.status(200).json(res.advanceQuery);
});

/* 
    @desc    get single review
    @route   GET /api/v1/reviews/:id
    @access  Public  
*/
const getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description publisher"
  });

  if (!review) {
    return next(new ErrorResponse("No Review Found", 404));
  }

  res.status(200).json({
    success: true,
    data: review
  });
});

module.exports = {
  getAllReviews,
  getReview
};
