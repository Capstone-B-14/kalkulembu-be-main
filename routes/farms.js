const express = require("express");
const { getAllFarms, getFarm, createFarm } = require("../controllers/farms");

const router = express.Router({ mergeParams: true });

const cors = require("cors");
router.use(cors());

const advancedResults = require("../middleware/advancedResults");

router.route("/").get(advancedResults("Farms"), getAllFarms).post(createFarm);
router.route("/:id").get(getFarm);

module.exports = router;
