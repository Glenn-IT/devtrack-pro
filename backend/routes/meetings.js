const express = require("express");
const router = express.Router();
const {
  getAllMeetings,
  createMeeting,
  updateMeeting,
  deleteMeeting,
} = require("../controllers/meetingsController");

router.get("/", getAllMeetings);
router.post("/", createMeeting);
router.put("/:id", updateMeeting);
router.delete("/:id", deleteMeeting);

module.exports = router;
