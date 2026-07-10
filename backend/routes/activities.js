const express = require("express");
const router = express.Router();
const { protect, requireAdmin } = require("../middleware/authMiddleware");
const { getActivities } = require("../controllers/activitiesController");

router.get("/", protect, requireAdmin, getActivities);

module.exports = router;
