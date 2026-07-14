const db = require("../config/db");
const { logActivity } = require("../utils/activityLogger");

// DATE_FORMAT keeps checking_date a plain YYYY-MM-DD string (no timezone shift)
const SELECT_COLS = `id, system_name, category, week, recommendation, recom_status,
  recom_implemented, activity_status, activity_implemented, tutorial_vids, tut_status,
  DATE_FORMAT(checking_date, '%Y-%m-%d') AS checking_date,
  system_checking_status, created_at, updated_at`;

// GET /api/weekly
const getAllWeeklyEntries = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT ${SELECT_COLS} FROM weekly_entries ORDER BY week ASC, category ASC, system_name ASC`,
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/weekly
const createWeeklyEntry = async (req, res) => {
  const {
    system_name,
    category,
    week,
    recommendation,
    recom_status,
    recom_implemented,
    activity_status,
    activity_implemented,
    tutorial_vids,
    tut_status,
    checking_date,
    system_checking_status,
  } = req.body;
  if (!system_name || !week)
    return res.status(400).json({ error: "system_name and week are required" });
  try {
    const [result] = await db.query(
      `INSERT INTO weekly_entries
        (system_name, category, week, recommendation, recom_status, recom_implemented,
         activity_status, activity_implemented, tutorial_vids, tut_status, checking_date, system_checking_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        system_name,
        category || "Online System",
        week,
        recommendation || null,
        recom_status || "Not Yet",
        recom_implemented || "Not Yet",
        activity_status || "Not Yet",
        activity_implemented || "Not Yet",
        tutorial_vids || null,
        tut_status || "Not Yet",
        checking_date || null,
        system_checking_status || "Not Yet",
      ],
    );
    const [created] = await db.query(
      `SELECT ${SELECT_COLS} FROM weekly_entries WHERE id = ?`,
      [result.insertId],
    );
    await logActivity(
      req,
      "weekly_created",
      `Added weekly entry for "${system_name}" (${week})`,
      "clipboard-check",
    );
    res.status(201).json(created[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/weekly/:id
const updateWeeklyEntry = async (req, res) => {
  const {
    system_name,
    category,
    week,
    recommendation,
    recom_status,
    recom_implemented,
    activity_status,
    activity_implemented,
    tutorial_vids,
    tut_status,
    checking_date,
    system_checking_status,
  } = req.body;
  try {
    await db.query(
      `UPDATE weekly_entries SET
        system_name=?, category=?, week=?, recommendation=?, recom_status=?, recom_implemented=?,
        activity_status=?, activity_implemented=?, tutorial_vids=?, tut_status=?, checking_date=?, system_checking_status=?
       WHERE id=?`,
      [
        system_name,
        category,
        week,
        recommendation || null,
        recom_status,
        recom_implemented,
        activity_status,
        activity_implemented,
        tutorial_vids || null,
        tut_status,
        checking_date || null,
        system_checking_status,
        req.params.id,
      ],
    );
    const [updated] = await db.query(
      `SELECT ${SELECT_COLS} FROM weekly_entries WHERE id = ?`,
      [req.params.id],
    );
    if (updated.length === 0)
      return res.status(404).json({ error: "Weekly entry not found" });
    await logActivity(
      req,
      "weekly_updated",
      `Updated weekly entry for "${updated[0].system_name}" (${updated[0].week})`,
      "clipboard-check",
    );
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/weekly/:id
const deleteWeeklyEntry = async (req, res) => {
  try {
    const [existing] = await db.query(
      "SELECT system_name, week FROM weekly_entries WHERE id = ?",
      [req.params.id],
    );
    const [result] = await db.query(
      "DELETE FROM weekly_entries WHERE id = ?",
      [req.params.id],
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Weekly entry not found" });
    await logActivity(
      req,
      "weekly_deleted",
      `Deleted weekly entry for "${existing[0]?.system_name}" (${existing[0]?.week})`,
      "trash-2",
    );
    res.json({ message: "Weekly entry deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllWeeklyEntries,
  createWeeklyEntry,
  updateWeeklyEntry,
  deleteWeeklyEntry,
};
