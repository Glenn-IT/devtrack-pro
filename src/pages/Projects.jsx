import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../api/projectsApi";
import Card from "../components/Card";
import StatusBadge from "../components/StatusBadge";
import Modal from "../components/Modal";
import {
  Plus,
  ExternalLink,
  Eye,
  Search,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react";

const inputCls =
  "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4c7273]";
const inputStyle = { borderColor: "#d0d6d6", color: "#041421" };
const emptyForm = {
  name: "",
  client: "",
  repo: "",
  status: "To Do",
  description: "",
  budget: "",
  start_date: "",
  end_date: "",
};

const ProjectFormFields = ({ form, setForm }) => (
  <>
    {[
      ["Project Name", "name", "text", "e.g. My Web App"],
      ["Client Name", "client", "text", "e.g. ABC Corp"],
      ["GitHub Repo URL", "repo", "url", "https://github.com/..."],
    ].map(([label, field, type, placeholder]) => (
      <div key={field}>
        <label
          className="block text-sm font-medium mb-1"
          style={{ color: "#041421" }}
        >
          {label}
        </label>
        <input
          type={type}
          placeholder={placeholder}
          value={form[field]}
          onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
          className={inputCls}
          style={inputStyle}
        />
      </div>
    ))}
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label
          className="block text-sm font-medium mb-1"
          style={{ color: "#041421" }}
        >
          Budget (₱)
        </label>
        <input
          type="number"
          placeholder="50000"
          value={form.budget}
          onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))}
          className={inputCls}
          style={inputStyle}
        />
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
          <option>To Do</option>
          <option>Ongoing</option>
          <option>Completed</option>
        </select>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label
          className="block text-sm font-medium mb-1"
          style={{ color: "#041421" }}
        >
          Start Date
        </label>
        <input
          type="date"
          value={form.start_date}
          onChange={(e) =>
            setForm((f) => ({ ...f, start_date: e.target.value }))
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
          End Date
        </label>
        <input
          type="date"
          value={form.end_date}
          onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))}
          className={inputCls}
          style={inputStyle}
        />
      </div>
    </div>
    <div>
      <label
        className="block text-sm font-medium mb-1"
        style={{ color: "#041421" }}
      >
        Description
      </label>
      <textarea
        rows={3}
        placeholder="Brief project description..."
        value={form.description}
        onChange={(e) =>
          setForm((f) => ({ ...f, description: e.target.value }))
        }
        className={inputCls + " resize-none"}
        style={inputStyle}
      />
    </div>
  </>
);

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortDate, setSortDate] = useState("none"); // "asc" | "desc" | "none"

  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [editSaving, setEditSaving] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getProjects()
      .then((res) => setProjects(res.data))
      .catch(() => setError("Could not load projects."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = projects
    .filter(
      (p) =>
        (filter === "All" || p.status === filter) &&
        (p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.client.toLowerCase().includes(search.toLowerCase())),
    )
    .sort((a, b) => {
      if (sortDate === "asc")
        return new Date(a.start_date) - new Date(b.start_date);
      if (sortDate === "desc")
        return new Date(b.start_date) - new Date(a.start_date);
      return 0;
    });

  const handleAdd = async () => {
    if (!addForm.name || !addForm.client) return;
    setSaving(true);
    try {
      const res = await createProject({
        ...addForm,
        budget: Number(addForm.budget) || 0,
      });
      setProjects((prev) => [res.data, ...prev]);
      setShowAdd(false);
      setAddForm(emptyForm);
    } catch {
      alert("Failed to create project.");
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (p) => {
    setEditId(p.id);
    setEditForm({
      name: p.name || "",
      client: p.client || "",
      repo: p.repo || "",
      status: p.status || "To Do",
      description: p.description || "",
      budget: p.budget || "",
      start_date: p.start_date ? String(p.start_date).slice(0, 10) : "",
      end_date: p.end_date ? String(p.end_date).slice(0, 10) : "",
    });
    setShowEdit(true);
  };

  const handleEdit = async () => {
    if (!editForm.name || !editForm.client) return;
    setEditSaving(true);
    try {
      const res = await updateProject(editId, {
        ...editForm,
        budget: Number(editForm.budget) || 0,
      });
      setProjects((prev) =>
        prev.map((p) => (p.id === editId ? { ...p, ...res.data } : p)),
      );
      setShowEdit(false);
    } catch {
      alert("Failed to update project.");
    } finally {
      setEditSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Failed to delete project.");
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "#041421" }}>
            Projects
          </h2>
          <p className="text-sm mt-1" style={{ color: "#4c7273" }}>
            {projects.length} total projects
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-white transition-colors shadow-sm"
          style={{ background: "#4c7273" }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#042630")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#4c7273")}
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      <Card className="p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "#86b9b0" }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects or clients..."
            className={inputCls + " pl-9"}
            style={inputStyle}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", "Ongoing", "Completed", "To Do"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              style={
                filter === s
                  ? { background: "#042630", color: "#ffffff" }
                  : { background: "#f0f4f4", color: "#4c7273" }
              }
            >
              {s}
            </button>
          ))}
          <button
            onClick={() =>
              setSortDate((prev) =>
                prev === "asc" ? "desc" : prev === "desc" ? "none" : "asc",
              )
            }
            className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            style={
              sortDate !== "none"
                ? { background: "#4c7273", color: "#ffffff" }
                : { background: "#f0f4f4", color: "#4c7273" }
            }
          >
            Start Date{" "}
            {sortDate === "asc" ? "↑" : sortDate === "desc" ? "↓" : "↕"}
          </button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.length === 0 && (
          <p
            className="col-span-3 text-center py-12 text-sm"
            style={{ color: "#86b9b0" }}
          >
            No projects found.
          </p>
        )}
        {filtered.map((p) => (
          <Card
            key={p.id}
            className="p-5 hover:shadow-md transition-all hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0 mr-2">
                <h3
                  className="font-semibold truncate"
                  style={{ color: "#041421" }}
                >
                  {p.name}
                </h3>
                <p className="text-sm mt-0.5" style={{ color: "#4c7273" }}>
                  {p.client}
                </p>
              </div>
              <StatusBadge status={p.status} />
            </div>
            <p
              className="text-sm line-clamp-2 mb-4"
              style={{ color: "#4c7273" }}
            >
              {p.description}
            </p>
            <div className="mb-4">
              <div
                className="flex justify-between text-xs mb-1"
                style={{ color: "#86b9b0" }}
              >
                <span>Progress</span>
                <span>{p.progress}%</span>
              </div>
              <div
                className="rounded-full h-2"
                style={{ background: "#d0d6d6" }}
              >
                <div
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: `${p.progress}%`,
                    background: p.progress === 100 ? "#22c55e" : "#4c7273",
                  }}
                />
              </div>
            </div>
            <div
              className="flex items-center justify-between pt-3 border-t gap-2 flex-wrap"
              style={{ borderColor: "#d0d6d6" }}
            >
              <a
                href={p.repo}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs hover:underline"
                style={{ color: "#4c7273" }}
              >
                <ExternalLink className="w-3.5 h-3.5" /> GitHub
              </a>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEdit(p)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  style={{ background: "#fef9c3", color: "#854d0e" }}
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id, p.name)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  style={{ background: "#fee2e2", color: "#991b1b" }}
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
                <button
                  onClick={() => navigate(`/projects/${p.id}`)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  style={{ background: "#e0efee", color: "#042630" }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "#042630";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "#e0efee";
                    e.currentTarget.style.color = "#042630";
                  }}
                >
                  <Eye className="w-3.5 h-3.5" /> View
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {showAdd && (
        <Modal
          title="Add New Project"
          onClose={() => {
            setShowAdd(false);
            setAddForm(emptyForm);
          }}
        >
          <div className="space-y-4">
            <ProjectFormFields form={addForm} setForm={setAddForm} />
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setShowAdd(false);
                  setAddForm(emptyForm);
                }}
                className="flex-1 py-2.5 border rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                style={{ borderColor: "#d0d6d6", color: "#4c7273" }}
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-colors flex items-center justify-center gap-2"
                style={{ background: saving ? "#86b9b0" : "#4c7273" }}
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />} Add
                Project
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showEdit && (
        <Modal title="Edit Project" onClose={() => setShowEdit(false)}>
          <div className="space-y-4">
            <ProjectFormFields form={editForm} setForm={setEditForm} />
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowEdit(false)}
                className="flex-1 py-2.5 border rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                style={{ borderColor: "#d0d6d6", color: "#4c7273" }}
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                disabled={editSaving}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-colors flex items-center justify-center gap-2"
                style={{ background: editSaving ? "#86b9b0" : "#4c7273" }}
              >
                {editSaving && <Loader2 className="w-4 h-4 animate-spin" />}{" "}
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
export default Projects;
