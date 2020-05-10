const express = require("express");
const User = require("../models/User");
const advanceQuery = require("../middleware/advanceQuery");
const { protect, authenticateRoles } = require("../middleware/auth");
const {
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser
} = require("../controllers/users");

const router = express.Router({ mergeParams: true });

router.use(protect, authenticateRoles("admin"));

router.route("/").get(advanceQuery(User), getUsers).post(createUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
