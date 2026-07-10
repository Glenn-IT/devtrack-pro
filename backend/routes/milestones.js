const express = require("express");
const router = express.Router();
const {
  getMilestonesByProject,
  createMilestone,
  updateMilestone,
  deleteMilestone,
} = require("../controllers/milestonesController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getMilestonesByProject);
router.post("/", protect, createMilestone);
router.put("/:id", protect, updateMilestone);
router.delete("/:id", protect, deleteMilestone);

module.exports = router;
