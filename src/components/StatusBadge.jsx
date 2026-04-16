const StatusBadge = ({ status }) => {
  const styles = {
    "Ongoing":   { background: "#e0efee", color: "#042630" },
    "Completed": { background: "#d0f0e8", color: "#0a5940" },
    "To Do":     { background: "#d0d6d6", color: "#041421" },
    "Paid":      { background: "#d0f0e8", color: "#0a5940" },
    "Partial":   { background: "#fef9c3", color: "#854d0e" },
    "Unpaid":    { background: "#fee2e2", color: "#991b1b" },
  };
  const s = styles[status] || styles["To Do"];
  return (
    <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={s}>
      {status}
    </span>
  );
};
export default StatusBadge;
