import { Link, Route, Routes, Navigate } from "react-router-dom";
// import Dashboard from "../pages/dashboard/Dashboard";
// import Login from "../pages/auth/Login";

export default function App() {
  return (
    <div style={{ maxWidth: 960, margin: "40px auto", padding: "0 16px" }}>
      <header style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{ width: 32, height: 32, borderRadius: 12, background: "#4f46e5" }} />
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>Medicos Portal</h1>
        <nav style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/login">Login</Link>
        </nav>
      </header>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <Routes>
          <Route index element={<Home />} />
          {/* <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} /> */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

function Home() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>It works 🎉</h2>
      <p>You are running Vite on <code>http://localhost:5173</code>.</p>
      <p style={{ marginTop: 12 }}>
        Next: visit the <Link to="/dashboard">Dashboard</Link> or{" "}
        <Link to="/login">Login</Link>.
      </p>
    </div>
  );
}
