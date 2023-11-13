const express = require("express");
const {
  getAllCattle,
  getCattle,
  createCattle,
  updateCattle,
  deleteCattle,
  getLatestCattleStatsPerFarm,
} = require("../controllers/cattleController");
const { saveCattleImageUrl } = require("../controllers/imagesController");
const { protect, authorize } = require("../middleware/accessControl");

const router = express.Router({ mergeParams: true });

const cors = require("cors");
router.use(cors());

const advancedResults = require("../middleware/advancedResults");

const statsRouter = require("./stats");
const imagesRouter = require("./images");

router.use("/:cattleId/stats", statsRouter);
router.use("/:cattleId/stats/:date", statsRouter);
router.use("/:cattleId/images", imagesRouter);

router
  .route("/")
  .get(advancedResults("Cattle"), getAllCattle)
  .post(protect, authorize("farmer", "admin"), createCattle);

router.route("/latest").get(getLatestCattleStatsPerFarm);

router
  .route("/:id")
  .get(getCattle)
  .put(protect, authorize("farmer", "admin"), updateCattle)
  .delete(protect, authorize("farmer", "admin"), deleteCattle);

router.post("/:cattleId/saveImageUrl", protect, saveCattleImageUrl);

module.exports = router;
