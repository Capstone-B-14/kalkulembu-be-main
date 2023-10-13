const express = require("express");
const { cowPhotoUpload } = require("../controllers/imagesController");
const { protect, authorize } = require("../middleware/accessControl");
// const upload = require("../middleware/multer");

const router = express.Router({ mergeParams: true });

const cors = require("cors");
router.use(cors());

router.route("/").post(protect, authorize("farmer", "admin"), cowPhotoUpload);

module.exports = router;
