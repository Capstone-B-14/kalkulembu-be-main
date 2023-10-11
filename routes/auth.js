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
const { protect, authorize } = require("../middleware/accessControl");

const router = express.Router({ mergeParams: true });

const cors = require("cors");
router.use(cors());

router.route("/register").post(register);
router.route("/login").post(login);
router
  .route("/logout")
  .get(protect, authorize("user", "farmer", "admin"), logout);
router
  .route("/profile")
  .post(protect, authorize("user", "farmer", "admin"), getProfile);
// router.route("/forgotpassword").post(protect, forgotPassword);
// router.route("/resetpassword/:resettoken").put(protect, resetPassword);
router
  .route("/updateprofile")
  .put(protect, authorize("user", "farmer", "admin"), updateProfile);
router
  .route("/updatepassword")
  .put(protect, authorize("user", "farmer", "admin"), updatePassword);

module.exports = router;
