const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { exportDatabase } = require("../controllers/exportController");

router.get("/", protect, exportDatabase);

module.exports = router;
