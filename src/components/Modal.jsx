import { X } from "lucide-react";

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
       style={{ background: "rgba(4,20,33,0.55)", backdropFilter: "blur(4px)" }}>
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
      <div className="flex items-center justify-between px-6 py-4 border-b"
           style={{ borderColor: "#d0d6d6" }}>
        <h2 className="text-lg font-semibold" style={{ color: "#041421" }}>{title}</h2>
        <button onClick={onClose}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                style={{ color: "#4c7273" }}>
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  </div>
);
export default Modal;
