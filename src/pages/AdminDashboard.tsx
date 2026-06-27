import { useEffect, useState } from "react";
import { useLocation } from "wouter";

const API_URL = window.location.hostname.includes("belvo.buzz")
  ? ""
  : "http://localhost:3001";

interface Registration {
  id: number;
  created_at: string;
  full_name: string;
  email: string;
  message: string;
  type: string;
}

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      navigate("/admin");
      return;
    }

    fetch(`${API_URL}/api/admin/registrations`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("admin_token");
          navigate("/admin");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.success) {
          setRegistrations(data.registrations);
        } else {
          setError("Failed to load registrations");
        }
      })
      .catch(() => setError("Connection error"))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin");
  };

  const parseMessage = (msg: string) => {
    const eventMatch = msg.match(/Registered for (.+) \(ID: (\d+)\) \| WhatsApp: (.+)/);
    if (eventMatch) {
      return { event: eventMatch[1], eventId: eventMatch[2], whatsapp: eventMatch[3] };
    }
    return { event: msg, eventId: "", whatsapp: "" };
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--belvo-bg)", padding: "32px 24px" }}>
      {/* Header */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "1.5rem",
              color: "var(--belvo-text-1)",
              margin: "0 0 4px",
            }}
          >
            Event Registrations
          </h1>
          <p style={{ color: "var(--belvo-text-3)", fontSize: "0.875rem", margin: 0 }}>
            {registrations.length} registration{registrations.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: "10px 20px",
            background: "rgba(255,255,255,0.06)",
            color: "var(--belvo-text-2)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "0.85rem",
            fontWeight: 500,
          }}
        >
          Logout
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--belvo-text-3)" }}>
          Loading registrations...
        </div>
      ) : error ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#ef4444" }}>{error}</div>
      ) : registrations.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--belvo-text-3)" }}>
          No registrations yet.
        </div>
      ) : (
        <div style={{ maxWidth: "1100px", margin: "0 auto", overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.875rem",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "rgba(255,255,255,0.04)",
                  color: "var(--belvo-text-2)",
                  textTransform: "uppercase",
                  fontSize: "0.75rem",
                  letterSpacing: "0.08em",
                }}
              >
                <th style={thStyle}>#</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>WhatsApp</th>
                <th style={thStyle}>Event</th>
                <th style={thStyle}>Registered At</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg, i) => {
                const { event, whatsapp } = parseMessage(reg.message);
                return (
                  <tr
                    key={reg.id}
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <td style={tdStyle}>{i + 1}</td>
                    <td style={{ ...tdStyle, fontWeight: 500, color: "var(--belvo-text-1)" }}>
                      {reg.full_name}
                    </td>
                    <td style={tdStyle}>
                      <a
                        href={`mailto:${reg.email}`}
                        style={{ color: "#9D4EDD", textDecoration: "none" }}
                      >
                        {reg.email}
                      </a>
                    </td>
                    <td style={tdStyle}>
                      <a
                        href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#9D4EDD", textDecoration: "none" }}
                      >
                        {whatsapp}
                      </a>
                    </td>
                    <td style={tdStyle}>{event}</td>
                    <td style={{ ...tdStyle, color: "var(--belvo-text-3)", fontSize: "0.8rem" }}>
                      {new Date(reg.created_at).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: "14px 16px",
  textAlign: "left",
  fontWeight: 500,
};

const tdStyle: React.CSSProperties = {
  padding: "14px 16px",
  color: "var(--belvo-text-2)",
  verticalAlign: "middle",
};
