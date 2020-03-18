const express = require("express");
const advanceQuery = require("../middleware/advanceQuery");
const Course = require("../models/Course");
const { protect, authenticateRoles } = require("../middleware/auth");

const {
  getAllCourses,
  getSingleCourse,
  addCourse,
  updateCourse,
  deleteCourse
} = require("../controllers/courses");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(
    advanceQuery(Course, {
      path: "bootcamp",
      select: "name description"
    }),
    getAllCourses
  )
  .post(protect, authenticateRoles("publisher", "admin"), addCourse);

router
  .route("/:id")
  .get(getSingleCourse)
  .put(protect, authenticateRoles("publisher", "admin"), updateCourse)
  .delete(protect, authenticateRoles("publisher", "admin"), deleteCourse);

module.exports = router;
