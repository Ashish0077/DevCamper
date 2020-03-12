const express = require("express");

const {
  getAllCourses,
  getSingleCourse,
  addCourse
} = require("../controllers/courses");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getAllCourses)
  .post(addCourse);

router.route("/:id").get(getSingleCourse);

module.exports = router;
