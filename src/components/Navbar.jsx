import { Menu, Bell, User } from "lucide-react";

const Navbar = ({ onMenuClick }) => (
  <header className="flex items-center justify-between px-6 py-4 border-b shadow-sm"
          style={{ background: "#ffffff", borderColor: "#d0d6d6" }}>
    <div className="flex items-center gap-4">
      <button onClick={onMenuClick} className="lg:hidden transition-colors"
              style={{ color: "#4c7273" }}>
        <Menu className="w-6 h-6" />
      </button>
      <div>
        <h1 className="text-xl font-bold" style={{ color: "#041421" }}>DevTrack Pro</h1>
        <p className="text-xs hidden sm:block" style={{ color: "#4c7273" }}>
          Capstone Project Management System
        </p>
      </div>
    </div>

    <div className="flex items-center gap-3">
      <button className="relative p-2 rounded-lg transition-colors hover:bg-gray-100">
        <Bell className="w-5 h-5" style={{ color: "#4c7273" }} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ background: "#86b9b0" }} />
      </button>
      <div className="flex items-center gap-2 pl-3 border-l" style={{ borderColor: "#d0d6d6" }}>
        <div className="w-9 h-9 rounded-full flex items-center justify-center"
             style={{ background: "#042630" }}>
          <User className="w-5 h-5 text-white" />
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-semibold" style={{ color: "#041421" }}>Admin</p>
          <p className="text-xs" style={{ color: "#4c7273" }}>Project Manager</p>
        </div>
      </div>
    </div>
  </header>
);
export default Navbar;
