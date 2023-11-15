const express = require("express");
const {
  getCattleStats,
  getCattleAvgWeight,
  getLatestCattleStats,
  getCattleStatsByDate,
  getCattleAboveWeight,
  createOrUpdateCattleStats,
  deleteCattleStats,
} = require("../controllers/statsController");
const { protect, authorize } = require("../middleware/accessControl");

const router = express.Router({ mergeParams: true });

// const cors = require("cors");
// router.use(cors());

const advancedResults = require("../middleware/advancedResults");

router.route("/").get(advancedResults("Stats"), getCattleStats);

router.route("/weight").get(getCattleAvgWeight);

router.route("/weight-above/:weight").get(getCattleAboveWeight);

router.route("/latest").get(getLatestCattleStats);

router
  .route("/:date")
  .get(getCattleStatsByDate)
  .post(protect, authorize("farmer", "admin"), createOrUpdateCattleStats)
  .put(protect, authorize("admin"), deleteCattleStats);

module.exports = router;
