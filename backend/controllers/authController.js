const crypto = require("crypto");
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendPasswordResetEmail } = require("../config/mailer");

// POST /api/auth/register
const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "All fields are required" });

  try {
    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    if (existing.length > 0)
      return res.status(409).json({ error: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const finalRole = role === "admin" ? "admin" : "user";
    const [result] = await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashed, finalRole],
    );

    const token = jwt.sign(
      { id: result.insertId, name, email, role: finalRole },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    res.status(201).json({
      token,
      user: { id: result.insertId, name, email, role: finalRole },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" });

  try {
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (users.length === 0)
      return res.status(401).json({ error: "Invalid email or password" });

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/auth/me  (get current logged-in user)
const getMe = async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, name, email, role, created_at FROM users WHERE id = ?",
      [req.user.id],
    );
    if (users.length === 0)
      return res.status(404).json({ error: "User not found" });
    res.json(users[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const [users] = await db.query("SELECT id FROM users WHERE email = ?", [email]);

    // Always respond the same way, whether or not the email exists,
    // so requests can't be used to probe which emails are registered.
    if (users.length > 0) {
      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

      await db.query(
        "UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?",
        [token, expires, users[0].id],
      );

      const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
      await sendPasswordResetEmail(email, resetLink);
    }

    res.json({ message: "If that email is registered, a reset link has been sent." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/auth/reset-password/:token
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: "New password is required" });

  try {
    const [users] = await db.query(
      "SELECT id FROM users WHERE reset_token = ? AND reset_token_expires > NOW()",
      [token],
    );
    if (users.length === 0)
      return res.status(400).json({ error: "Reset link is invalid or has expired" });

    const hashed = await bcrypt.hash(password, 10);
    await db.query(
      "UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?",
      [hashed, users[0].id],
    );

    res.json({ message: "Password reset successfully. You can now log in." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login, getMe, forgotPassword, resetPassword };
