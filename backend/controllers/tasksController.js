const db = require("../config/db");

// GET /api/tasks?project_id=1
const getTasksByProject = async (req, res) => {
  try {
    const { project_id } = req.query;
    const query = project_id
      ? "SELECT * FROM tasks WHERE project_id = ?"
      : "SELECT * FROM tasks";
    const [rows] = await db.query(query, project_id ? [project_id] : []);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/tasks
const createTask = async (req, res) => {
  const { project_id, title } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO tasks (project_id, title, done) VALUES (?, ?, FALSE)",
      [project_id, title],
    );
    await recalcProgress(project_id);
    res
      .status(201)
      .json({ id: result.insertId, project_id, title, done: false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Helper: recalculate and save progress for a project
const recalcProgress = async (project_id) => {
  const [rows] = await db.query(
    "SELECT COUNT(*) AS total, SUM(done) AS done FROM tasks WHERE project_id = ?",
    [project_id],
  );
  const { total, done } = rows[0];
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;
  await db.query("UPDATE projects SET progress=? WHERE id=?", [
    progress,
    project_id,
  ]);
  return progress;
};

// PUT /api/tasks/:id  (toggle done)
const updateTask = async (req, res) => {
  const { title, done } = req.body;
  try {
    await db.query("UPDATE tasks SET title=?, done=? WHERE id=?", [
      title,
      done,
      req.params.id,
    ]);
    const [updated] = await db.query("SELECT * FROM tasks WHERE id = ?", [
      req.params.id,
    ]);
    if (updated.length === 0)
      return res.status(404).json({ error: "Task not found" });
    const progress = await recalcProgress(updated[0].project_id);
    res.json({ ...updated[0], progress });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const [task] = await db.query("SELECT project_id FROM tasks WHERE id = ?", [
      req.params.id,
    ]);
    if (task.length === 0)
      return res.status(404).json({ error: "Task not found" });
    await db.query("DELETE FROM tasks WHERE id = ?", [req.params.id]);
    const progress = await recalcProgress(task[0].project_id);
    res.json({ message: "Task deleted", progress });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getTasksByProject, createTask, updateTask, deleteTask };
