const express = require("express");
const { registerUser } = require("../controllers/auth");

const router = express.Router();

router.post("/register", registerUser);

module.exports = router;
