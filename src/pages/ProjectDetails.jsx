import { useParams, useNavigate } from "react-router-dom";
import { projects } from "../data/mockData";
import Card from "../components/Card";
import StatusBadge from "../components/StatusBadge";
import { ArrowLeft, ExternalLink, CheckCircle2, Circle, CalendarDays } from "lucide-react";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projects.find(p => p.id === Number(id));

  if (!project) return (
    <div className="text-center py-20">
      <p style={{ color:"#4c7273" }}>Project not found.</p>
      <button onClick={() => navigate("/projects")} className="mt-4 text-sm hover:underline"
              style={{ color:"#4c7273" }}>Back to Projects</button>
    </div>
  );

  const doneTasks = project.tasks.filter(t => t.done).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate("/projects")}
                className="p-2 rounded-lg hover:bg-[#e0efee] transition-colors">
          <ArrowLeft className="w-5 h-5" style={{ color:"#4c7273" }} />
        </button>
        <div>
          <h2 className="text-2xl font-bold" style={{ color:"#041421" }}>{project.name}</h2>
          <p className="text-sm" style={{ color:"#4c7273" }}>{project.client}</p>
        </div>
        <div className="ml-auto"><StatusBadge status={project.status} /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">

          <Card className="p-6">
            <h3 className="font-semibold mb-3" style={{ color:"#041421" }}>Project Information</h3>
            <p className="text-sm leading-relaxed mb-4" style={{ color:"#4c7273" }}>{project.description}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[["Start Date",project.startDate,"#041421"],["End Date",project.endDate,"#041421"],
                ["Budget",`₱${project.budget.toLocaleString()}`,"#041421"],["Paid",`₱${project.paid.toLocaleString()}`,"#0a5940"]
              ].map(([label,val,clr]) => (
                <div key={label}>
                  <span style={{ color:"#86b9b0" }}>{label}</span>
                  <p className="font-medium mt-0.5" style={{ color:clr }}>{val}</p>
                </div>
              ))}
            </div>
            <a href={project.repo} target="_blank" rel="noreferrer"
               className="flex items-center gap-2 mt-4 text-sm hover:underline"
               style={{ color:"#4c7273" }}>
              <ExternalLink className="w-4 h-4" /> {project.repo}
            </a>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color:"#041421" }}>Overall Progress</h3>
              <span className="text-2xl font-bold" style={{ color:"#4c7273" }}>{project.progress}%</span>
            </div>
            <div className="rounded-full h-4" style={{ background:"#d0d6d6" }}>
              <div className="h-4 rounded-full transition-all"
                   style={{ width:`${project.progress}%`, background: project.progress===100?"#22c55e":"#4c7273" }} />
            </div>
            <div className="flex justify-between text-xs mt-2" style={{ color:"#86b9b0" }}>
              <span>Started: {project.startDate}</span><span>Due: {project.endDate}</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color:"#041421" }}>Tasks</h3>
              <span className="text-sm" style={{ color:"#86b9b0" }}>{doneTasks}/{project.tasks.length} completed</span>
            </div>
            <div className="space-y-2.5">
              {project.tasks.map(task => (
                <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl"
                     style={{ background: task.done ? "#e0efee" : "#f0f4f4" }}>
                  {task.done
                    ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color:"#4c7273" }} />
                    : <Circle      className="w-5 h-5 flex-shrink-0" style={{ color:"#d0d6d6" }} />}
                  <span className="text-sm" style={{ color: task.done?"#86b9b0":"#041421", textDecoration: task.done?"line-through":"none" }}>
                    {task.title}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div>
          <Card className="p-6">
            <h3 className="font-semibold mb-5 flex items-center gap-2" style={{ color:"#041421" }}>
              <CalendarDays className="w-4 h-4" style={{ color:"#4c7273" }} /> Milestones
            </h3>
            <div className="relative">
              <div className="absolute left-3.5 top-0 bottom-0 w-0.5" style={{ background:"#d0d6d6" }} />
              <div className="space-y-5">
                {project.milestones.map(m => (
                  <div key={m.id} className="relative flex items-start gap-4 pl-8">
                    <div className="absolute left-0 w-7 h-7 rounded-full flex items-center justify-center border-2"
                         style={m.done
                           ? { background:"#4c7273", borderColor:"#4c7273" }
                           : { background:"#ffffff", borderColor:"#d0d6d6" }}>
                      {m.done && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: m.done?"#041421":"#86b9b0" }}>{m.title}</p>
                      <p className="text-xs mt-0.5" style={{ color:"#86b9b0" }}>{m.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default ProjectDetails;
