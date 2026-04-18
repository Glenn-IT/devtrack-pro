const express = require("express");
const router = express.Router();
const {
  getMilestonesByProject,
  createMilestone,
  updateMilestone,
  deleteMilestone,
} = require("../controllers/milestonesController");

router.get("/", getMilestonesByProject);
router.post("/", createMilestone);
router.put("/:id", updateMilestone);
router.delete("/:id", deleteMilestone);

module.exports = router;
