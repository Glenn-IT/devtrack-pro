import { useState, useEffect } from "react";
import {
  getPayments,
  createPayment,
  updatePayment,
  deletePayment,
} from "../api/paymentsApi";
import { getProjects } from "../api/projectsApi";
import Card from "../components/Card";
import StatusBadge from "../components/StatusBadge";
import Modal from "../components/Modal";
import {
  DollarSign,
  TrendingUp,
  Clock,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Percent,
  AlertCircle,
} from "lucide-react";

const inputCls =
  "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4c7273]";
const inputStyle = { borderColor: "#d0d6d6", color: "#041421" };
const emptyForm = {
  project_id: "",
  total: "",
  paid: "",
  status: "Unpaid",
  paid_date: "",
  payment_mode: "",
  notes: "",
  commission: "",
};

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([getPayments(), getProjects()])
      .then(([pRes, prRes]) => {
        setPayments(pRes.data);
        setProjects(prRes.data);
      })
      .catch(() => setError("Could not load data."))
      .finally(() => setLoading(false));
  }, []);

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditId(p.id);
    setForm({
      project_id: p.project_id,
      total: p.total,
      paid: p.paid,
      status: p.status,
      paid_date: p.paid_date ? String(p.paid_date).slice(0, 10) : "",
      payment_mode: p.payment_mode || "",
      notes: p.notes || "",
      commission: p.commission || "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.project_id || !form.total) return;
    setSaving(true);
    try {
      if (editId) {
        const res = await updatePayment(editId, {
          total: Number(form.total),
          paid: Number(form.paid) || 0,
          status: form.status,
          paid_date: form.paid_date || null,
          payment_mode: form.payment_mode || null,
          notes: form.notes || null,
          commission: Number(form.commission) || 0,
        });
        setPayments((prev) =>
          prev.map((p) => (p.id === editId ? { ...p, ...res.data } : p)),
        );
      } else {
        await createPayment({
          project_id: Number(form.project_id),
          total: Number(form.total),
          paid: Number(form.paid) || 0,
          status: form.status,
          paid_date: form.paid_date || null,
          payment_mode: form.payment_mode || null,
          notes: form.notes || null,
          commission: Number(form.commission) || 0,
        });
        // Re-fetch to get project name + client joined
        const refreshed = await getPayments();
        setPayments(refreshed.data);
      }
      setShowModal(false);
    } catch {
      alert("Failed to save payment.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this payment record?")) return;
    try {
      await deletePayment(id);
      setPayments((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Failed to delete payment.");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2
          className="w-8 h-8 animate-spin"
          style={{ color: "#4c7273" }}
        />
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm" style={{ color: "#991b1b" }}>
          {error}
        </p>
      </div>
    );

  const totalEarned = payments.reduce((s, p) => s + Number(p.paid), 0);
  const totalCommission = payments.reduce(
    (s, p) => s + Number(p.commission || 0),
    0,
  );
  const netCollected = totalEarned - totalCommission;
  const totalPending = payments.reduce(
    (s, p) => s + (Number(p.total) - Number(p.paid)),
    0,
  );
  const totalAll = payments.reduce((s, p) => s + Number(p.total), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "#041421" }}>
            Payments
          </h2>
          <p className="text-sm mt-1" style={{ color: "#4c7273" }}>
            Track project payments and balances
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-white transition-colors shadow-sm"
          style={{ background: "#4c7273" }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#042630")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#4c7273")}
        >
          <Plus className="w-4 h-4" /> Add Payment
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {[
          {
            label: "Total Contract Value",
            value: `₱${totalAll.toLocaleString()}`,
            icon: DollarSign,
            bg: "#e0efee",
            fg: "#042630",
          },
          {
            label: "Total Collected",
            value: `₱${totalEarned.toLocaleString()}`,
            icon: TrendingUp,
            bg: "#d0f0e8",
            fg: "#0a5940",
          },
          {
            label: "Commission Given",
            value: `₱${totalCommission.toLocaleString()}`,
            icon: Percent,
            bg: "#fce7f3",
            fg: "#9d174d",
          },
          {
            label: "Net Collected",
            value: `₱${netCollected.toLocaleString()}`,
            icon: Clock,
            bg: "#fef9c3",
            fg: "#854d0e",
          },
          {
            label: "Remaining Balance",
            value: `₱${totalPending.toLocaleString()}`,
            icon: AlertCircle,
            bg: "#fee2e2",
            fg: "#991b1b",
          },
        ].map((c) => (
          <Card
            key={c.label}
            className="p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: c.bg }}
            >
              <c.icon className="w-6 h-6" style={{ color: c.fg }} />
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: "#4c7273" }}>
                {c.label}
              </p>
              <p className="text-2xl font-bold" style={{ color: "#041421" }}>
                {c.value}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="px-6 py-4 border-b" style={{ borderColor: "#d0d6d6" }}>
          <h3 className="font-semibold" style={{ color: "#041421" }}>
            Payment Records
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                className="text-left border-b"
                style={{ background: "#f0f4f4", borderColor: "#d0d6d6" }}
              >
                {[
                  "Project",
                  "Client",
                  "Total",
                  "Paid",
                  "Commission",
                  "Net",
                  "Mode",
                  "Date Paid",
                  "Notes",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 font-semibold text-xs uppercase tracking-wider"
                    style={{ color: "#4c7273" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 && (
                <tr>
                  <td
                    colSpan={11}
                    className="px-4 py-8 text-center text-sm"
                    style={{ color: "#86b9b0" }}
                  >
                    No payment records yet.
                  </td>
                </tr>
              )}
              {payments.map((p) => (
                <tr
                  key={p.id}
                  className="border-b hover:bg-[#f0f4f4] transition-colors"
                  style={{ borderColor: "#d0d6d6" }}
                >
                  <td
                    className="px-4 py-3.5 font-medium"
                    style={{ color: "#041421" }}
                  >
                    {p.project}
                  </td>
                  <td className="px-4 py-3.5" style={{ color: "#4c7273" }}>
                    {p.client}
                  </td>
                  <td className="px-4 py-3.5" style={{ color: "#041421" }}>
                    ₱{Number(p.total).toLocaleString()}
                  </td>
                  <td
                    className="px-4 py-3.5 font-medium"
                    style={{ color: "#0a5940" }}
                  >
                    ₱{Number(p.paid).toLocaleString()}
                  </td>
                  <td
                    className="px-4 py-3.5 font-medium text-xs"
                    style={{ color: "#9d174d" }}
                  >
                    {Number(p.commission) > 0 ? (
                      <span>−₱{Number(p.commission).toLocaleString()}</span>
                    ) : (
                      <span style={{ color: "#d0d6d6" }}>—</span>
                    )}
                  </td>
                  <td
                    className="px-4 py-3.5 font-medium"
                    style={{ color: "#041421" }}
                  >
                    ₱
                    {(
                      Number(p.paid) - Number(p.commission || 0)
                    ).toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5" style={{ color: "#4c7273" }}>
                    {p.payment_mode ? (
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          background:
                            p.payment_mode === "GCash"
                              ? "#ede9fe"
                              : p.payment_mode === "Cash"
                                ? "#d0f0e8"
                                : "#e0efee",
                          color:
                            p.payment_mode === "GCash"
                              ? "#4c1d95"
                              : p.payment_mode === "Cash"
                                ? "#0a5940"
                                : "#042630",
                        }}
                      >
                        {p.payment_mode}
                      </span>
                    ) : (
                      <span style={{ color: "#d0d6d6" }}>—</span>
                    )}
                  </td>
                  <td
                    className="px-4 py-3.5 text-xs"
                    style={{ color: "#4c7273" }}
                  >
                    {p.paid_date ? (
                      new Date(p.paid_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    ) : (
                      <span style={{ color: "#d0d6d6" }}>—</span>
                    )}
                  </td>
                  <td
                    className="px-4 py-3.5 text-xs max-w-[160px]"
                    style={{ color: "#4c7273" }}
                  >
                    {p.notes ? (
                      <span className="block truncate" title={p.notes}>
                        {p.notes}
                      </span>
                    ) : (
                      <span style={{ color: "#d0d6d6" }}>—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEdit(p)}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ background: "#fef9c3" }}
                      >
                        <Pencil
                          className="w-3.5 h-3.5"
                          style={{ color: "#854d0e" }}
                        />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ background: "#fee2e2" }}
                      >
                        <Trash2
                          className="w-3.5 h-3.5"
                          style={{ color: "#991b1b" }}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {showModal && (
        <Modal
          title={editId ? "Edit Payment" : "Add Payment"}
          onClose={() => setShowModal(false)}
        >
          <div className="space-y-4">
            {!editId && (
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: "#041421" }}
                >
                  Project
                </label>
                <select
                  value={form.project_id}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, project_id: e.target.value }))
                  }
                  className={inputCls}
                  style={inputStyle}
                >
                  <option value="">Select a project...</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.client}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "#041421" }}
              >
                Total Amount (₱)
              </label>
              <input
                type="number"
                placeholder="50000"
                value={form.total}
                onChange={(e) =>
                  setForm((f) => ({ ...f, total: e.target.value }))
                }
                className={inputCls}
                style={inputStyle}
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "#041421" }}
              >
                Amount Paid (₱)
              </label>
              <input
                type="number"
                placeholder="0"
                value={form.paid}
                onChange={(e) =>
                  setForm((f) => ({ ...f, paid: e.target.value }))
                }
                className={inputCls}
                style={inputStyle}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: "#041421" }}
                >
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, status: e.target.value }))
                  }
                  className={inputCls}
                  style={inputStyle}
                >
                  <option>Unpaid</option>
                  <option>Partial</option>
                  <option>Paid</option>
                </select>
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: "#041421" }}
                >
                  Payment Mode
                </label>
                <select
                  value={form.payment_mode}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, payment_mode: e.target.value }))
                  }
                  className={inputCls}
                  style={inputStyle}
                >
                  <option value="">-- Select --</option>
                  <option>Cash</option>
                  <option>GCash</option>
                  <option>Bank Transfer</option>
                  <option>Check</option>
                  <option>PayMaya</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "#041421" }}
              >
                Date Paid
              </label>
              <input
                type="date"
                value={form.paid_date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, paid_date: e.target.value }))
                }
                className={inputCls}
                style={inputStyle}
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "#041421" }}
              >
                Commission / Deduction (₱)
              </label>
              <input
                type="number"
                placeholder="e.g. 500 (deducted from collected)"
                value={form.commission}
                onChange={(e) =>
                  setForm((f) => ({ ...f, commission: e.target.value }))
                }
                className={inputCls}
                style={inputStyle}
              />
              {Number(form.commission) > 0 && Number(form.paid) > 0 && (
                <p className="text-xs mt-1" style={{ color: "#9d174d" }}>
                  Net after commission: ₱
                  {(
                    Number(form.paid) - Number(form.commission)
                  ).toLocaleString()}
                </p>
              )}
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "#041421" }}
              >
                Notes
              </label>
              <textarea
                rows={3}
                placeholder="Optional payment notes..."
                value={form.notes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
                className={inputCls + " resize-none"}
                style={inputStyle}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 border rounded-xl text-sm font-medium"
                style={{ borderColor: "#d0d6d6", color: "#4c7273" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2"
                style={{ background: saving ? "#86b9b0" : "#4c7273" }}
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editId ? "Save Changes" : "Add Payment"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
export default Payments;
