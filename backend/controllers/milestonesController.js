const db = require("../config/db");

// GET /api/milestones?project_id=1
const getMilestonesByProject = async (req, res) => {
  try {
    const { project_id } = req.query;
    const query = project_id
      ? "SELECT * FROM milestones WHERE project_id = ? ORDER BY date ASC"
      : "SELECT * FROM milestones ORDER BY date ASC";
    const [rows] = await db.query(query, project_id ? [project_id] : []);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/milestones
const createMilestone = async (req, res) => {
  const { project_id, title, date } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO milestones (project_id, title, date, done) VALUES (?, ?, ?, FALSE)",
      [project_id, title, date],
    );
    res
      .status(201)
      .json({ id: result.insertId, project_id, title, date, done: false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/milestones/:id
const updateMilestone = async (req, res) => {
  const { title, date, done } = req.body;
  try {
    await db.query("UPDATE milestones SET title=?, date=?, done=? WHERE id=?", [
      title,
      date,
      done,
      req.params.id,
    ]);
    const [updated] = await db.query("SELECT * FROM milestones WHERE id = ?", [
      req.params.id,
    ]);
    if (updated.length === 0)
      return res.status(404).json({ error: "Milestone not found" });
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/milestones/:id
const deleteMilestone = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM milestones WHERE id = ?", [
      req.params.id,
    ]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Milestone not found" });
    res.json({ message: "Milestone deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getMilestonesByProject,
  createMilestone,
  updateMilestone,
  deleteMilestone,
};
