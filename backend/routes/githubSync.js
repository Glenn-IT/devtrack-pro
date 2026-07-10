const express = require("express");
const router = express.Router();
const { syncFromGitHub } = require("../controllers/githubSyncController");
const { protect } = require("../middleware/authMiddleware");

// GET /api/projects/:id/sync-github
router.get("/:id/sync-github", protect, syncFromGitHub);

module.exports = router;
