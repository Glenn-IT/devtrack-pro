import { projects, payments } from "../data/mockData";
import Card from "../components/Card";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { TrendingUp, Target, Award, Activity } from "lucide-react";

const earningsData  = projects.map(p=>({ name:p.name.split(" ").slice(0,2).join(" "), earned:p.paid, budget:p.budget }));
const statusData    = [
  { name:"Ongoing",   value:projects.filter(p=>p.status==="Ongoing").length,   color:"#4c7273" },
  { name:"Completed", value:projects.filter(p=>p.status==="Completed").length, color:"#86b9b0" },
  { name:"To Do",     value:projects.filter(p=>p.status==="To Do").length,     color:"#d0d6d6" },
];
const progressData  = projects.map(p=>({ name:p.name.split(" ").slice(0,2).join(" "), progress:p.progress }));
const totalEarned   = payments.reduce((s,p)=>s+p.paid,0);
const totalBudget   = payments.reduce((s,p)=>s+p.total,0);
const completionRate = Math.round((projects.filter(p=>p.status==="Completed").length/projects.length)*100);

const summaryCards = [
  { label:"Total Revenue",    value:`₱${totalBudget.toLocaleString()}`,  icon:TrendingUp, bg:"#e0efee", fg:"#042630" },
  { label:"Total Collected",  value:`₱${totalEarned.toLocaleString()}`,  icon:Award,      bg:"#d0f0e8", fg:"#0a5940" },
  { label:"Completion Rate",  value:`${completionRate}%`,                 icon:Target,     bg:"#042630", fg:"#86b9b0" },
  { label:"Active Projects",  value:projects.filter(p=>p.status==="Ongoing").length, icon:Activity, bg:"#fef9c3", fg:"#854d0e" },
];

const Analytics = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold" style={{ color:"#041421" }}>Analytics</h2>
      <p className="text-sm mt-1" style={{ color:"#4c7273" }}>Overview of project performance and earnings</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {summaryCards.map(c=>(
        <Card key={c.label} className="p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
               style={{ background:c.bg }}>
            <c.icon className="w-6 h-6" style={{ color:c.fg }} />
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color:"#4c7273" }}>{c.label}</p>
            <p className="text-2xl font-bold" style={{ color:"#041421" }}>{c.value}</p>
          </div>
        </Card>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2 p-6">
        <h3 className="font-semibold mb-4" style={{ color:"#041421" }}>Budget vs Earned per Project</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={earningsData} margin={{ top:4, right:10, left:0, bottom:0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d0d6d6" />
            <XAxis dataKey="name" tick={{ fontSize:11, fill:"#4c7273" }} />
            <YAxis tick={{ fontSize:11, fill:"#4c7273" }} tickFormatter={v=>`₱${(v/1000).toFixed(0)}k`} />
            <Tooltip formatter={v=>`₱${Number(v).toLocaleString()}`} contentStyle={{ borderRadius:8, borderColor:"#d0d6d6" }} />
            <Legend />
            <Bar dataKey="budget" fill="#d0d6d6" name="Budget" radius={[4,4,0,0]} />
            <Bar dataKey="earned" fill="#4c7273" name="Earned" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6 flex flex-col">
        <h3 className="font-semibold mb-4" style={{ color:"#041421" }}>Project Status</h3>
        <ResponsiveContainer width="100%" height={230}>
          <PieChart>
            <Pie data={statusData} cx="50%" cy="45%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
              {statusData.map((entry,i)=><Cell key={i} fill={entry.color} />)}
            </Pie>
            <Legend wrapperStyle={{ fontSize:12 }} />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>

    <Card className="p-6">
      <h3 className="font-semibold mb-4" style={{ color:"#041421" }}>Project Completion Progress</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={progressData} layout="vertical" margin={{ top:4, right:20, left:10, bottom:0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#d0d6d6" />
          <XAxis type="number" domain={[0,100]} tick={{ fontSize:11, fill:"#4c7273" }} tickFormatter={v=>`${v}%`} />
          <YAxis type="category" dataKey="name" tick={{ fontSize:11, fill:"#4c7273" }} width={110} />
          <Tooltip formatter={v=>`${v}%`} />
          <Bar dataKey="progress" fill="#4c7273" radius={[0,6,6,0]}
               background={{ fill:"#f0f4f4", radius:[0,6,6,0] }} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  </div>
);
export default Analytics;
