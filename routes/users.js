const express = require("express");
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/usersController");
const { protect, authorize } = require("../middleware/accessControl");

// Include farm router
const farmsRouter = require("./farms");

const router = express.Router({ mergeParams: true });

const cors = require("cors");
router.use(cors());

const advancedResults = require("../middleware/advancedResults");

// Re-route into farms routes
router.use("/:userId/farms", farmsRouter);

router
  .route("/")
  .get(advancedResults("Users"), protect, authorize("admin"), getAllUsers)
  .post(protect, authorize("admin"), createUser);

router
  .route("/:id")
  .get(protect, authorize("admin"), getUser)
  .put(protect, authorize("admin"), updateUser)
  .delete(protect, authorize("admin"), deleteUser);

module.exports = router;
