
const menuItems = [
  { id: "dashboard", icon: "▦", label: "Dashboard" },
  { id: "students", icon: "♙", label: "Students" },
  { id: "teachers", icon: "♧", label: "Teachers" },
  { id: "classes", icon: "▤", label: "Classes" },
  { id: "attendance", icon: "✓", label: "Attendance" },
  { id: "fees", icon: "₹", label: "Fees & Payments" }
];

export default function Sidebar({ activePage, setActivePage, user, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo">M</div>
        <div>
          <h2>MANIAR</h2>
          <span>School Management</span>
        </div>
      </div>

      <p className="menu-label">MAIN MENU</p>

      <nav className="side-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activePage === item.id ? "active" : ""}`}
            onClick={() => setActivePage(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
            {activePage === item.id && <span className="active-dot" />}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="user-avatar">
          {user?.name?.charAt(0)?.toUpperCase() || "A"}
        </div>
        <div className="user-info">
          <strong>{user?.name || "School Admin"}</strong>
          <span>{user?.role || "admin"}</span>
        </div>
        <button className="logout-icon" onClick={onLogout} title="Logout">
          ↗
        </button>
      </div>
    </aside>
  );
}
