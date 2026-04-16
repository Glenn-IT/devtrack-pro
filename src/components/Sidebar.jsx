import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, FolderKanban, CreditCard,
  CalendarDays, BarChart3, X
} from "lucide-react";

const navItems = [
  { to: "/",           label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects",   label: "Projects",  icon: FolderKanban },
  { to: "/payments",   label: "Payments",  icon: CreditCard },
  { to: "/meetings",   label: "Meetings",  icon: CalendarDays },
  { to: "/analytics",  label: "Analytics", icon: BarChart3 },
];

const Sidebar = ({ open, onClose }) => (
  <>
    {open && (
      <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={onClose} />
    )}
    <aside
      className={`fixed top-0 left-0 h-full w-64 z-30 flex flex-col
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}
      style={{ background: "linear-gradient(180deg, #041421 0%, #042630 100%)" }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
               style={{ background: "#4c7273" }}>
            <FolderKanban className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-white block">DevTrack Pro</span>
            <span className="text-xs" style={{ color: "#86b9b0" }}>Project Manager</span>
          </div>
        </div>
        <button onClick={onClose} className="lg:hidden text-white/60 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="mt-5 px-3 flex-1 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === "/"} onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
               ${isActive
                 ? "text-white shadow-lg"
                 : "hover:text-white"
               }`
            }
            style={({ isActive }) => isActive
              ? { background: "#4c7273", color: "#ffffff" }
              : { color: "#86b9b0" }
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 pb-6">
        <div className="rounded-xl p-4 text-sm" style={{ background: "rgba(76,114,115,0.25)" }}>
          <p className="font-semibold text-white text-xs">DevTrack Pro v1.0.0</p>
          <p className="text-xs mt-0.5" style={{ color: "#86b9b0" }}>Frontend Prototype</p>
          <div className="mt-2 flex gap-1">
            {["#041421","#042630","#4c7273","#86b9b0","#d0d6d6"].map(c => (
              <div key={c} className="w-4 h-4 rounded-full border border-white/20" style={{ background: c }} />
            ))}
          </div>
        </div>
      </div>
    </aside>
  </>
);
export default Sidebar;
