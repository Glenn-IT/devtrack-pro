const express = require("express");
const router = express.Router();
const {
  getAllWeeklyEntries,
  createWeeklyEntry,
  updateWeeklyEntry,
  deleteWeeklyEntry,
} = require("../controllers/weeklyController");

router.get("/", getAllWeeklyEntries);
router.post("/", createWeeklyEntry);
router.put("/:id", updateWeeklyEntry);
router.delete("/:id", deleteWeeklyEntry);

module.exports = router;
