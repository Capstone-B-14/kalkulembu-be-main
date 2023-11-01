const express = require("express");
const {
  getAllFarms,
  getFarm,
  createFarm,
} = require("../controllers/farmsController");
const { protect, authorize } = require("../middleware/accessControl");

const router = express.Router({ mergeParams: true });

const cors = require("cors");
router.use(cors());

const advancedResults = require("../middleware/advancedResults");

// Include cattle router
const cattleRouter = require("./cattle");

// Re-route into cattle routes
router.use("/:farmId/cattle", cattleRouter);

router
  .route("/")
  .get(advancedResults("Farms"), getAllFarms)
  .post(protect, authorize("farmer", "admin"), createFarm);

router.route("/:id").get(getFarm);

module.exports = router;
