import { useState } from "react";
import { meetings } from "../data/mockData";
import Card from "../components/Card";
import Modal from "../components/Modal";
import { Plus, CalendarDays, Clock, StickyNote } from "lucide-react";

const platformStyle = {
  "Google Meet":    { background:"#e0efee", color:"#042630" },
  "Zoom":           { background:"#ede9fe", color:"#4c1d95" },
  "Microsoft Teams":{ background:"#dbeafe", color:"#1e3a8a" },
};
const inputCls = "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4c7273]";
const inputStyle = { borderColor:"#d0d6d6", color:"#041421" };

const Meetings = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold" style={{ color:"#041421" }}>Meetings</h2>
          <p className="text-sm mt-1" style={{ color:"#4c7273" }}>{meetings.length} meetings scheduled</p>
        </div>
        <button onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-white transition-colors shadow-sm"
                style={{ background:"#4c7273" }}
                onMouseOver={e=>e.currentTarget.style.background="#042630"}
                onMouseOut={e=>e.currentTarget.style.background="#4c7273"}>
          <Plus className="w-4 h-4" /> Schedule Meeting
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {meetings.map(m => (
          <Card key={m.id} className="p-5 hover:shadow-md transition-all hover:-translate-y-0.5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold mb-2"
                      style={{ background:"#e0efee", color:"#042630" }}>{m.type}</span>
                <h3 className="font-semibold" style={{ color:"#041421" }}>{m.project}</h3>
                <p className="text-sm" style={{ color:"#4c7273" }}>{m.client}</p>
              </div>
              <span className="px-2 py-1 rounded-lg text-xs font-semibold"
                    style={platformStyle[m.platform] || { background:"#f0f4f4", color:"#4c7273" }}>
                {m.platform}
              </span>
            </div>
            <div className="space-y-2 text-sm mb-3" style={{ color:"#4c7273" }}>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 flex-shrink-0" style={{ color:"#86b9b0" }} />
                <span>{new Date(m.date).toLocaleDateString("en-US",{ weekday:"short", year:"numeric", month:"short", day:"numeric" })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 flex-shrink-0" style={{ color:"#86b9b0" }} />
                <span>{m.time}</span>
              </div>
            </div>
            <div className="pt-3 border-t flex items-start gap-2" style={{ borderColor:"#d0d6d6" }}>
              <StickyNote className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color:"#86b9b0" }} />
              <p className="text-xs leading-relaxed" style={{ color:"#86b9b0" }}>{m.notes}</p>
            </div>
          </Card>
        ))}
      </div>

      {showModal && (
        <Modal title="Schedule Meeting" onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color:"#041421" }}>Project</label>
              <select className={inputCls} style={inputStyle}>
                <option>E-Commerce Platform</option>
                <option>Hospital Management System</option>
                <option>Inventory Management App</option>
              </select>
            </div>
            {[["Meeting Type","text","e.g. Progress Review"],["Date","date",""],["Time","time",""]].map(([label,type,placeholder])=>(
              <div key={label}>
                <label className="block text-sm font-medium mb-1" style={{ color:"#041421" }}>{label}</label>
                <input type={type} placeholder={placeholder} className={inputCls} style={inputStyle} />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color:"#041421" }}>Platform</label>
              <select className={inputCls} style={inputStyle}>
                <option>Google Meet</option><option>Zoom</option><option>Microsoft Teams</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color:"#041421" }}>Notes</label>
              <textarea rows={3} placeholder="Meeting agenda or notes..."
                        className={inputCls + " resize-none"} style={inputStyle} />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowModal(false)}
                      className="flex-1 py-2.5 border rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                      style={{ borderColor:"#d0d6d6", color:"#4c7273" }}>Cancel</button>
              <button onClick={() => setShowModal(false)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white"
                      style={{ background:"#4c7273" }}>Schedule</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
export default Meetings;
