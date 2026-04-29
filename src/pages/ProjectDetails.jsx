import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProjectById } from "../api/projectsApi";
import {
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask,
} from "../api/tasksApi";
import {
  getMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone,
} from "../api/milestonesApi";
import {
  getPayments,
  createPayment,
  updatePayment,
  deletePayment,
} from "../api/paymentsApi";
import { syncFromGitHub } from "../api/githubSyncApi";
import Card from "../components/Card";
import StatusBadge from "../components/StatusBadge";
import Modal from "../components/Modal";
import {
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  Circle,
  CalendarDays,
  Loader2,
  Plus,
  Trash2,
  Pencil,
  DollarSign,
  RefreshCw,
} from "lucide-react";

const inputCls =
  "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4c7273]";
const inputStyle = { borderColor: "#d0d6d6", color: "#041421" };

const getAutoStatus = (paid, total) => {
  const p = Number(paid) || 0;
  const t = Number(total) || 0;
  if (t <= 0) return "Unpaid";
  if (p >= t) return "Paid";
  if (p > 0) return "Partial";
  return "Unpaid";
};

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tasks state
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [addingTask, setAddingTask] = useState(false);

  // Milestones state
  const [milestones, setMilestones] = useState([]);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [milestoneForm, setMilestoneForm] = useState({
    title: "",
    date: "",
    done: false,
  });
  const [editingMilestoneId, setEditingMilestoneId] = useState(null);
  const [savingMilestone, setSavingMilestone] = useState(false);

  // Payments state
  const [payments, setPayments] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    total: "",
    paid: "",
    status: "Unpaid",
    paid_date: "",
    payment_mode: "",
    notes: "",
    commission: "",
  });
  const [editingPaymentId, setEditingPaymentId] = useState(null);
  const [savingPayment, setSavingPayment] = useState(false);

  // GitHub sync state
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);

  useEffect(() => {
    const pId = Number(id);
    Promise.all([
      getProjectById(pId),
      getTasksByProject(pId),
      getMilestones(pId),
      getPayments(),
    ])
      .then(([projRes, tasksRes, milestonesRes, paymentsRes]) => {
        setProject(projRes.data);
        setTasks(tasksRes.data);
        setMilestones(milestonesRes.data);
        setPayments(paymentsRes.data.filter((p) => p.project_id === pId));
      })
      .catch(() => setError("Failed to load project data."))
      .finally(() => setLoading(false));
  }, [id]);

  // ─── TASKS ──────────────────────────────────────────────
  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    setAddingTask(true);
    try {
      const res = await createTask({
        project_id: Number(id),
        title: newTask.trim(),
      });
      setTasks((prev) => [...prev, res.data]);
      setNewTask("");
      // recalc progress from tasks
      const allTasks = [...tasks, res.data];
      const done = allTasks.filter((t) => t.done).length;
      setProject((p) => ({
        ...p,
        progress: allTasks.length
          ? Math.round((done / allTasks.length) * 100)
          : 0,
      }));
    } catch {
      alert("Failed to add task.");
    } finally {
      setAddingTask(false);
    }
  };

  const handleToggleTask = async (task) => {
    try {
      const res = await updateTask(task.id, {
        title: task.title,
        done: !task.done,
      });
      const updatedTasks = tasks.map((t) => (t.id === task.id ? res.data : t));
      setTasks(updatedTasks);
      if (res.data.progress !== undefined) {
        setProject((p) => ({ ...p, progress: res.data.progress }));
      }
    } catch {
      alert("Failed to update task.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      const res = await deleteTask(taskId);
      const updatedTasks = tasks.filter((t) => t.id !== taskId);
      setTasks(updatedTasks);
      if (res.data.progress !== undefined) {
        setProject((p) => ({ ...p, progress: res.data.progress }));
      }
    } catch {
      alert("Failed to delete task.");
    }
  };

  // ─── MILESTONES ─────────────────────────────────────────
  const openAddMilestone = () => {
    setEditingMilestoneId(null);
    setMilestoneForm({ title: "", date: "", done: false });
    setShowMilestoneModal(true);
  };

  const openEditMilestone = (m) => {
    setEditingMilestoneId(m.id);
    setMilestoneForm({
      title: m.title,
      date: m.date ? String(m.date).slice(0, 10) : "",
      done: !!m.done,
    });
    setShowMilestoneModal(true);
  };

  const handleSaveMilestone = async () => {
    if (!milestoneForm.title.trim()) return;
    setSavingMilestone(true);
    try {
      if (editingMilestoneId) {
        const res = await updateMilestone(editingMilestoneId, {
          ...milestoneForm,
          project_id: Number(id),
        });
        setMilestones((prev) =>
          prev.map((m) => (m.id === editingMilestoneId ? res.data : m)),
        );
      } else {
        const res = await createMilestone({
          ...milestoneForm,
          project_id: Number(id),
        });
        setMilestones((prev) => [...prev, res.data]);
      }
      setShowMilestoneModal(false);
    } catch {
      alert("Failed to save milestone.");
    } finally {
      setSavingMilestone(false);
    }
  };

  const handleDeleteMilestone = async (mId) => {
    if (!window.confirm("Delete this milestone?")) return;
    try {
      await deleteMilestone(mId);
      setMilestones((prev) => prev.filter((m) => m.id !== mId));
    } catch {
      alert("Failed to delete milestone.");
    }
  };

  // ─── GITHUB SYNC ────────────────────────────────────────
  const handleGitHubSync = async () => {
    setSyncing(true);
    setSyncError(null);
    try {
      const res = await syncFromGitHub(id);
      const { progress, status, last_synced_at, last_sync_note } = res.data;
      setProject((p) => ({
        ...p,
        progress,
        status,
        last_synced_at,
        last_sync_note,
      }));
    } catch (err) {
      const msg = err.response?.data?.error || "Sync failed. Please try again.";
      setSyncError(msg);
    } finally {
      setSyncing(false);
    }
  };

  // ─── PAYMENTS ───────────────────────────────────────────
  const openAddPayment = () => {
    const projectTotal = Number(project?.budget) || 0;
    const alreadyPaid = payments.reduce((s, p) => s + Number(p.paid), 0);
    const remaining = Math.max(projectTotal - alreadyPaid, 0);
    setEditingPaymentId(null);
    setPaymentForm({
      total: projectTotal > 0 ? String(projectTotal) : "",
      paid: "",
      status: "Unpaid",
      paid_date: "",
      payment_mode: "",
      notes: "",
      commission: "",
      _alreadyPaid: alreadyPaid,
      _remaining: remaining,
    });
    setShowPaymentModal(true);
  };

  const openEditPayment = (p) => {
    setEditingPaymentId(p.id);
    setPaymentForm({
      total: p.total,
      paid: p.paid,
      status: p.status,
      paid_date: p.paid_date ? String(p.paid_date).slice(0, 10) : "",
      payment_mode: p.payment_mode || "",
      notes: p.notes || "",
      commission: p.commission || "",
    });
    setShowPaymentModal(true);
  };

  const handleSavePayment = async () => {
    if (!paymentForm.total) return;
    setSavingPayment(true);

    const newAmount = Number(paymentForm.paid) || 0;
    let cumulativePaid;
    if (editingPaymentId) {
      const otherPaid = payments
        .filter((p) => p.id !== editingPaymentId)
        .reduce((s, p) => s + Number(p.paid), 0);
      cumulativePaid = otherPaid + newAmount;
    } else {
      cumulativePaid = Number(paymentForm._alreadyPaid || 0) + newAmount;
    }
    const autoStatus = getAutoStatus(cumulativePaid, paymentForm.total);

    try {
      if (editingPaymentId) {
        await updatePayment(editingPaymentId, {
          total: Number(paymentForm.total),
          paid: newAmount,
          status: autoStatus,
          paid_date: paymentForm.paid_date || null,
          payment_mode: paymentForm.payment_mode || null,
          notes: paymentForm.notes || null,
          commission: Number(paymentForm.commission) || 0,
        });
      } else {
        await createPayment({
          project_id: Number(id),
          total: Number(paymentForm.total),
          paid: newAmount,
          status: autoStatus,
          paid_date: paymentForm.paid_date || null,
          payment_mode: paymentForm.payment_mode || null,
          notes: paymentForm.notes || null,
          commission: Number(paymentForm.commission) || 0,
        });
      }
      // Always re-fetch so all records reflect updated cumulative status
      const refreshed = await getPayments();
      const pId = Number(id);
      setPayments(refreshed.data.filter((p) => p.project_id === pId));
      setShowPaymentModal(false);
    } catch {
      alert("Failed to save payment.");
    } finally {
      setSavingPayment(false);
    }
  };

  const handleDeletePayment = async (pId) => {
    if (!window.confirm("Delete this payment record?")) return;
    try {
      await deletePayment(pId);
      const refreshed = await getPayments();
      const projId = Number(id);
      setPayments(refreshed.data.filter((p) => p.project_id === projId));
    } catch {
      alert("Failed to delete payment.");
    }
  };

  // ─── RENDER ─────────────────────────────────────────────
  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2
          className="w-8 h-8 animate-spin"
          style={{ color: "#4c7273" }}
        />
      </div>
    );
  if (error || !project)
    return (
      <div className="text-center py-20">
        <p style={{ color: "#4c7273" }}>{error || "Project not found."}</p>
        <button
          onClick={() => navigate("/projects")}
          className="mt-4 text-sm hover:underline"
          style={{ color: "#4c7273" }}
        >
          Back to Projects
        </button>
      </div>
    );

  const doneTasks = tasks.filter((t) => t.done).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/projects")}
          className="p-2 rounded-lg hover:bg-[#e0efee] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" style={{ color: "#4c7273" }} />
        </button>
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "#041421" }}>
            {project.name}
          </h2>
          <p className="text-sm" style={{ color: "#4c7273" }}>
            {project.client}
          </p>
        </div>
        <div className="ml-auto">
          <StatusBadge status={project.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Info */}
          <Card className="p-6">
            <h3 className="font-semibold mb-3" style={{ color: "#041421" }}>
              Project Information
            </h3>
            <p
              className="text-sm leading-relaxed mb-4"
              style={{ color: "#4c7273" }}
            >
              {project.description}
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                [
                  "Start Date",
                  project.start_date
                    ? new Date(project.start_date).toLocaleDateString()
                    : "—",
                  "#041421",
                ],
                [
                  "End Date",
                  project.end_date
                    ? new Date(project.end_date).toLocaleDateString()
                    : "—",
                  "#041421",
                ],
                [
                  "Budget",
                  `₱${Number(project.budget).toLocaleString()}`,
                  "#041421",
                ],
              ].map(([label, val, clr]) => (
                <div key={label}>
                  <span style={{ color: "#86b9b0" }}>{label}</span>
                  <p className="font-medium mt-0.5" style={{ color: clr }}>
                    {val}
                  </p>
                </div>
              ))}
            </div>
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 mt-4 text-sm hover:underline"
              style={{ color: "#4c7273" }}
            >
              <ExternalLink className="w-4 h-4" /> {project.repo}
            </a>
          </Card>

          {/* Progress */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: "#041421" }}>
                Overall Progress
              </h3>
              <div className="flex items-center gap-3">
                <span
                  className="text-2xl font-bold"
                  style={{ color: "#4c7273" }}
                >
                  {project.progress}%
                </span>
                {project.repo && (
                  <button
                    onClick={handleGitHubSync}
                    disabled={syncing}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-colors"
                    style={{ background: syncing ? "#86b9b0" : "#042630" }}
                    title="Sync progress from GitHub Progress.md"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`}
                    />
                    {syncing ? "Syncing..." : "Sync GitHub"}
                  </button>
                )}
              </div>
            </div>
            <div className="rounded-full h-4" style={{ background: "#d0d6d6" }}>
              <div
                className="h-4 rounded-full transition-all"
                style={{
                  width: `${project.progress}%`,
                  background: project.progress === 100 ? "#22c55e" : "#4c7273",
                }}
              />
            </div>
            {/* Sync status messages */}
            {syncError && (
              <p
                className="text-xs mt-2 font-medium"
                style={{ color: "#991b1b" }}
              >
                ⚠️ {syncError}
              </p>
            )}
            {!syncError && project.last_synced_at && (
              <div className="mt-2 space-y-0.5">
                <p className="text-xs" style={{ color: "#86b9b0" }}>
                  🔄 Last synced:{" "}
                  {new Date(project.last_synced_at).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                {project.last_sync_note && (
                  <p className="text-xs italic" style={{ color: "#4c7273" }}>
                    📝 {project.last_sync_note}
                  </p>
                )}
              </div>
            )}
          </Card>

          {/* Tasks */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: "#041421" }}>
                Tasks
              </h3>
              <span className="text-sm" style={{ color: "#86b9b0" }}>
                {doneTasks}/{tasks.length} completed
              </span>
            </div>
            {/* Add task input */}
            <div className="flex gap-2 mb-4">
              <input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
                placeholder="Add a new task..."
                className={inputCls + " flex-1"}
                style={inputStyle}
              />
              <button
                onClick={handleAddTask}
                disabled={addingTask || !newTask.trim()}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white flex items-center gap-1.5 transition-colors"
                style={{ background: !newTask.trim() ? "#86b9b0" : "#4c7273" }}
              >
                {addingTask ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                Add
              </button>
            </div>
            {/* Task list */}
            <div className="space-y-2">
              {tasks.length === 0 && (
                <p
                  className="text-sm text-center py-4"
                  style={{ color: "#86b9b0" }}
                >
                  No tasks yet. Add one above.
                </p>
              )}
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-xl group"
                  style={{ background: task.done ? "#e0efee" : "#f0f4f4" }}
                >
                  <button
                    onClick={() => handleToggleTask(task)}
                    className="flex-shrink-0"
                  >
                    {task.done ? (
                      <CheckCircle2
                        className="w-5 h-5"
                        style={{ color: "#4c7273" }}
                      />
                    ) : (
                      <Circle
                        className="w-5 h-5"
                        style={{ color: "#d0d6d6" }}
                      />
                    )}
                  </button>
                  <span
                    className="text-sm flex-1"
                    style={{
                      color: task.done ? "#86b9b0" : "#041421",
                      textDecoration: task.done ? "line-through" : "none",
                    }}
                  >
                    {task.title}
                  </span>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" style={{ color: "#991b1b" }} />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* Payments */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3
                className="font-semibold flex items-center gap-2"
                style={{ color: "#041421" }}
              >
                <DollarSign className="w-4 h-4" style={{ color: "#4c7273" }} />{" "}
                Payments
              </h3>
              <button
                onClick={openAddPayment}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                style={{ background: "#4c7273" }}
              >
                <Plus className="w-3.5 h-3.5" /> Add Payment
              </button>
            </div>
            {payments.length === 0 ? (
              <p
                className="text-sm text-center py-4"
                style={{ color: "#86b9b0" }}
              >
                No payment records yet.
              </p>
            ) : (
              <div className="space-y-3">
                {(() => {
                  const projectTotal = Number(project?.budget) || 0;
                  const totalPaidSoFar = payments.reduce(
                    (s, p) => s + Number(p.paid),
                    0,
                  );
                  return payments.map((p, idx) => {
                    // Cumulative paid up to and including this record (by insertion order)
                    const paidUpToHere = payments
                      .slice(0, idx + 1)
                      .reduce((s, r) => s + Number(r.paid), 0);
                    const remainingAfter = Math.max(
                      projectTotal - paidUpToHere,
                      0,
                    );
                    return (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-3 rounded-xl"
                        style={{ background: "#f0f4f4" }}
                      >
                        <div>
                          <p
                            className="text-sm font-medium"
                            style={{ color: "#041421" }}
                          >
                            Total:{" "}
                            <span style={{ color: "#041421" }}>
                              ₱{Number(projectTotal).toLocaleString()}
                            </span>
                            {" · "}Paid:{" "}
                            <span style={{ color: "#0a5940" }}>
                              ₱{Number(p.paid).toLocaleString()}
                            </span>
                            {" · "}Remaining:{" "}
                            <span style={{ color: "#991b1b" }}>
                              ₱{remainingAfter.toLocaleString()}
                            </span>
                          </p>
                          <p
                            className="text-xs mt-0.5 flex flex-wrap gap-x-3"
                            style={{ color: "#86b9b0" }}
                          >
                            <span>Status: {p.status}</span>
                            {p.payment_mode && (
                              <span
                                className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium"
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
                            )}
                            {p.paid_date && (
                              <span>
                                📅{" "}
                                {new Date(p.paid_date).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  },
                                )}
                              </span>
                            )}
                          </p>
                          {p.notes && (
                            <p
                              className="text-xs mt-1 italic"
                              style={{ color: "#86b9b0" }}
                            >
                              {p.notes}
                            </p>
                          )}
                          {Number(p.commission) > 0 && (
                            <p
                              className="text-xs mt-1 font-medium"
                              style={{ color: "#9d174d" }}
                            >
                              Commission: −₱
                              {Number(p.commission).toLocaleString()} → Net: ₱
                              {(
                                Number(p.paid) - Number(p.commission)
                              ).toLocaleString()}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => openEditPayment(p)}
                            className="p-1.5 rounded-lg"
                            style={{ background: "#fef9c3" }}
                          >
                            <Pencil
                              className="w-3.5 h-3.5"
                              style={{ color: "#854d0e" }}
                            />
                          </button>
                          <button
                            onClick={() => handleDeletePayment(p.id)}
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
                    );
                  });
                })()}
              </div>
            )}
          </Card>
        </div>

        {/* Right column — Milestones */}
        <div>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h3
                className="font-semibold flex items-center gap-2"
                style={{ color: "#041421" }}
              >
                <CalendarDays
                  className="w-4 h-4"
                  style={{ color: "#4c7273" }}
                />{" "}
                Milestones
              </h3>
              <button
                onClick={openAddMilestone}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-white"
                style={{ background: "#4c7273" }}
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            {milestones.length === 0 ? (
              <p
                className="text-sm text-center py-4"
                style={{ color: "#86b9b0" }}
              >
                No milestones yet.
              </p>
            ) : (
              <div className="relative">
                <div
                  className="absolute left-3.5 top-0 bottom-0 w-0.5"
                  style={{ background: "#d0d6d6" }}
                />
                <div className="space-y-5">
                  {milestones.map((m) => (
                    <div
                      key={m.id}
                      className="relative flex items-start gap-4 pl-8 group"
                    >
                      <div
                        className="absolute left-0 w-7 h-7 rounded-full flex items-center justify-center border-2"
                        style={
                          m.done
                            ? { background: "#4c7273", borderColor: "#4c7273" }
                            : { background: "#ffffff", borderColor: "#d0d6d6" }
                        }
                      >
                        {m.done && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-medium"
                          style={{ color: m.done ? "#041421" : "#86b9b0" }}
                        >
                          {m.title}
                        </p>
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: "#86b9b0" }}
                        >
                          {m.date
                            ? new Date(m.date).toLocaleDateString()
                            : "No date"}
                        </p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditMilestone(m)}
                          className="p-1 rounded"
                          style={{ background: "#fef9c3" }}
                        >
                          <Pencil
                            className="w-3 h-3"
                            style={{ color: "#854d0e" }}
                          />
                        </button>
                        <button
                          onClick={() => handleDeleteMilestone(m.id)}
                          className="p-1 rounded"
                          style={{ background: "#fee2e2" }}
                        >
                          <Trash2
                            className="w-3 h-3"
                            style={{ color: "#991b1b" }}
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Milestone Modal */}
      {showMilestoneModal && (
        <Modal
          title={editingMilestoneId ? "Edit Milestone" : "Add Milestone"}
          onClose={() => setShowMilestoneModal(false)}
        >
          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "#041421" }}
              >
                Title
              </label>
              <input
                value={milestoneForm.title}
                onChange={(e) =>
                  setMilestoneForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="e.g. Design Approved"
                className={inputCls}
                style={inputStyle}
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "#041421" }}
              >
                Date
              </label>
              <input
                type="date"
                value={milestoneForm.date}
                onChange={(e) =>
                  setMilestoneForm((f) => ({ ...f, date: e.target.value }))
                }
                className={inputCls}
                style={inputStyle}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="m-done"
                checked={!!milestoneForm.done}
                onChange={(e) =>
                  setMilestoneForm((f) => ({ ...f, done: e.target.checked }))
                }
                className="w-4 h-4"
              />
              <label
                htmlFor="m-done"
                className="text-sm"
                style={{ color: "#041421" }}
              >
                Mark as completed
              </label>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowMilestoneModal(false)}
                className="flex-1 py-2.5 border rounded-xl text-sm font-medium"
                style={{ borderColor: "#d0d6d6", color: "#4c7273" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMilestone}
                disabled={savingMilestone}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2"
                style={{ background: savingMilestone ? "#86b9b0" : "#4c7273" }}
              >
                {savingMilestone && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {editingMilestoneId ? "Save Changes" : "Add Milestone"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <Modal
          title={editingPaymentId ? "Edit Payment" : "Add Payment"}
          onClose={() => setShowPaymentModal(false)}
        >
          <div className="space-y-4">
            {/* Info box — only in Add mode */}
            {!editingPaymentId && (
              <div
                className="p-3 rounded-lg text-sm space-y-1"
                style={{ background: "#e0efee" }}
              >
                <div className="flex justify-between">
                  <span style={{ color: "#042630" }}>Total Contract:</span>
                  <span className="font-semibold" style={{ color: "#042630" }}>
                    ₱{Number(paymentForm.total || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#042630" }}>Already Paid:</span>
                  <span className="font-semibold" style={{ color: "#0a5940" }}>
                    ₱{Number(paymentForm._alreadyPaid || 0).toLocaleString()}
                  </span>
                </div>
                <div
                  className="flex justify-between border-t pt-1"
                  style={{ borderColor: "#86b9b0" }}
                >
                  <span className="font-medium" style={{ color: "#991b1b" }}>
                    Remaining Balance:
                  </span>
                  <span className="font-bold" style={{ color: "#991b1b" }}>
                    ₱{Number(paymentForm._remaining || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
            {editingPaymentId && (
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: "#041421" }}
                >
                  Total Amount (₱)
                </label>
                <input
                  type="number"
                  value={paymentForm.total}
                  onChange={(e) =>
                    setPaymentForm((f) => ({ ...f, total: e.target.value }))
                  }
                  placeholder="e.g. 50000"
                  className={inputCls}
                  style={inputStyle}
                />
              </div>
            )}
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: "#041421" }}
              >
                {editingPaymentId
                  ? "Amount Paid (₱)"
                  : "New Payment Amount (₱)"}
              </label>
              <input
                type="number"
                value={paymentForm.paid}
                onChange={(e) =>
                  setPaymentForm((f) => ({ ...f, paid: e.target.value }))
                }
                placeholder={
                  !editingPaymentId && Number(paymentForm._remaining) > 0
                    ? `Max: ₱${Number(paymentForm._remaining).toLocaleString()}`
                    : "e.g. 7500"
                }
                className={inputCls}
                style={inputStyle}
              />
              {Number(paymentForm.paid) > 0 &&
                Number(paymentForm.total) > 0 && (
                  <p
                    className="text-xs mt-1 font-medium"
                    style={{
                      color:
                        getAutoStatus(
                          editingPaymentId
                            ? paymentForm.paid
                            : Number(paymentForm._alreadyPaid || 0) +
                                Number(paymentForm.paid),
                          paymentForm.total,
                        ) === "Paid"
                          ? "#0a5940"
                          : "#854d0e",
                    }}
                  >
                    Project status will be:{" "}
                    <strong>
                      {getAutoStatus(
                        editingPaymentId
                          ? paymentForm.paid
                          : Number(paymentForm._alreadyPaid || 0) +
                              Number(paymentForm.paid),
                        paymentForm.total,
                      )}
                    </strong>
                    {!editingPaymentId && (
                      <>
                        {" "}
                        — Remaining after: ₱
                        {Math.max(
                          Number(paymentForm._remaining || 0) -
                            Number(paymentForm.paid),
                          0,
                        ).toLocaleString()}
                      </>
                    )}
                  </p>
                )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: "#041421" }}
                >
                  Status
                </label>
                <div
                  className="px-3 py-2 rounded-lg text-sm font-semibold"
                  style={{
                    background:
                      getAutoStatus(
                        editingPaymentId
                          ? paymentForm.paid
                          : Number(paymentForm._alreadyPaid || 0) +
                              Number(paymentForm.paid || 0),
                        paymentForm.total,
                      ) === "Paid"
                        ? "#d0f0e8"
                        : getAutoStatus(
                              editingPaymentId
                                ? paymentForm.paid
                                : Number(paymentForm._alreadyPaid || 0) +
                                    Number(paymentForm.paid || 0),
                              paymentForm.total,
                            ) === "Partial"
                          ? "#fef9c3"
                          : "#fee2e2",
                    color:
                      getAutoStatus(
                        editingPaymentId
                          ? paymentForm.paid
                          : Number(paymentForm._alreadyPaid || 0) +
                              Number(paymentForm.paid || 0),
                        paymentForm.total,
                      ) === "Paid"
                        ? "#0a5940"
                        : getAutoStatus(
                              editingPaymentId
                                ? paymentForm.paid
                                : Number(paymentForm._alreadyPaid || 0) +
                                    Number(paymentForm.paid || 0),
                              paymentForm.total,
                            ) === "Partial"
                          ? "#854d0e"
                          : "#991b1b",
                  }}
                >
                  {getAutoStatus(
                    editingPaymentId
                      ? paymentForm.paid
                      : Number(paymentForm._alreadyPaid || 0) +
                          Number(paymentForm.paid || 0),
                    paymentForm.total,
                  )}{" "}
                  (auto)
                </div>
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: "#041421" }}
                >
                  Payment Mode
                </label>
                <select
                  value={paymentForm.payment_mode}
                  onChange={(e) =>
                    setPaymentForm((f) => ({
                      ...f,
                      payment_mode: e.target.value,
                    }))
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
                value={paymentForm.paid_date}
                onChange={(e) =>
                  setPaymentForm((f) => ({ ...f, paid_date: e.target.value }))
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
                value={paymentForm.commission}
                onChange={(e) =>
                  setPaymentForm((f) => ({ ...f, commission: e.target.value }))
                }
                className={inputCls}
                style={inputStyle}
              />
              {Number(paymentForm.commission) > 0 &&
                Number(paymentForm.paid) > 0 && (
                  <p className="text-xs mt-1" style={{ color: "#9d174d" }}>
                    Net after commission: ₱
                    {(
                      Number(paymentForm.paid) - Number(paymentForm.commission)
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
                value={paymentForm.notes}
                onChange={(e) =>
                  setPaymentForm((f) => ({ ...f, notes: e.target.value }))
                }
                className={inputCls + " resize-none"}
                style={inputStyle}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 py-2.5 border rounded-xl text-sm font-medium"
                style={{ borderColor: "#d0d6d6", color: "#4c7273" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSavePayment}
                disabled={savingPayment}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2"
                style={{ background: savingPayment ? "#86b9b0" : "#4c7273" }}
              >
                {savingPayment && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingPaymentId ? "Save Changes" : "Add Payment"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
export default ProjectDetails;
