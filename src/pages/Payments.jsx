import { payments } from "../data/mockData";
import Card from "../components/Card";
import StatusBadge from "../components/StatusBadge";
import { DollarSign, TrendingUp, Clock } from "lucide-react";

const totalEarned  = payments.reduce((s,p)=>s+p.paid,0);
const totalPending = payments.reduce((s,p)=>s+(p.total-p.paid),0);
const totalAll     = payments.reduce((s,p)=>s+p.total,0);

const Payments = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold" style={{ color:"#041421" }}>Payments</h2>
      <p className="text-sm mt-1" style={{ color:"#4c7273" }}>Track project payments and balances</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[
        { label:"Total Contract Value", value:`₱${totalAll.toLocaleString()}`,     icon:DollarSign, bg:"#e0efee", fg:"#042630" },
        { label:"Total Collected",      value:`₱${totalEarned.toLocaleString()}`,  icon:TrendingUp, bg:"#d0f0e8", fg:"#0a5940" },
        { label:"Pending Balance",      value:`₱${totalPending.toLocaleString()}`, icon:Clock,      bg:"#fef9c3", fg:"#854d0e" },
      ].map(c => (
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

    <Card>
      <div className="px-6 py-4 border-b" style={{ borderColor:"#d0d6d6" }}>
        <h3 className="font-semibold" style={{ color:"#041421" }}>Payment Records</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b" style={{ background:"#f0f4f4", borderColor:"#d0d6d6" }}>
              {["Project","Client","Total Amount","Paid","Remaining","Status"].map(h=>(
                <th key={h} className="px-4 py-3 font-semibold text-xs uppercase tracking-wider"
                    style={{ color:"#4c7273" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payments.map(p=>(
              <tr key={p.id} className="border-b hover:bg-[#f0f4f4] transition-colors"
                  style={{ borderColor:"#d0d6d6" }}>
                <td className="px-4 py-3.5 font-medium" style={{ color:"#041421" }}>{p.project}</td>
                <td className="px-4 py-3.5" style={{ color:"#4c7273" }}>{p.client}</td>
                <td className="px-4 py-3.5" style={{ color:"#041421" }}>₱{p.total.toLocaleString()}</td>
                <td className="px-4 py-3.5 font-medium" style={{ color:"#0a5940" }}>₱{p.paid.toLocaleString()}</td>
                <td className="px-4 py-3.5 font-medium" style={{ color:"#991b1b" }}>₱{(p.total-p.paid).toLocaleString()}</td>
                <td className="px-4 py-3.5"><StatusBadge status={p.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);
export default Payments;
