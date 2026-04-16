import StatusBadge from "./StatusBadge";

const Table = ({ columns, data, onAction, actionLabel = "View" }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left border-b" style={{ background: "#f0f4f4", borderColor: "#d0d6d6" }}>
          {columns.map(col => (
            <th key={col.key} className="px-4 py-3 font-semibold text-xs uppercase tracking-wider"
                style={{ color: "#4c7273" }}>{col.label}</th>
          ))}
          {onAction && (
            <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider"
                style={{ color: "#4c7273" }}>Action</th>
          )}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={row.id || i} className="border-b transition-colors hover:bg-[#f0f4f4]"
              style={{ borderColor: "#d0d6d6" }}>
            {columns.map(col => (
              <td key={col.key} className="px-4 py-3.5" style={{ color: "#041421" }}>
                {col.badge    ? <StatusBadge status={row[col.key]} /> :
                 col.link     ? <a href={row[col.key]} target="_blank" rel="noreferrer"
                                   className="hover:underline truncate block max-w-[160px]"
                                   style={{ color: "#4c7273" }}>{row[col.key]}</a> :
                 col.currency ? `₱${Number(row[col.key]).toLocaleString()}` :
                 row[col.key]}
              </td>
            ))}
            {onAction && (
              <td className="px-4 py-3.5">
                <button onClick={() => onAction(row)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-colors"
                        style={{ background: "#4c7273" }}
                        onMouseOver={e => e.currentTarget.style.background = "#042630"}
                        onMouseOut={e => e.currentTarget.style.background = "#4c7273"}>
                  {actionLabel}
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
export default Table;
