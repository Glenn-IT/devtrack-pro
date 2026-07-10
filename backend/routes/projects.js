const express = require("express");
const router = express.Router();
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectsController");
const { protect, requireAdmin } = require("../middleware/authMiddleware");

router.get("/", protect, getAllProjects);
router.get("/:id", protect, getProjectById);
router.post("/", protect, requireAdmin, createProject);
router.put("/:id", protect, requireAdmin, updateProject);
router.delete("/:id", protect, requireAdmin, deleteProject);

module.exports = router;
