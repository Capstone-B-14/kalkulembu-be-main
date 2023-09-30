const express = require("express");
const { getAllUsers, getUser, createUser } = require("../controllers/users");
const { getAllFarms, createFarm } = require("../controllers/farms");

// Include farm router
const farmsRouter = require("./farms");

const router = express.Router();

const cors = require("cors");
router.use(cors());

const advancedResults = require("../middleware/advancedResults");

// Re-route into farms routes
router.use("/:userId/farms", farmsRouter);

router.route("/").get(advancedResults("Users"), getAllUsers).post(createUser);
router.route("/:id").get(getUser);

module.exports = router;
