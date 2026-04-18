const express = require("express");
const router = express.Router();
const {
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/tasksController");

router.get("/", getTasksByProject);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
