const express = require("express");
const {
  getCowStats,
  getCowStatsByDate,
  createOrUpdateCowStats,
  deleteCowStats,
} = require("../controllers/statsController");
const { protect, authorize } = require("../middleware/accessControl");

const router = express.Router({ mergeParams: true });

const cors = require("cors");
router.use(cors());

const advancedResults = require("../middleware/advancedResults");

router.route("/").get(advancedResults("Stats"), getCowStats);

router
  .route("/:date")
  .get(getCowStatsByDate)
  .post(protect, authorize("farmer", "admin"), createOrUpdateCowStats)
  .put(protect, authorize("admin"), deleteCowStats);

module.exports = router;
