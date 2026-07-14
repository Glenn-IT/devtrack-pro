import { useState, useEffect, useMemo } from "react";
import {
  getWeeklyEntries,
  createWeeklyEntry,
  updateWeeklyEntry,
  deleteWeeklyEntry,
} from "../api/weeklyApi";
import Card from "../components/Card";
import Modal from "../components/Modal";
import {
  Plus,
  Search,
  Loader2,
  Pencil,
  Trash2,
  ClipboardCheck,
  CheckCircle2,
  CircleDashed,
} from "lucide-react";

const STATUS_OPTIONS = ["Done", "In progress", "Not Yet", "N/A"];
const CATEGORY_OPTIONS = [
  "Online System",
  "Standalone System",
  "Android System",
];
const WEEK_OPTIONS = [
  "1st Week Activity",
  "2nd Week Activity",
  "3rd Week Activity",
  "4th Week Activity",
  "5th Week Activity",
  "6th Week Activity",
];

const statusStyle = {
  Done: { background: "#d0f0e8", color: "#0a5940" },
  "In progress": { background: "#dbeafe", color: "#1e3a8a" },
  "Not Yet": { background: "#fef9c3", color: "#854d0e" },
  "N/A": { background: "#f0f4f4", color: "#4c7273" },
};

const StatusBadge = ({ status }) => (
  <span
    className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
    style={statusStyle[status] || statusStyle["N/A"]}
  >
    {status || "N/A"}
  </span>
);

const inputCls =
  "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4c7273]";
const inputStyle = { borderColor: "#d0d6d6", color: "#041421" };

const emptyForm = {
  system_name: "",
  category: "Online System",
  week: "1st Week Activity",
  recommendation: "",
  recom_status: "Not Yet",
  recom_implemented: "Not Yet",
  activity_status: "Not Yet",
  activity_implemented: "Not Yet",
  tutorial_vids: "",
  tut_status: "Not Yet",
  checking_date: "",
  system_checking_status: "Not Yet",
};

function weekSortKey(week) {
  const m = /(\d+)/.exec(week || "");
  return m ? parseInt(m[1], 10) : 999;
}

const FormField = ({ label, children }) => (
  <div>
    <label
      className="block text-sm font-medium mb-1"
      style={{ color: "#041421" }}
    >
      {label}
    </label>
    {children}
  </div>
);

