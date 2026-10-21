
// import { useState } from "react";
// import { apiRequest } from "../api";

// export default function Login({ onLogin }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const data = await apiRequest("/auth/login", {
//         method: "POST",
//         body: JSON.stringify({ email, password })
//       });

//       if (!data.token) {
//         throw new Error("Login response mein token nahi mila");
//       }

//       onLogin(data.token, data.user);
//     } catch (err) {
//       setError(err.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <main className="login-page">
//       <section className="login-visual">
//         <div className="login-visual-content">
//           <div className="brand-logo">S</div>
//           <p className="eyebrow">SMARTER SCHOOL MANAGEMENT</p>
//           <h1>Every student.<br />Every success.</h1>
//           <p className="login-description">
//             Manage students, teachers, attendance and school finances
//             from one simple dashboard.
//           </p>
//           <div className="visual-footer">A better way to run your school.</div>
//         </div>
//         <div className="decor-circle circle-one" />
//         <div className="decor-circle circle-two" />
//       </section>

//       <section className="login-form-side">
//         <form className="login-card" onSubmit={handleSubmit}>
//           <div className="login-mobile-logo brand-logo">S</div>
//           <p className="eyebrow">WELCOME BACK</p>
//           <h2>Sign in to your account</h2>
//           <p className="muted">Enter your school account details below.</p>

//           <label htmlFor="email">Email address</label>
//           <input
//             id="email"
//             type="email"
//             placeholder="admin@school.com"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />

//           <label htmlFor="password">Password</label>
//           <input
//             id="password"
//             type="password"
//             placeholder="Enter your password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />

//           {error && <div className="error-message">{error}</div>}

//           <button className="primary-btn login-btn" disabled={loading}>
//             {loading ? "Signing in..." : "Sign in →"}
//           </button>

//           <p className="login-note">
//             Secure access for authorized school staff.
//           </p>
//         </form>
//       </section>
//     </main>
//   );
// }


// new


import { useState } from "react";
import { apiRequest } from "../api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password, role })
      });

      if (!data.token) {
        throw new Error("Login response mein token nahi mila");
      }

      onLogin(data.token, data.user);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-visual">
        <div className="login-visual-content">
          <div className="brand-logo">M</div>
          <p className="eyebrow">MANIAR SCHOOL MANAGEMENT</p>
          <h1>Every student.<br />Every success.</h1>
          <p className="login-description">
            Manage students, teachers, attendance and school finances
            from one simple dashboard.
          </p>
          <div className="visual-footer">
            A better way to run your school.
          </div>
        </div>
        <div className="decor-circle circle-one" />
        <div className="decor-circle circle-two" />
      </section>

      <section className="login-form-side">
        <form className="login-card" onSubmit={handleSubmit}>
          <div className="login-mobile-logo brand-logo">M</div>
          <p className="eyebrow">WELCOME BACK</p>
          <h2>Sign in to your account</h2>
          <p className="muted">
            Enter your school account details below.
          </p>

          <label htmlFor="role">Login as</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>

          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <div className="error-message">{error}</div>}

          <button className="primary-btn login-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign in →"}
          </button>

          <p className="login-note">
            Secure access for authorized school users.
          </p>
        </form>
      </section>
    </main>
  );
}
