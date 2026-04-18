const express = require("express");
const router = express.Router();
const { syncFromGitHub } = require("../controllers/githubSyncController");

// GET /api/projects/:id/sync-github
router.get("/:id/sync-github", syncFromGitHub);

module.exports = router;