const WeeklyTracker = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeWeek, setActiveWeek] = useState(null);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getWeeklyEntries()
      .then((res) => {
        setEntries(res.data);
        if (res.data.length) {
          const weeks = [...new Set(res.data.map((r) => r.week))].sort(
            (a, b) => weekSortKey(a) - weekSortKey(b),
          );
          setActiveWeek(weeks[0]);
        }
      })
      .catch(() => setError("Could not load weekly tracker."))
      .finally(() => setLoading(false));
  }, []);

  const weeks = useMemo(
    () =>
      [...new Set(entries.map((r) => r.week))].sort(
        (a, b) => weekSortKey(a) - weekSortKey(b),
      ),
    [entries],
  );

  const weekRows = useMemo(
    () => entries.filter((r) => r.week === activeWeek),
    [entries, activeWeek],
  );

  const filteredRows = useMemo(
    () =>
      search
        ? weekRows.filter((r) =>
            r.system_name.toLowerCase().includes(search.toLowerCase()),
          )
        : weekRows,
    [weekRows, search],
  );

  const grouped = useMemo(() => {
    const map = {};
    const order = [];
    filteredRows.forEach((r) => {
      const cat = r.category || "General";
      if (!map[cat]) {
        map[cat] = [];
        order.push(cat);
      }
      map[cat].push(r);
    });
    return { map, order };
  }, [filteredRows]);

  const counts = useMemo(() => {
    let done = 0,
      notYet = 0;
    weekRows.forEach((r) => {
      const s = (r.system_checking_status || "").toLowerCase();
      if (s === "done") done++;
      else if (s === "not yet") notYet++;
    });
    return { done, notYet, total: weekRows.length };
  }, [weekRows]);
  const pct = counts.total ? Math.round((counts.done / counts.total) * 100) : 0;

  const openAdd = () => {
    setEditId(null);
    setForm({ ...emptyForm, week: activeWeek || weeks[0] || emptyForm.week });
    setShowModal(true);
  };

  const openEdit = (r) => {
    setEditId(r.id);
    setForm({
      system_name: r.system_name || "",
      category: r.category || "Online System",
      week: r.week || "1st Week Activity",
      recommendation: r.recommendation || "",
      recom_status: r.recom_status || "Not Yet",
      recom_implemented: r.recom_implemented || "Not Yet",
      activity_status: r.activity_status || "Not Yet",
      activity_implemented: r.activity_implemented || "Not Yet",
      tutorial_vids: r.tutorial_vids || "",
      tut_status: r.tut_status || "Not Yet",
      checking_date: r.checking_date ? String(r.checking_date).slice(0, 10) : "",
      system_checking_status: r.system_checking_status || "Not Yet",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.system_name || !form.week) return;
    setSaving(true);
    try {
      if (editId) {
        const res = await updateWeeklyEntry(editId, form);
        setEntries((prev) =>
          prev.map((r) => (r.id === editId ? res.data : r)),
        );
      } else {
        const res = await createWeeklyEntry(form);
        setEntries((prev) => [...prev, res.data]);
      }
      setActiveWeek(form.week);
      setShowModal(false);
      setForm(emptyForm);
    } catch {
      alert("Failed to save weekly task.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (r) => {
    if (!window.confirm(`Delete "${r.system_name}" from ${r.week}?`)) return;
    try {
      await deleteWeeklyEntry(r.id);
      setEntries((prev) => prev.filter((x) => x.id !== r.id));
    } catch {
      alert("Failed to delete weekly task.");
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "#041421" }}>
            Weekly Tracker
          </h2>
          <p className="text-sm mt-1" style={{ color: "#4c7273" }}>
            Track recommendations, tutorials, and system checking per week
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-white transition-colors shadow-sm"
          style={{ background: "#4c7273" }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#042630")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#4c7273")}
        >
          <Plus className="w-4 h-4" /> Add Weekly Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "#e0efee" }}
          >
            <ClipboardCheck className="w-5 h-5" style={{ color: "#042630" }} />
          </div>
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: "#86b9b0" }}
            >
              Total (week)
            </p>
            <p className="text-2xl font-bold" style={{ color: "#041421" }}>
              {counts.total}
            </p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "#d0f0e8" }}
          >
            <CheckCircle2 className="w-5 h-5" style={{ color: "#0a5940" }} />
          </div>
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: "#86b9b0" }}
            >
              Done
            </p>
            <p className="text-2xl font-bold" style={{ color: "#0a5940" }}>
              {counts.done}
            </p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "#fef9c3" }}
          >
            <CircleDashed className="w-5 h-5" style={{ color: "#854d0e" }} />
          </div>
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: "#86b9b0" }}
            >
              Not Yet
            </p>
            <p className="text-2xl font-bold" style={{ color: "#854d0e" }}>
              {counts.notYet}
            </p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center relative overflow-hidden flex-shrink-0">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(#4c7273 ${pct * 3.6}deg, #e0efee 0deg)`,
              }}
            />
            <div className="w-8 h-8 rounded-full bg-white z-10" />
          </div>
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: "#86b9b0" }}
            >
              Completion
            </p>
            <p className="text-2xl font-bold" style={{ color: "#041421" }}>
              {pct}%
            </p>
          </div>
        </Card>
      </div>

      {/* Week tabs + search */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2 flex-wrap">
          {weeks.length === 0 && (
            <p className="text-sm" style={{ color: "#86b9b0" }}>
              No weeks yet — add your first weekly task.
            </p>
          )}
          {weeks.map((w) => (
            <button
              key={w}
              onClick={() => setActiveWeek(w)}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              style={
                activeWeek === w
                  ? { background: "#042630", color: "#ffffff" }
                  : { background: "#f0f4f4", color: "#4c7273" }
              }
            >
              {w}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search
            className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "#86b9b0" }}
          />
          <input
            type="text"
            placeholder="Search system name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-3 py-2 border rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#4c7273]"
            style={inputStyle}
          />
        </div>
      </div>

      {/* Grouped tables */}
      {grouped.order.length === 0 && (
        <p
          className="text-center py-12 text-sm"
          style={{ color: "#86b9b0" }}
        >
          No tasks for this week.
        </p>
      )}
      {grouped.order.map((cat) => (
        <Card key={cat} className="overflow-hidden">
          <div
            className="flex items-center justify-between px-5 py-3 border-b"
            style={{ borderColor: "#d0d6d6", background: "#f0f4f4" }}
          >
            <h3 className="text-sm font-bold" style={{ color: "#041421" }}>
              {cat}
            </h3>
            <span
              className="text-xs font-semibold"
              style={{ color: "#4c7273" }}
            >
              {grouped.map[cat].length} systems
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ minWidth: "1400px" }}>
              <thead>
                <tr
                  className="text-left text-[11px] uppercase font-bold whitespace-nowrap"
                  style={{ color: "#86b9b0" }}
                >
                  <th className="px-5 py-2.5 max-w-xs">Capstone System</th>
                  <th className="px-5 py-2.5 max-w-xs">Recommendation</th>
                  <th className="px-5 py-2.5">Recom Status</th>
                  <th className="px-5 py-2.5">Recom Implemented</th>
                  <th className="px-5 py-2.5">Activity Status</th>
                  <th className="px-5 py-2.5">Activity Implemented</th>
                  <th className="px-5 py-2.5">Tutorial Vids</th>
                  <th className="px-5 py-2.5">Tut Status</th>
                  <th className="px-5 py-2.5">Checking Date</th>
                  <th className="px-5 py-2.5">Checking Status</th>
                  <th className="px-5 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {grouped.map[cat].map((r) => (
                  <tr
                    key={r.id}
                    className="border-t hover:bg-gray-50 transition-colors whitespace-nowrap"
                    style={{ borderColor: "#f0f4f4" }}
                  >
                    <td
                      className="px-5 py-3 font-semibold whitespace-normal break-words max-w-xs"
                      style={{ color: "#041421" }}
                    >
                      {r.system_name}
                    </td>
                    <td
                      className="px-5 py-3 whitespace-normal break-words max-w-xs"
                      style={{ color: "#4c7273" }}
                    >
                      {r.recommendation || "—"}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={r.recom_status} />
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={r.recom_implemented} />
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={r.activity_status} />
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={r.activity_implemented} />
                    </td>
                    <td className="px-5 py-3" style={{ color: "#4c7273" }}>
                      {r.tutorial_vids || "—"}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={r.tut_status} />
                    </td>
                    <td className="px-5 py-3" style={{ color: "#4c7273" }}>
                      {r.checking_date
                        ? new Date(r.checking_date).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "short", day: "numeric" },
                          )
                        : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={r.system_checking_status} />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(r)}
                          className="p-1.5 rounded-lg"
                          style={{ background: "#fef9c3" }}
                        >
                          <Pencil
                            className="w-3.5 h-3.5"
                            style={{ color: "#854d0e" }}
                          />
                        </button>
                        <button
                          onClick={() => handleDelete(r)}
                          className="p-1.5 rounded-lg"
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
      ))}

      {/* Add / Edit Modal */}
      {showModal && (
        <Modal
          title={editId ? "Edit Weekly Task" : "Add Weekly Task"}
          onClose={() => {
            setShowModal(false);
            setForm(emptyForm);
          }}
        >
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            <FormField label="Capstone System">
              <input
                type="text"
                placeholder="e.g. Online Job Application System"
                value={form.system_name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, system_name: e.target.value }))
                }
                className={inputCls}
                style={inputStyle}
              />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Week">
                <select
                  value={form.week}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, week: e.target.value }))
                  }
                  className={inputCls}
                  style={inputStyle}
                >
                  {[...new Set([...WEEK_OPTIONS, ...weeks])]
                    .sort((a, b) => weekSortKey(a) - weekSortKey(b))
                    .map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                </select>
              </FormField>
              <FormField label="Category">
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                  className={inputCls}
                  style={inputStyle}
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
            <FormField label="Recommendation">
              <input
                type="text"
                placeholder="e.g. Improve dashboard UI"
                value={form.recommendation}
                onChange={(e) =>
                  setForm((f) => ({ ...f, recommendation: e.target.value }))
                }
                className={inputCls}
                style={inputStyle}
              />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Recommendation Status">
                <select
                  value={form.recom_status}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, recom_status: e.target.value }))
                  }
                  className={inputCls}
                  style={inputStyle}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Recom Implemented">
                <select
                  value={form.recom_implemented}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      recom_implemented: e.target.value,
                    }))
                  }
                  className={inputCls}
                  style={inputStyle}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Activity Status">
                <select
                  value={form.activity_status}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, activity_status: e.target.value }))
                  }
                  className={inputCls}
                  style={inputStyle}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Activity Implemented">
                <select
                  value={form.activity_implemented}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      activity_implemented: e.target.value,
                    }))
                  }
                  className={inputCls}
                  style={inputStyle}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Tutorial Status">
                <select
                  value={form.tut_status}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, tut_status: e.target.value }))
                  }
                  className={inputCls}
                  style={inputStyle}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
            <FormField label="Tutorial Vids">
              <input
                type="text"
                placeholder="e.g. 2nd Week tutorial videos"
                value={form.tutorial_vids}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tutorial_vids: e.target.value }))
                }
                className={inputCls}
                style={inputStyle}
              />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Checking Date">
                <input
                  type="date"
                  value={form.checking_date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, checking_date: e.target.value }))
                  }
                  className={inputCls}
                  style={inputStyle}
                />
              </FormField>
              <FormField label="Checking Status">
                <select
                  value={form.system_checking_status}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      system_checking_status: e.target.value,
                    }))
                  }
                  className={inputCls}
                  style={inputStyle}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setShowModal(false);
                  setForm(emptyForm);
                }}
                className="flex-1 py-2.5 border rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
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
                {editId ? "Save Changes" : "Add Task"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
export default WeeklyTracker;
