const express = require("express");
const router = express.Router();
const {
  getAllMeetings,
  createMeeting,
  updateMeeting,
  deleteMeeting,
} = require("../controllers/meetingsController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getAllMeetings);
router.post("/", protect, createMeeting);
router.put("/:id", protect, updateMeeting);
router.delete("/:id", protect, deleteMeeting);

module.exports = router;
