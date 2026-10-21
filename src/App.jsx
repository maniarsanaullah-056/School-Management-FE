
import { useEffect, useState } from "react";
import { apiRequest } from "./api";
import Sidebar from "./component/Sidebar.jsx";
import Login from "./pages/Login";

const modules = {
  students: {
    title: "Students",
    singular: "Student",
    path: "/students",
    fields: [
      { name: "admissionNumber", label: "Admission Number", required: true },
      { name: "firstName", label: "First Name", required: true },
      { name: "lastName", label: "Last Name", required: true },
      { name: "email", label: "Email", type: "email" },
      { name: "phone", label: "Phone" },
      { name: "className", label: "Class", required: true },
      { name: "section", label: "Section" },
      { name: "guardianName", label: "Guardian Name" },
      { name: "guardianPhone", label: "Guardian Phone" },
      { name: "address", label: "Address" },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: ["active", "inactive"]
      }
    ],
    columns: [
      "admissionNumber",
      "firstName",
      "lastName",
      "className",
      "section",
      "status"
    ]
  },

  teachers: {
    title: "Teachers",
    singular: "Teacher",
    path: "/teachers",
    fields: [
      { name: "employeeNumber", label: "Employee Number", required: true },
      { name: "firstName", label: "First Name", required: true },
      { name: "lastName", label: "Last Name", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "phone", label: "Phone" },
      { name: "subject", label: "Subject", required: true },
      { name: "qualification", label: "Qualification" },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: ["active", "inactive"]
      }
    ],
    columns: [
      "employeeNumber",
      "firstName",
      "lastName",
      "subject",
      "email",
      "status"
    ]
  },

  classes: {
    title: "Classes",
    singular: "Class",
    path: "/classes",
    fields: [
      { name: "name", label: "Class Name", required: true },
      { name: "section", label: "Section", required: true },
      { name: "academicYear", label: "Academic Year", required: true },
      { name: "roomNumber", label: "Room Number" },
      { name: "classTeacher", label: "Teacher ID (optional)" }
    ],
    columns: ["name", "section", "academicYear", "roomNumber"]
  },

  attendance: {
    title: "Attendance",
    singular: "Attendance Record",
    path: "/attendance",
    fields: [
      { name: "student", label: "Student MongoDB ID", required: true },
      { name: "className", label: "Class Name", required: true },
      { name: "date", label: "Date", type: "date" },
      {
        name: "status",
        label: "Attendance Status",
        type: "select",
        options: ["present", "absent", "late", "leave"],
        required: true
      },
      { name: "remarks", label: "Remarks" }
    ],
    columns: ["student", "className", "date", "status"],
    canEdit: false,
    canDelete: false
  },

  fees: {
    title: "Fees & Payments",
    singular: "Fee",
    path: "/fees",
    fields: [
      { name: "student", label: "Student MongoDB ID", required: true },
      { name: "title", label: "Fee Title", required: true },
      { name: "amount", label: "Total Amount", type: "number", required: true },
      { name: "paidAmount", label: "Paid Amount", type: "number" },
      { name: "dueDate", label: "Due Date", type: "date", required: true },
      {
        name: "paymentMethod",
        label: "Payment Method",
        type: "select",
        options: ["cash", "bank", "online", "other"]
      },
      { name: "receiptNumber", label: "Receipt Number" }
    ],
    columns: ["title", "amount", "paidAmount", "dueDate", "status"]
  }
};

