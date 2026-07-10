const express = require("express");
const router = express.Router();
const {
  getAllWeeklyEntries,
  createWeeklyEntry,
  updateWeeklyEntry,
  deleteWeeklyEntry,
} = require("../controllers/weeklyController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getAllWeeklyEntries);
router.post("/", protect, createWeeklyEntry);
router.put("/:id", protect, updateWeeklyEntry);
router.delete("/:id", protect, deleteWeeklyEntry);

module.exports = router;
