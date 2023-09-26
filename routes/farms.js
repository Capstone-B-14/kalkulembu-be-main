const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ success: true, msg: "Show all farms" });
});

router.get("/:id", (req, res) => {
  res.status(200).json({ success: true, msg: `Show farm ${req.params.id}` });
});

router.post("/", (req, res) => {
  res.status(200).json({ success: true, msg: "Create new farm" });
});

router.put("/:id", (req, res) => {
  res.status(200).json({ success: true, msg: `Update farm ${req.params.id}` });
});

router.delete("/:id", (req, res) => {
  res.status(200).json({ success: true, msg: `Delete farm ${req.params.id}` });
});

module.exports = router;
