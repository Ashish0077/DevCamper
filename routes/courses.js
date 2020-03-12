const express = require("express");

const { getAllCourses, getSingleCourse } = require("../controllers/courses");

const router = express.Router({ mergeParams: true });

router.route("/").get(getAllCourses);

router.route("/:id").get(getSingleCourse);

module.exports = router;
