const express = require("express");

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

router.route("/:id/photo").put(uploadBootcampPhoto);

router
  .route("/")
  .get(getAllBootcamps)
  .post(createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

router.route("/radius/:zipcode/:distance/:unit").get(getBootcampsInRadius);

module.exports = router;
