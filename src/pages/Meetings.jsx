import { useState, useEffect } from "react";
import {
  getMeetings,
  createMeeting,
  updateMeeting,
  deleteMeeting,
} from "../api/meetingsApi";
import { getProjects } from "../api/projectsApi";
import Card from "../components/Card";
import Modal from "../components/Modal";
import {
  Plus,
  CalendarDays,
  Clock,
  StickyNote,
  Loader2,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const platformStyle = {
  "Google Meet": { background: "#e0efee", color: "#042630" },
  Zoom: { background: "#ede9fe", color: "#4c1d95" },
  "Microsoft Teams": { background: "#dbeafe", color: "#1e3a8a" },
};

const statusStyle = {
  Scheduled: { background: "#fef9c3", color: "#854d0e" },
  Done: { background: "#d0f0e8", color: "#0a5940" },
  Cancelled: { background: "#fee2e2", color: "#991b1b" },
};

const inputCls =
  "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4c7273]";
const inputStyle = { borderColor: "#d0d6d6", color: "#041421" };
const emptyForm = {
  project_id: "",
  client: "",
  type: "",
  date: "",
  time: "",
  platform: "Google Meet",
  notes: "",
  status: "Scheduled",
};

const MeetingFormFields = ({ form, setForm, projects }) => (
  <>
    <div>
      <label
        className="block text-sm font-medium mb-1"
        style={{ color: "#041421" }}
      >
        Project
      </label>
      <select
        value={form.project_id}
        onChange={(e) => {
          const p = projects.find((p) => p.id === Number(e.target.value));
          setForm((f) => ({
            ...f,
            project_id: e.target.value,
            client: p?.client || "",
          }));
        }}
        className={inputCls}
        style={inputStyle}
      >
        <option value="">-- Select Project --</option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
    </div>
    <div>
      <label
        className="block text-sm font-medium mb-1"
        style={{ color: "#041421" }}
      >
        Meeting Type
      </label>
      <input
        type="text"
        placeholder="e.g. Progress Review"
        value={form.type}
        onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
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
          Date
        </label>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
          className={inputCls}
          style={inputStyle}
        />
      </div>
      <div>
        <label
          className="block text-sm font-medium mb-1"
          style={{ color: "#041421" }}
        >
          Time
        </label>
        <input
          type="time"
          value={form.time}
          onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
          className={inputCls}
          style={inputStyle}
        />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label
          className="block text-sm font-medium mb-1"
          style={{ color: "#041421" }}
        >
          Platform
        </label>
        <select
          value={form.platform}
          onChange={(e) => setForm((f) => ({ ...f, platform: e.target.value }))}
          className={inputCls}
          style={inputStyle}
        >
          <option>Google Meet</option>
          <option>Zoom</option>
          <option>Microsoft Teams</option>
        </select>
      </div>
      <div>
        <label
          className="block text-sm font-medium mb-1"
          style={{ color: "#041421" }}
        >
          Status
        </label>
        <select
          value={form.status}
          onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
          className={inputCls}
          style={inputStyle}
        >
          <option>Scheduled</option>
          <option>Done</option>
          <option>Cancelled</option>
        </select>
      </div>
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
        placeholder="Meeting agenda or notes..."
        value={form.notes}
        onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
        className={inputCls + " resize-none"}
        style={inputStyle}
      />
    </div>
  </>
);

const Meetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    Promise.all([getMeetings(), getProjects()])
      .then(([mRes, pRes]) => {
        setMeetings(mRes.data);
        setProjects(pRes.data);
      })
      .catch(() => setError("Could not load meetings."))
      .finally(() => setLoading(false));
  }, []);

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (m) => {
    setEditId(m.id);
    setForm({
      project_id: m.project_id || "",
      client: m.client || "",
      type: m.type || "",
      date: m.date ? String(m.date).slice(0, 10) : "",
      time: m.time || "",
      platform: m.platform || "Google Meet",
      notes: m.notes || "",
      status: m.status || "Scheduled",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.type || !form.date || !form.time) return;
    setSaving(true);
    try {
      if (editId) {
        const res = await updateMeeting(editId, form);
        setMeetings((prev) =>
          prev.map((m) => (m.id === editId ? res.data : m)),
        );
      } else {
        const res = await createMeeting(form);
        setMeetings((prev) => [...prev, res.data]);
      }
      setShowModal(false);
      setForm(emptyForm);
    } catch {
      alert("Failed to save meeting.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this meeting?")) return;
    try {
      await deleteMeeting(id);
      setMeetings((prev) => prev.filter((m) => m.id !== id));
    } catch {
      alert("Failed to delete meeting.");
    }
  };

  const handleSetStatus = async (m, status) => {
    try {
      const res = await updateMeeting(m.id, { ...m, status });
      setMeetings((prev) => prev.map((x) => (x.id === m.id ? res.data : x)));
    } catch {
      alert("Failed to update status.");
    }
  };

  const filtered =
    filterStatus === "All"
      ? meetings
      : meetings.filter((m) => m.status === filterStatus);

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
            Meetings
          </h2>
          <p className="text-sm mt-1" style={{ color: "#4c7273" }}>
            {meetings.length} meetings scheduled
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-white transition-colors shadow-sm"
          style={{ background: "#4c7273" }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#042630")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#4c7273")}
        >
          <Plus className="w-4 h-4" /> Schedule Meeting
        </button>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 flex-wrap">
        {["All", "Scheduled", "Done", "Cancelled"].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            style={
              filterStatus === s
                ? { background: "#042630", color: "#ffffff" }
                : { background: "#f0f4f4", color: "#4c7273" }
            }
          >
            {s}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.length === 0 && (
          <p
            className="col-span-3 text-center py-12 text-sm"
            style={{ color: "#86b9b0" }}
          >
            No meetings found.
          </p>
        )}
        {filtered.map((m) => (
          <Card
            key={m.id}
            className="p-5 hover:shadow-md transition-all hover:-translate-y-0.5"
            style={{ opacity: m.status === "Cancelled" ? 0.7 : 1 }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0 mr-2">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span
                    className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{ background: "#e0efee", color: "#042630" }}
                  >
                    {m.type}
                  </span>
                  <span
                    className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={statusStyle[m.status] || statusStyle.Scheduled}
                  >
                    {m.status}
                  </span>
                </div>
                <h3
                  className="font-semibold truncate"
                  style={{ color: "#041421" }}
                >
                  {m.project || "General"}
                </h3>
                <p className="text-sm" style={{ color: "#4c7273" }}>
                  {m.client}
                </p>
              </div>
              <span
                className="px-2 py-1 rounded-lg text-xs font-semibold flex-shrink-0"
                style={
                  platformStyle[m.platform] || {
                    background: "#f0f4f4",
                    color: "#4c7273",
                  }
                }
              >
                {m.platform}
              </span>
            </div>
            <div
              className="space-y-2 text-sm mb-3"
              style={{ color: "#4c7273" }}
            >
              <div className="flex items-center gap-2">
                <CalendarDays
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: "#86b9b0" }}
                />
                <span>
                  {m.date
                    ? new Date(m.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "—"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: "#86b9b0" }}
                />
                <span>{m.time}</span>
              </div>
            </div>
            {m.notes && (
              <div
                className="pt-3 border-t mb-3 flex items-start gap-2"
                style={{ borderColor: "#d0d6d6" }}
              >
                <StickyNote
                  className="w-4 h-4 flex-shrink-0 mt-0.5"
                  style={{ color: "#86b9b0" }}
                />
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "#86b9b0" }}
                >
                  {m.notes}
                </p>
              </div>
            )}
            {/* Actions */}
            <div
              className="flex items-center gap-1.5 pt-3 border-t flex-wrap"
              style={{ borderColor: "#d0d6d6" }}
            >
              {m.status !== "Done" && (
                <button
                  onClick={() => handleSetStatus(m, "Done")}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  style={{ background: "#d0f0e8", color: "#0a5940" }}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Done
                </button>
              )}
              {m.status !== "Cancelled" && (
                <button
                  onClick={() => handleSetStatus(m, "Cancelled")}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  style={{ background: "#fee2e2", color: "#991b1b" }}
                >
                  <XCircle className="w-3.5 h-3.5" /> Cancel
                </button>
              )}
              {m.status === "Cancelled" && (
                <button
                  onClick={() => handleSetStatus(m, "Scheduled")}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium"
                  style={{ background: "#fef9c3", color: "#854d0e" }}
                >
                  Reschedule
                </button>
              )}
              <div className="ml-auto flex gap-1.5">
                <button
                  onClick={() => openEdit(m)}
                  className="p-1.5 rounded-lg"
                  style={{ background: "#fef9c3" }}
                >
                  <Pencil
                    className="w-3.5 h-3.5"
                    style={{ color: "#854d0e" }}
                  />
                </button>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="p-1.5 rounded-lg"
                  style={{ background: "#fee2e2" }}
                >
                  <Trash2
                    className="w-3.5 h-3.5"
                    style={{ color: "#991b1b" }}
                  />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <Modal
          title={editId ? "Edit Meeting" : "Schedule Meeting"}
          onClose={() => {
            setShowModal(false);
            setForm(emptyForm);
          }}
        >
          <div className="space-y-4">
            <MeetingFormFields
              form={form}
              setForm={setForm}
              projects={projects}
            />
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
                {editId ? "Save Changes" : "Schedule"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
export default Meetings;
