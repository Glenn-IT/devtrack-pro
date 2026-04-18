const db = require("../config/db");

// GET /api/meetings
const getAllMeetings = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT m.*, pr.name AS project
      FROM meetings m
      LEFT JOIN projects pr ON m.project_id = pr.id
      ORDER BY m.date ASC, m.time ASC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/meetings
const createMeeting = async (req, res) => {
  const { project_id, client, type, date, time, platform, notes } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO meetings (project_id, client, type, date, time, platform, notes) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [project_id, client, type, date, time, platform, notes],
    );
    res.status(201).json({
      id: result.insertId,
      project_id,
      client,
      type,
      date,
      time,
      platform,
      notes,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/meetings/:id
const updateMeeting = async (req, res) => {
  const { project_id, client, type, date, time, platform, notes, status } =
    req.body;
  try {
    await db.query(
      "UPDATE meetings SET project_id=?, client=?, type=?, date=?, time=?, platform=?, notes=?, status=? WHERE id=?",
      [
        project_id,
        client,
        type,
        date,
        time,
        platform,
        notes,
        status,
        req.params.id,
      ],
    );
    const [updated] = await db.query(
      "SELECT m.*, pr.name AS project FROM meetings m LEFT JOIN projects pr ON m.project_id = pr.id WHERE m.id = ?",
      [req.params.id],
    );
    if (updated.length === 0)
      return res.status(404).json({ error: "Meeting not found" });
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/meetings/:id
const deleteMeeting = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM meetings WHERE id = ?", [
      req.params.id,
    ]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Meeting not found" });
    res.json({ message: "Meeting deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllMeetings,
  createMeeting,
  updateMeeting,
  deleteMeeting,
};
