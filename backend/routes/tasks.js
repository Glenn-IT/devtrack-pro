const express = require("express");
const router = express.Router();
const {
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/tasksController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getTasksByProject);
router.post("/", protect, createTask);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);

module.exports = router;
