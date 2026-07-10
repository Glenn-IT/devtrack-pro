const express = require("express");
const router = express.Router();
const {
  getAllPayments,
  createPayment,
  updatePayment,
  deletePayment,
} = require("../controllers/paymentsController");
const { protect, requireAdmin } = require("../middleware/authMiddleware");

router.get("/", protect, getAllPayments);
router.post("/", protect, requireAdmin, createPayment);
router.put("/:id", protect, requireAdmin, updatePayment);
router.delete("/:id", protect, requireAdmin, deletePayment);

module.exports = router;
