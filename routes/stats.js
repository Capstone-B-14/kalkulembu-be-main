const express = require("express");
const {
  getCattleStats,
  getCattleStatsByDate,
  createOrUpdateCattleStats,
  deleteCattleStats,
} = require("../controllers/statsController");
const { protect, authorize } = require("../middleware/accessControl");

const router = express.Router({ mergeParams: true });

const cors = require("cors");
router.use(cors());

const advancedResults = require("../middleware/advancedResults");

router.route("/").get(advancedResults("Stats"), getCattleStats);

router
  .route("/:date")
  .get(getCattleStatsByDate)
  .post(protect, authorize("farmer", "admin"), createOrUpdateCattleStats)
  .put(protect, authorize("admin"), deleteCattleStats);

module.exports = router;
