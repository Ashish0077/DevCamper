const express = require("express");
const advanceQuery = require("../middleware/advanceQuery");
const Review = require("../models/Review");
const { protect, authenticateRoles } = require("../middleware/auth");

const {
  getAllReviews,
  getReview,
  addReview
} = require("../controllers/reviews");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(
    advanceQuery(Review, {
      path: "bootcamp",
      select: "name description publisher"
    }),
    getAllReviews
  )
  .post(protect, authenticateRoles("user", "admin"), addReview);

router.route("/:id").get(getReview);

module.exports = router;
