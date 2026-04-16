const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow-sm border ${className}`}
       style={{ borderColor: "#d0d6d6" }}>
    {children}
  </div>
);
export default Card;
