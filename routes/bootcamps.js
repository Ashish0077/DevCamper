const express = require("express");
const advanceQuery = require("../middleware/advanceQuery");
const Bootcamp = require("../models/Bootcamp");
const { protect, authenticateRoles } = require("../middleware/auth");

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
const reviewRouter = require("./reviews");

const router = express.Router();

// re-route into other resource router
router.use("/:bootcampId/courses", courseRouter);
router.use("/:bootcampId/reviews", reviewRouter);

router
  .route("/:id/photo")
  .put(protect, authenticateRoles("publisher", "admin"), uploadBootcampPhoto);

router
  .route("/")
  .get(
    advanceQuery(Bootcamp, {
      path: "courses publisher",
      select: "title description name email"
    }),
    getAllBootcamps
  )
  .post(protect, authenticateRoles("publisher", "admin"), createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, authenticateRoles("publisher", "admin"), updateBootcamp)
  .delete(protect, authenticateRoles("publisher", "admin"), deleteBootcamp);

router.route("/radius/:zipcode/:distance/:unit").get(getBootcampsInRadius);

module.exports = router;
