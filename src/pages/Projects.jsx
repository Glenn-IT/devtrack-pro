import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { projects } from "../data/mockData";
import Card from "../components/Card";
import StatusBadge from "../components/StatusBadge";
import Modal from "../components/Modal";
import { Plus, ExternalLink, Eye, Search } from "lucide-react";

const inputCls = "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4c7273]";
const inputStyle = { borderColor:"#d0d6d6", color:"#041421" };

const Projects = () => {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch]       = useState("");
  const [filter, setFilter]       = useState("All");
  const navigate = useNavigate();

  const filtered = projects.filter(p =>
    (filter === "All" || p.status === filter) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.client.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold" style={{ color:"#041421" }}>Projects</h2>
          <p className="text-sm mt-1" style={{ color:"#4c7273" }}>{projects.length} total projects</p>
        </div>
        <button onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-white transition-colors shadow-sm"
                style={{ background:"#4c7273" }}
                onMouseOver={e=>e.currentTarget.style.background="#042630"}
                onMouseOut={e=>e.currentTarget.style.background="#4c7273"}>
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      <Card className="p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:"#86b9b0" }} />
          <input value={search} onChange={e=>setSearch(e.target.value)}
                 placeholder="Search projects or clients..."
                 className={inputCls + " pl-9"} style={inputStyle} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All","Ongoing","Completed","To Do"].map(s => (
            <button key={s} onClick={() => setFilter(s)}
                    className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={filter===s
                      ? { background:"#042630", color:"#ffffff" }
                      : { background:"#f0f4f4", color:"#4c7273" }}>
              {s}
            </button>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(p => (
          <Card key={p.id} className="p-5 hover:shadow-md transition-all hover:-translate-y-0.5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold" style={{ color:"#041421" }}>{p.name}</h3>
                <p className="text-sm mt-0.5" style={{ color:"#4c7273" }}>{p.client}</p>
              </div>
              <StatusBadge status={p.status} />
            </div>
            <p className="text-sm line-clamp-2 mb-4" style={{ color:"#4c7273" }}>{p.description}</p>
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1" style={{ color:"#86b9b0" }}>
                <span>Progress</span><span>{p.progress}%</span>
              </div>
              <div className="rounded-full h-2" style={{ background:"#d0d6d6" }}>
                <div className="h-2 rounded-full transition-all"
                     style={{ width:`${p.progress}%`, background: p.progress===100?"#22c55e":"#4c7273" }} />
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor:"#d0d6d6" }}>
              <a href={p.repo} target="_blank" rel="noreferrer"
                 className="flex items-center gap-1 text-xs hover:underline"
                 style={{ color:"#4c7273" }}>
                <ExternalLink className="w-3.5 h-3.5" /> GitHub
              </a>
              <button onClick={() => navigate(`/projects/${p.id}`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      style={{ background:"#e0efee", color:"#042630" }}
                      onMouseOver={e=>{ e.currentTarget.style.background="#042630"; e.currentTarget.style.color="#ffffff"; }}
                      onMouseOut={e=>{ e.currentTarget.style.background="#e0efee"; e.currentTarget.style.color="#042630"; }}>
                <Eye className="w-3.5 h-3.5" /> View Details
              </button>
            </div>
          </Card>
        ))}
      </div>

      {showModal && (
        <Modal title="Add New Project" onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            {[["Project Name","text","e.g. My Web App"],["Client Name","text","e.g. ABC Corp"],["GitHub Repo URL","url","https://github.com/..."]].map(([label,type,placeholder]) => (
              <div key={label}>
                <label className="block text-sm font-medium mb-1" style={{ color:"#041421" }}>{label}</label>
                <input type={type} placeholder={placeholder} className={inputCls} style={inputStyle} />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color:"#041421" }}>Status</label>
              <select className={inputCls} style={inputStyle}>
                <option>To Do</option><option>Ongoing</option><option>Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color:"#041421" }}>Description</label>
              <textarea rows={3} placeholder="Brief project description..."
                        className={inputCls + " resize-none"} style={inputStyle} />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowModal(false)}
                      className="flex-1 py-2.5 border rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                      style={{ borderColor:"#d0d6d6", color:"#4c7273" }}>Cancel</button>
              <button onClick={() => setShowModal(false)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-colors"
                      style={{ background:"#4c7273" }}>Add Project</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
export default Projects;
