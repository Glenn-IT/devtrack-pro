const db = require("../config/db");

// GET /api/projects
const getAllProjects = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM projects ORDER BY created_at DESC",
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/projects/:id
const getProjectById = async (req, res) => {
  try {
    const [projects] = await db.query("SELECT * FROM projects WHERE id = ?", [
      req.params.id,
    ]);
    if (projects.length === 0)
      return res.status(404).json({ error: "Project not found" });

    const [tasks] = await db.query("SELECT * FROM tasks WHERE project_id = ?", [
      req.params.id,
    ]);
    const [milestones] = await db.query(
      "SELECT * FROM milestones WHERE project_id = ? ORDER BY date ASC",
      [req.params.id],
    );

    res.json({ ...projects[0], tasks, milestones });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/projects
const createProject = async (req, res) => {
  const {
    name,
    client,
    status,
    description,
    repo,
    progress,
    budget,
    paid,
    start_date,
    end_date,
  } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO projects (name, client, status, description, repo, progress, budget, paid, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        name,
        client,
        status || "To Do",
        description,
        repo,
        progress || 0,
        budget || 0,
        paid || 0,
        start_date,
        end_date,
      ],
    );
    const [newProject] = await db.query("SELECT * FROM projects WHERE id = ?", [
      result.insertId,
    ]);
    res.status(201).json(newProject[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/projects/:id
const updateProject = async (req, res) => {
  const {
    name,
    client,
    status,
    description,
    repo,
    progress,
    budget,
    paid,
    start_date,
    end_date,
  } = req.body;
  try {
    await db.query(
      "UPDATE projects SET name=?, client=?, status=?, description=?, repo=?, progress=?, budget=?, paid=?, start_date=?, end_date=? WHERE id=?",
      [
        name,
        client,
        status,
        description,
        repo,
        progress,
        budget,
        paid,
        start_date,
        end_date,
        req.params.id,
      ],
    );
    const [updated] = await db.query("SELECT * FROM projects WHERE id = ?", [
      req.params.id,
    ]);
    if (updated.length === 0)
      return res.status(404).json({ error: "Project not found" });
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/projects/:id
const deleteProject = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM projects WHERE id = ?", [
      req.params.id,
    ]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Project not found" });
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
