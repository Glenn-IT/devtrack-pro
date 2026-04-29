import { useState, useEffect } from "react";
import { getProjects } from "../api/projectsApi";
import { getPayments } from "../api/paymentsApi";
import Card from "../components/Card";
import StatusBadge from "../components/StatusBadge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  FolderKanban,
  CheckCircle,
  Clock,
  DollarSign,
  Loader2,
} from "lucide-react";

const StatCard = ({ label, value, icon: Icon, bg, fg, sub }) => (
  <Card className="p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: bg }}
    >
      <Icon className="w-6 h-6" style={{ color: fg }} />
    </div>
    <div>
      <p className="text-sm font-medium" style={{ color: "#4c7273" }}>
        {label}
      </p>
      <p className="text-2xl font-bold" style={{ color: "#041421" }}>
        {value}
      </p>
      {sub && (
        <p className="text-xs mt-0.5" style={{ color: "#86b9b0" }}>
          {sub}
        </p>
      )}
    </div>
  </Card>
);

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, payRes] = await Promise.all([
          getProjects(),
          getPayments(),
        ]);
        setProjects(projRes.data);
        setPayments(payRes.data);
      } catch {
        setError("Failed to load dashboard data. Is the backend running?");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  const totalEarnings = payments.reduce((s, p) => s + Number(p.paid), 0);
  const activeCount = projects.filter((p) => p.status === "Ongoing").length;
  const completedCount = projects.filter(
    (p) => p.status === "Completed",
  ).length;

  // Build earnings per project from payments (sum paid per project_id)
  const earningsByProject = payments.reduce((acc, p) => {
    acc[p.project_id] = (acc[p.project_id] || 0) + Number(p.paid);
    return acc;
  }, {});
  const chartData = projects.map((p) => ({
    name: p.name.split(" ").slice(0, 2).join(" "),
    Budget: Number(p.budget) || 0,
    Paid: earningsByProject[p.id] || 0,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold" style={{ color: "#041421" }}>
          Dashboard
        </h2>
        <p className="text-sm mt-1" style={{ color: "#4c7273" }}>
          Welcome back, Admin! Here is your overview.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Projects"
          value={projects.length}
          icon={FolderKanban}
          bg="#e0efee"
          fg="#042630"
        />
        <StatCard
          label="Active Projects"
          value={activeCount}
          icon={Clock}
          bg="#fef9c3"
          fg="#854d0e"
        />
        <StatCard
          label="Completed"
          value={completedCount}
          icon={CheckCircle}
          bg="#d0f0e8"
          fg="#0a5940"
        />
        <StatCard
          label="Total Earnings"
          value={`₱${totalEarnings.toLocaleString()}`}
          icon={DollarSign}
          bg="#042630"
          fg="#86b9b0"
          sub="Paid so far"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h3 className="font-semibold mb-4" style={{ color: "#041421" }}>
            Budget vs Paid per Project
          </h3>
          {chartData.length === 0 ? (
            <div
              className="flex items-center justify-center h-60 text-sm"
              style={{ color: "#86b9b0" }}
            >
              No project data yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={chartData}
                margin={{ top: 4, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#d0d6d6" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#4c7273" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#4c7273" }}
                  tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(v) => `₱${Number(v).toLocaleString()}`}
                  contentStyle={{ borderRadius: 8, borderColor: "#d0d6d6" }}
                />
                <Legend wrapperStyle={{ fontSize: 12, color: "#4c7273" }} />
                <Bar dataKey="Budget" fill="#d0d6d6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Paid" fill="#4c7273" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-4" style={{ color: "#041421" }}>
            Recent Projects
          </h3>
          <div className="space-y-3">
            {projects.slice(0, 5).map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p
                    className="text-sm font-medium truncate"
                    style={{ color: "#041421" }}
                  >
                    {p.name}
                  </p>
                  <p className="text-xs" style={{ color: "#86b9b0" }}>
                    {p.client}
                  </p>
                </div>
                <StatusBadge status={p.status} />
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card className="p-6">
        <h3 className="font-semibold mb-4" style={{ color: "#041421" }}>
          All Projects Overview
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                className="text-left border-b"
                style={{ background: "#f0f4f4", borderColor: "#d0d6d6" }}
              >
                {["Project", "Client", "Status", "Progress"].map((h) => (
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
              {projects.map((p) => (
                <tr
                  key={p.id}
                  className="border-b hover:bg-[#f0f4f4] transition-colors"
                  style={{ borderColor: "#d0d6d6" }}
                >
                  <td
                    className="px-4 py-3.5 font-medium"
                    style={{ color: "#041421" }}
                  >
                    {p.name}
                  </td>
                  <td className="px-4 py-3.5" style={{ color: "#4c7273" }}>
                    {p.client}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-4 py-3.5 w-44">
                    <div className="flex items-center gap-2">
                      <div
                        className="flex-1 rounded-full h-2"
                        style={{ background: "#d0d6d6" }}
                      >
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${p.progress}%`,
                            background:
                              p.progress === 100 ? "#22c55e" : "#4c7273",
                          }}
                        />
                      </div>
                      <span
                        className="text-xs w-8"
                        style={{ color: "#86b9b0" }}
                      >
                        {p.progress}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
