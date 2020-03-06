const Bootcamp = require("../models/Bootcamp");

/* 
    @desc    get all bootcamps
    @route   GET /api/v1/bootcamps
    @access  Public  
*/
function getAllBootcamps(req, res, next) {
  res.status(200).json({
    success: true,
    msg: "Show all bootcamps"
  });
}

/* 
    @desc    get single bootcamps
    @route   GET /api/v1/bootcamps/:id
    @access  Public  
*/
function getBootcamp(req, res, next) {
  res.status(200).json({
    success: true,
    msg: `get Bootcamp ${req.params.id}`
  });
}

/* 
    @desc    create new bootcamp
    @route   POST /api/v1/bootcamps
    @access  Private  
*/
async function createBootcamp(req, res, next) {
  try {
    const data = req.body;
    const newBootcamp = await Bootcamp.create(data);
    res.status(201).json({
      success: true,
      data: newBootcamp
    });
  } catch (error) {
    res.status(400).json({
      success: false
    });
  }
}

/* 
    @desc    update bootcamp
    @route   PUT /api/v1/bootcamps/:id
    @access  Private  
*/
function updateBootcamp(req, res, next) {
  res.status(200).json({
    success: true,
    msg: `Update Bootcamp ${req.params.id}`
  });
}

/* 
    @desc    delete bootcamp
    @route   DELETE /api/v1/bootcamps/:id
    @access  Private  
*/
function deleteBootcamp(req, res, next) {
  res.status(200).json({
    success: true,
    msg: `delete Bootcamp ${req.params.id}`
  });
}

module.exports = {
  getAllBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp
};
