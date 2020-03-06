const Bootcamp = require("../models/Bootcamp");

/* 
    @desc    get all bootcamps
    @route   GET /api/v1/bootcamps
    @access  Public  
*/
async function getAllBootcamps(req, res, next) {
  try {
    const bootcamps = await Bootcamp.find({});
    res.status(200).json({
      success: true,
      data: bootcamps
    });
  } catch (error) {
    res.status(400).json({
      success: false
    });
  }
}

/* 
    @desc    get single bootcamps
    @route   GET /api/v1/bootcamps/:id
    @access  Public  
*/
async function getBootcamp(req, res, next) {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({
      success: true,
      data: bootcamp
    });
  } catch (error) {
    res.status(400).json({
      success: false
    });
  }
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
async function updateBootcamp(req, res, next) {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!bootcamp) {
      return res.status(400).json({
        success: false
      });
    }

    res.status(200).json({
      success: true,
      data: bootcamp
    });
  } catch (error) {
    res.status(400).json({
      success: false
    });
  }
}

/* 
    @desc    delete bootcamp
    @route   DELETE /api/v1/bootcamps/:id
    @access  Private  
*/
async function deleteBootcamp(req, res, next) {
  try {
    const deletedBootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!deletedBootcamp) {
      return res.status(400).json({
        success: false
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false
    });
  }
}

module.exports = {
  getAllBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp
};
