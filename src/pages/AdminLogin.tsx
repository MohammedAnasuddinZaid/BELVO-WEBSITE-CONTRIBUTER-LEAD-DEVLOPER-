import { useState } from "react";
import { useLocation } from "wouter";

const API_URL = window.location.hostname.includes("belvo.buzz")
  ? ""
  : "http://localhost:3001";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [, navigate] = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (data.success && data.token) {
        localStorage.setItem("admin_token", data.token);
        navigate("/admin/dashboard");
      } else {
        setError("Invalid password");
      }
    } catch {
      setError("Connection error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "var(--belvo-bg)" }}>
      <div
        style={{
          maxWidth: "400px",
          width: "100%",
          background: "rgba(255,255,255,0.03)",
          borderRadius: "16px",
          padding: "40px 32px",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "1.5rem",
              color: "var(--belvo-text-1)",
              marginBottom: "8px",
            }}
          >
            Admin Login
          </h1>
          <p style={{ color: "var(--belvo-text-3)", fontSize: "0.875rem", lineHeight: 1.6 }}>
            Enter the admin password to access registration data.
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "20px" }}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              autoFocus
              style={{
                width: "100%",
                padding: "14px 16px",
                background: "rgba(255,255,255,0.05)",
                border: error ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                color: "var(--belvo-text-1)",
                fontSize: "0.95rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            {error && (
              <p style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "8px" }}>{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: "linear-gradient(135deg, #7B2FBE, #9D4EDD)",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontSize: "0.95rem",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
