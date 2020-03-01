const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    msg: "Show all bootcamps"
  });
});

router.get("/:id", (req, res) => {
  res.status(200).json({
    success: true,
    msg: `get Bootcamp ${req.params.id}`
  });
});

router.post("/", (req, res) => {
  res.status(200).json({
    success: true,
    msg: "create new bootcamp"
  });
});

router.put("/:id", (req, res) => {
  res.status(200).json({
    success: true,
    msg: `Update Bootcamp ${req.params.id}`
  });
});

router.delete("/:id", (req, res) => {
  res.status(200).json({
    success: true,
    msg: `delete Bootcamp ${req.params.id}`
  });
});

module.exports = router;