// ADMIN DASHBOARD
function Dashboard({ onNavigate }) {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest("/dashboard")
      .then((result) => setStats(result.data || result))
      .catch((err) => setError(err.message));
  }, []);

  const cards = [
    { label: "Total Students", key: "totalStudents", icon: "♙", color: "blue" },
    { label: "Total Teachers", key: "totalTeachers", icon: "♧", color: "purple" },
    { label: "Total Classes", key: "totalClasses", icon: "▤", color: "orange" },
    { label: "Outstanding Fees", key: "outstandingFees", icon: "₹", color: "green" }
  ];

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">OVERVIEW</p>
          <h1>Dashboard</h1>
          <p className="muted">Here's what's happening at your school.</p>
        </div>
        <span className="date-pill">{new Date().toLocaleDateString()}</span>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="stats-grid">
        {cards.map((card) => (
          <div className="stat-card" key={card.key}>
            <div className={`stat-icon ${card.color}`}>{card.icon}</div>
            <p>{card.label}</p>
            <h2>
              {stats
                ? card.key === "outstandingFees"
                  ? `Rs. ${Number(
                      stats[card.key] ?? stats.totalOutstandingFees ?? 0
                    ).toLocaleString()}`
                  : stats[card.key] ??
                    stats[card.key.replace("total", "").toLowerCase()] ??
                    0
                : "—"}
            </h2>
            <span className="stat-caption">Live backend data</span>
          </div>
        ))}
      </div>

      <section className="welcome-card">
        <div>
          <span className="welcome-tag">YOUR SCHOOL, ONE PLACE</span>
          <h2>Everything organized.<br />Every day, made easier.</h2>
          <p>Manage your school records using the shortcuts below.</p>
        </div>
        <div className="welcome-art">S</div>
      </section>

      <h2 className="section-title">Quick access</h2>

      <div className="quick-grid">
        {["students", "teachers", "classes", "attendance", "fees"].map((key) => (
          <button
            className="quick-card"
            key={key}
            onClick={() => onNavigate(key)}
          >
            <span>{modules[key].title}</span>
            <strong>Open module ↗</strong>
          </button>
        ))}
      </div>
    </>
  );
}

