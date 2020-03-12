const express = require("express");

const {
  getAllCourses,
  getSingleCourse,
  addCourse,
  updateCourse
} = require("../controllers/courses");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getAllCourses)
  .post(addCourse);

router
  .route("/:id")
  .get(getSingleCourse)
  .put(updateCourse);

module.exports = router;
