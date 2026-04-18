const db = require("../config/db");

// GET /api/payments
const getAllPayments = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, pr.name AS project, pr.client
      FROM payments p
      JOIN projects pr ON p.project_id = pr.id
      ORDER BY p.id DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/payments
const createPayment = async (req, res) => {
  const {
    project_id,
    total,
    paid,
    status,
    paid_date,
    payment_mode,
    notes,
    commission,
  } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO payments (project_id, total, paid, status, paid_date, payment_mode, notes, commission) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        project_id,
        total,
        paid || 0,
        status || "Unpaid",
        paid_date || null,
        payment_mode || null,
        notes || null,
        commission || 0,
      ],
    );
    res.status(201).json({
      id: result.insertId,
      project_id,
      total,
      paid,
      status,
      paid_date,
      payment_mode,
      notes,
      commission,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/payments/:id
const updatePayment = async (req, res) => {
  const { total, paid, status, paid_date, payment_mode, notes, commission } =
    req.body;
  try {
    await db.query(
      "UPDATE payments SET total=?, paid=?, status=?, paid_date=?, payment_mode=?, notes=?, commission=? WHERE id=?",
      [
        total,
        paid,
        status,
        paid_date || null,
        payment_mode || null,
        notes || null,
        commission || 0,
        req.params.id,
      ],
    );
    const [updated] = await db.query("SELECT * FROM payments WHERE id = ?", [
      req.params.id,
    ]);
    if (updated.length === 0)
      return res.status(404).json({ error: "Payment not found" });
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/payments/:id
const deletePayment = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM payments WHERE id = ?", [
      req.params.id,
    ]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Payment not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllPayments,
  createPayment,
  updatePayment,
  deletePayment,
};
