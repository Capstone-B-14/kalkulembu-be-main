const express = require("express");
const { cowPhotoUpload } = require("../controllers/imagesController");
const { protect, authorize } = require("../middleware/accessControl");

const router = express.Router({ mergeParams: true });

const cors = require("cors");
router.use(cors());

const advancedResults = require("../middleware/advancedResults");

router.route("/upload/photo").post(cowPhotoUpload);

module.exports = router;
