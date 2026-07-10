const db = require("../config/db");

// Fire-and-forget: a logging failure should never break the actual request.
const logActivity = async (req, type, message, icon = "activity") => {
  try {
    await db.query(
      "INSERT INTO activities (type, message, icon, user_name) VALUES (?, ?, ?, ?)",
      [type, message, icon, req.user?.name || "Unknown"],
    );
  } catch (err) {
    console.error("Failed to log activity:", err.message);
  }
};

module.exports = { logActivity };
