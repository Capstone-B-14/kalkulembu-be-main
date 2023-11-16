const express = require("express");
const {
  cattlePhotoUpload,
  getCattleImages,
} = require("../controllers/imagesController");
const { protect, authorize } = require("../middleware/accessControl");
// const upload = require("../middleware/multer");

const router = express.Router({ mergeParams: true });

// const cors = require("cors");
// router.use(cors());

router
  .route("/")
  .get(getCattleImages)
  .post(protect, authorize("farmer", "admin"), cattlePhotoUpload);
module.exports = router;
