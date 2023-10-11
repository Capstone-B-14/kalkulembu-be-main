const express = require("express");
const {
  getAllCows,
  getCow,
  createCow,
  updateCow,
  deleteCow,
} = require("../controllers/cowsController");
const { protect, authorize } = require("../middleware/accessControl");

const router = express.Router({ mergeParams: true });

const cors = require("cors");
router.use(cors());

const advancedResults = require("../middleware/advancedResults");

const statsRouter = require("./stats");

router.use("/:cowId/stats", statsRouter);
router.use("/:cowId/stats/:date", statsRouter);

router
  .route("/")
  .get(advancedResults("Cows"), getAllCows)
  .post(protect, authorize("farmer", "admin"), createCow);

router
  .route("/:id")
  .get(getCow)
  .put(protect, authorize("farmer", "admin"), updateCow)
  .delete(protect, authorize("farmer", "admin"), deleteCow);

module.exports = router;
