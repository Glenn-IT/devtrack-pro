const db = require("../config/db");

// GET /api/activities
const getActivities = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM activities ORDER BY created_at DESC LIMIT 100",
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getActivities };
