const express = require("express");
const {
  getAllCows,
  getCow,
  createCow,
  updateCow,
  deleteCow,
} = require("../controllers/cowsController");
const { protect } = require("../middleware/accessControl");

const router = express.Router({ mergeParams: true });

const cors = require("cors");
router.use(cors());

router.route("/").get(getAllCows).post(protect, createCow);
router
  .route("/:id")
  .get(getCow)
  .put(protect, updateCow)
  .delete(protect, deleteCow);

module.exports = router;