// ADMIN MODULES
function Manager({ moduleKey, user }) {
  const config = modules[moduleKey];
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const isAdmin = user?.role === "admin";

  async function loadRecords() {
    setLoading(true);
    setError("");

    try {
      const result = await apiRequest(config.path);
      setRecords(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setRecords([]);
    setSearch("");
    setNotice("");
    setEditing(null);
    loadRecords();
  }, [moduleKey]);

  function startCreate() {
    const initial = {};

    config.fields.forEach((field) => {
      initial[field.name] =
        field.type === "select" ? field.options[0] || "" : "";
    });

    if (moduleKey === "attendance") {
      initial.date = new Date().toISOString().slice(0, 10);
    }

    setForm(initial);
    setEditing("new");
    setError("");
    setNotice("");
  }

  function startEdit(record) {
    const values = {};

    config.fields.forEach((field) => {
      const value = record[field.name];

      values[field.name] =
        value && typeof value === "object"
          ? value._id || ""
          : value ?? "";
    });

    setForm(values);
    setEditing(record._id);
    setError("");
    setNotice("");
  }

  async function saveRecord(e) {
    e.preventDefault();
    setError("");
    setNotice("");

    const body = {};

    config.fields.forEach((field) => {
      const value = form[field.name];

      if (value !== "" && value !== undefined) {
        body[field.name] = ["amount", "paidAmount"].includes(field.name)
          ? Number(value)
          : value;
      }
    });

    try {
      if (editing === "new") {
        await apiRequest(config.path, {
          method: "POST",
          body: JSON.stringify(body)
        });

        setNotice(`${config.singular} added successfully.`);
      } else {
        await apiRequest(`${config.path}/${editing}`, {
          method: "PUT",
          body: JSON.stringify(body)
        });

        setNotice(`${config.singular} updated successfully.`);
      }

      setEditing(null);
      await loadRecords();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteRecord(id) {
    if (!window.confirm("Are you sure you want to delete this record?")) {
      return;
    }

    setError("");
    setNotice("");

    try {
      await apiRequest(`${config.path}/${id}`, { method: "DELETE" });
      setNotice("Record deleted successfully.");
      await loadRecords();
    } catch (err) {
      setError(err.message);
    }
  }

  const filtered = records.filter((record) =>
    config.columns.some((key) =>
      String(record[key] ?? "").toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">SCHOOL RECORDS</p>
          <h1>{config.title}</h1>
          <p className="muted">
            View and manage your {config.title.toLowerCase()} records.
          </p>
        </div>

        {isAdmin && (
          <button className="primary-btn" onClick={startCreate}>
            + Add {config.singular}
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
      {notice && <div className="success-message">{notice}</div>}

      {editing !== null && (
        <form className="form-panel" onSubmit={saveRecord}>
          <div className="form-heading">
            <div>
              <h2>
                {editing === "new"
                  ? `Add ${config.singular}`
                  : `Edit ${config.singular}`}
              </h2>
              <p className="muted">Fill in the record details below.</p>
            </div>

            <button
              type="button"
              className="icon-button"
              onClick={() => setEditing(null)}
            >
              ✕
            </button>
          </div>

          <div className="form-grid">
            {config.fields.map((field) => (
              <label className="field" key={field.name}>
                <span>
                  {field.label}
                  {field.required ? " *" : ""}
                </span>

                {field.type === "select" ? (
                  <select
                    value={form[field.name] ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, [field.name]: e.target.value })
                    }
                    required={field.required}
                  >
                    {!field.required && (
                      <option value="">Select an option</option>
                    )}

                    {field.options.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type || "text"}
                    value={form[field.name] ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, [field.name]: e.target.value })
                    }
                    required={field.required}
                    min={field.type === "number" ? "0" : undefined}
                    placeholder={field.label}
                  />
                )}
              </label>
            ))}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => setEditing(null)}
            >
              Cancel
            </button>

            <button className="primary-btn" type="submit">
              {editing === "new" ? "Save record" : "Update record"}
            </button>
          </div>
        </form>
      )}

      <section className="table-panel">
        <div className="table-toolbar">
          <div>
            <h2>All {config.title}</h2>
            <p className="muted">{records.length} record(s) found</p>
          </div>

          <input
            className="search-input"
            placeholder="Search records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="empty-state">Loading records...</div>
        ) : error && records.length === 0 ? (
          <div className="empty-state">
            Could not load records. Check the backend and try again.
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            No records found. Add a record or try another search.
          </div>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  {config.columns.map((key) => (
                    <th key={key}>{key.replace(/([A-Z])/g, " $1")}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((record) => (
                  <tr key={record._id}>
                    {config.columns.map((key) => {
                      const value = record[key];

                      const display =
                        value && typeof value === "object"
                          ? value.firstName
                            ? `${value.firstName} ${value.lastName || ""}`
                            : value._id || ""
                          : value;

                      return (
                        <td key={key}>
                          {key === "status" && display ? (
                            <span
                              className={`status-badge ${String(
                                display
                              ).toLowerCase()}`}
                            >
                              {display}
                            </span>
                          ) : key === "student" && display ? (
                            <span className="id-text" title={String(display)}>
                              {String(display).slice(-8)}
                            </span>
                          ) : (
                            (display ? String(display).slice(0, 45) : "—")
                          )}
                        </td>
                      );
                    })}

                    <td>
                      <div className="action-buttons">
                        {isAdmin && config.canEdit !== false && (
                          <button
                            className="small-action"
                            onClick={() => startEdit(record)}
                          >
                            Edit
                          </button>
                        )}

                        {isAdmin && config.canDelete !== false && (
                          <button
                            className="small-action danger"
                            onClick={() => deleteRecord(record._id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

// STUDENT AND TEACHER DASHBOARD
function RoleDashboard({ user, onLogout }) {
  const isStudent = user.role === "student";

  return (
    <div className="portal">
      <aside className="portal-sidebar">
        <div className="portal-brand">
          <div className="portal-logo">M</div>
          <div>
            <h2>MANIAR</h2>
            <small>School Portal</small>
          </div>
        </div>

        <div className="portal-profile">
          <div className="portal-avatar">
            {(user.name || "U").charAt(0).toUpperCase()}
          </div>
          <strong>{user.name}</strong>
          <span>{user.role}</span>
        </div>

        <div className="portal-menu active">▦ Dashboard</div>
        <div className="portal-menu">
          {isStudent ? "🎓 My Studies" : "📚 My Teaching"}
        </div>
        <div className="portal-menu">▤ My Profile</div>

        <button className="portal-logout" onClick={onLogout}>
          ↪ Sign out
        </button>
      </aside>

      <main className="portal-main">
        <header className="portal-topbar">
          <div>
            <small>MY WORKSPACE</small>
            <h2>Dashboard</h2>
          </div>

          <div className="portal-welcome">
            <span className="portal-status" />
            {user.name}
          </div>
        </header>

        <section className="portal-content">
          <div className="portal-hero">
            <div>
              <span className="portal-tag">
                {isStudent ? "STUDENT PORTAL" : "TEACHER PORTAL"}
              </span>

              <h1>
                Welcome back,
                <br />
                {user.name} 👋
              </h1>

              <p>
                {isStudent
                  ? "Your learning journey starts here. Stay organized and keep learning."
                  : "Your teaching workspace is ready. Stay organized throughout your day."}
              </p>
            </div>

            <div className="portal-hero-icon">
              {isStudent ? "🎓" : "📚"}
            </div>
          </div>

          <h2 className="portal-section-title">Your overview</h2>

          <div className="portal-cards">
            <article className="portal-card">
              <div className="portal-card-icon purple">
                {isStudent ? "🎓" : "📖"}
              </div>
              <span>Account type</span>
              <h3>{isStudent ? "Student" : "Teacher"}</h3>
              <small>Your registered role</small>
            </article>

            <article className="portal-card">
              <div className="portal-card-icon blue">✉</div>
              <span>Email address</span>
              <h3 className="portal-email">{user.email}</h3>
              <small>Your login account</small>
            </article>

            <article className="portal-card">
              <div className="portal-card-icon green">✓</div>
              <span>Account status</span>
              <h3>Logged in</h3>
              <small>Your session is active</small>
            </article>
          </div>

          <section className="portal-info">
            <div className="portal-info-icon">
              {isStudent ? "💡" : "✨"}
            </div>

            <div>
              <h3>{isStudent ? "Keep learning!" : "Ready to teach!"}</h3>
              <p>
                {isStudent
                  ? "Your school can add your class details, attendance and results here."
                  : "Your school can add your subject, classes and attendance tools here."}
              </p>
            </div>
          </section>

          <footer className="portal-footer">
            © {new Date().getFullYear()} MANIAR · School Management System
          </footer>
        </section>
      </main>
    </div>
  );
}

// MAIN APP
export default function App() {
  const [token, setToken] = useState(() =>
    localStorage.getItem("schoolToken")
  );

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("schoolUser") || "null");
    } catch {
      return null;
    }
  });

  const [activePage, setActivePage] = useState("dashboard");

  function handleLogin(newToken, newUser) {
    localStorage.setItem("schoolToken", newToken);
    localStorage.setItem("schoolUser", JSON.stringify(newUser));

    setToken(newToken);
    setUser(newUser);
  }

  function handleLogout() {
    localStorage.removeItem("schoolToken");
    localStorage.removeItem("schoolUser");

    setToken(null);
    setUser(null);
    setActivePage("dashboard");
  }

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  if (user?.role === "student" || user?.role === "teacher") {
    return <RoleDashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="app-layout">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        user={user}
        onLogout={handleLogout}
      />

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="topbar-label">SCHOOL PORTAL</span>
            <strong>Administration</strong>
          </div>

          <div className="topbar-user">
            <span className="online-dot" />
            <span>{user?.name || "Admin"}</span>
          </div>
        </header>

        <div className="page-content">
          {activePage === "dashboard" ? (
            <Dashboard onNavigate={setActivePage} />
          ) : modules[activePage] ? (
            <Manager key={activePage} moduleKey={activePage} user={user} />
          ) : (
            <div className="empty-state">Page not found.</div>
          )}
        </div>

        <footer className="app-footer">
          <span>
            © {new Date().getFullYear()} MANIAR School Management
          </span>
          <span>Built for better school administration</span>
        </footer>
      </main>
    </div>
  );
}
