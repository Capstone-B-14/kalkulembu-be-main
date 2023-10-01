const express = require("express");
const {
  register,
  login,
  logout,
  getProfile,
  // forgotPassword,
  updateProfile,
  updatePassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/accessControl");

const router = express.Router();

const cors = require("cors");
router.use(cors());

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(protect, logout);
router.route("/profile").post(protect, getProfile);
// router.route("/forgotpassword").post(forgotPassword);
// router.route("/resetpassword/:resettoken").put(resetPassword);
router.route("/updateprofile").put(updateProfile);
router.route("/updatepassword").put(updatePassword);

module.exports = router;
