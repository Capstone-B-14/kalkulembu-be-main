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
// router.route("/forgotpassword").post(protect, forgotPassword);
// router.route("/resetpassword/:resettoken").put(protect, resetPassword);
router.route("/updateprofile").put(protect, updateProfile);
router.route("/updatepassword").put(protect, updatePassword);

module.exports = router;
