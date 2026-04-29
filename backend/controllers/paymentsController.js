const db = require("../config/db");

const autoStatus = (paid, total) => {
  const p = Number(paid) || 0;
  const t = Number(total) || 0;
  if (t <= 0) return "Unpaid";
  if (p >= t) return "Paid";
  if (p > 0) return "Partial";
  return "Unpaid";
};

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

// Helper: compute cumulative status for a project based on all its payment records
const computeProjectStatus = async (project_id, total, excludeId = null) => {
  let query =
    "SELECT SUM(paid) as total_paid FROM payments WHERE project_id = ?";
  const params = [project_id];
  if (excludeId) {
    query += " AND id != ?";
    params.push(excludeId);
  }
  const [[row]] = await db.query(query, params);
  const totalPaid = Number(row.total_paid) || 0;
  return autoStatus(totalPaid, total);
};

// POST /api/payments
const createPayment = async (req, res) => {
  const {
    project_id,
    total,
    paid,
    paid_date,
    payment_mode,
    notes,
    commission,
  } = req.body;
  try {
    // Insert the new record first with a temp status
    const [result] = await db.query(
      "INSERT INTO payments (project_id, total, paid, status, paid_date, payment_mode, notes, commission) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        project_id,
        total,
        paid || 0,
        "Unpaid",
        paid_date || null,
        payment_mode || null,
        notes || null,
        commission || 0,
      ],
    );
    const newId = result.insertId;
    // Now compute cumulative status including this new record
    const computedStatus = await computeProjectStatus(project_id, total);
    // Update ALL records of this project with the same status
    await db.query("UPDATE payments SET status = ? WHERE project_id = ?", [
      computedStatus,
      project_id,
    ]);
    res.status(201).json({
      id: newId,
      project_id,
      total,
      paid,
      status: computedStatus,
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
  const { total, paid, paid_date, payment_mode, notes, commission } = req.body;
  try {
    // Get project_id for this payment
    const [[existing]] = await db.query(
      "SELECT project_id FROM payments WHERE id = ?",
      [req.params.id],
    );
    if (!existing) return res.status(404).json({ error: "Payment not found" });
    const project_id = existing.project_id;

    await db.query(
      "UPDATE payments SET total=?, paid=?, paid_date=?, payment_mode=?, notes=?, commission=? WHERE id=?",
      [
        total,
        paid,
        paid_date || null,
        payment_mode || null,
        notes || null,
        commission || 0,
        req.params.id,
      ],
    );
    // Recompute cumulative status for the whole project
    const computedStatus = await computeProjectStatus(project_id, total);
    await db.query("UPDATE payments SET status = ? WHERE project_id = ?", [
      computedStatus,
      project_id,
    ]);

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
    const [[existing]] = await db.query(
      "SELECT project_id, total FROM payments WHERE id = ?",
      [req.params.id],
    );
    if (!existing) return res.status(404).json({ error: "Payment not found" });

    const [result] = await db.query("DELETE FROM payments WHERE id = ?", [
      req.params.id,
    ]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Payment not found" });

    // Recompute cumulative status for remaining records of this project
    const computedStatus = await computeProjectStatus(
      existing.project_id,
      existing.total,
    );
    await db.query("UPDATE payments SET status = ? WHERE project_id = ?", [
      computedStatus,
      existing.project_id,
    ]);

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
