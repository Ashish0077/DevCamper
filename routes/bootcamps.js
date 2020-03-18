const express = require("express");
const advanceQuery = require("../middleware/advanceQuery");
const Bootcamp = require("../models/Bootcamp");
const protect = require("../middleware/auth");

const {
  getAllBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  uploadBootcampPhoto
} = require("../controllers/bootcamps");

// include resource router
const courseRouter = require("./courses");

const router = express.Router();

// re-route into other resource router
router.use("/:bootcampId/courses", courseRouter);

router.route("/:id/photo").put(protect, uploadBootcampPhoto);

router
  .route("/")
  .get(
    advanceQuery(Bootcamp, {
      path: "courses",
      select: "name description"
    }),
    getAllBootcamps
  )
  .post(protect, createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, updateBootcamp)
  .delete(protect, deleteBootcamp);

router.route("/radius/:zipcode/:distance/:unit").get(getBootcampsInRadius);

module.exports = router;
