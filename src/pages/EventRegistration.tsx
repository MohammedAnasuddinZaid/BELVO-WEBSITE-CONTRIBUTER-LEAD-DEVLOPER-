import { useState } from "react";
import { useLocation } from "wouter";
import { EVENTS } from "@/lib/events";

// In production (Vercel): /api/register goes to the serverless function
// In development: use local backend on port 3001
const API_URL = window.location.hostname.includes("belvo.buzz")
  ? ""
  : "http://localhost:3001";

export default function EventRegistration() {
  const [location, navigate] = useLocation();
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ name: string; eventTitle: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pathMatch = location.match(/^\/event-register\/(\d+)$/);
  const eventId = pathMatch ? Number(pathMatch[1]) : null;
  const event = EVENTS.find((item) => item.id === eventId);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-24" style={{ background: "var(--belvo-bg)" }}>
        <div style={{ maxWidth: "720px", width: "100%", textAlign: "center", color: "var(--belvo-text-1)" }}>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: "1rem" }}>Event not found</h1>
          <p style={{ color: "var(--belvo-text-3)", lineHeight: 1.8, marginBottom: "2rem" }}>
            The event you are trying to register for could not be found. Please return to the home page and try again.
          </p>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "linear-gradient(135deg, #7B2FBE, #9D4EDD)",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              padding: "14px 24px",
              cursor: "pointer",
              fontWeight: 700,
              letterSpacing: "0.08em",
            }}
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (eventSubmit: React.FormEvent<HTMLFormElement>) => {
    eventSubmit.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          name: form.name,
          email: form.email,
          whatsapp: form.whatsapp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccess({ name: form.name, eventTitle: event?.title || "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-24 px-4" style={{ background: "var(--belvo-bg)" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto", background: "var(--belvo-bg-card)", border: "1px solid var(--belvo-border-card)", borderRadius: "24px", padding: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", marginBottom: "32px", flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", letterSpacing: "0.26em", textTransform: "uppercase", color: "#9D4EDD" }}>
              Register Now
            </p>
            <h1 style={{ margin: "12px 0 0", fontFamily: "'Inter', sans-serif", fontSize: "clamp(2rem, 4vw, 2.8rem)", lineHeight: 1.05, color: "var(--belvo-text-1)" }}>
              {event.title}
            </h1>
            <p style={{ marginTop: "12px", color: "var(--belvo-text-3)", lineHeight: 1.8 }}>
              {event.description}
            </p>
          </div>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "transparent",
              border: "1px solid rgba(157,78,221,0.28)",
              color: "var(--belvo-text-1)",
              borderRadius: "12px",
              padding: "12px 20px",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Back to Events
          </button>
        </div>

        {success ? (
          <div style={{ textAlign: "center", padding: "40px 24px", borderRadius: "20px", background: "rgba(123,47,190,0.08)", border: "1px solid rgba(157,78,221,0.18)" }}>
            <h2 style={{ margin: 0, fontFamily: "'Inter', sans-serif", fontSize: "2rem", color: "#9D4EDD" }}>Registration Successful</h2>
            <p style={{ marginTop: "16px", color: "var(--belvo-text-3)", lineHeight: 1.8 }}>
              Thank you, {success.name}! Your registration for <strong>{success.eventTitle}</strong> is confirmed. We will contact you soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: "20px" }}>
            <label style={{ display: "grid", gap: "8px", color: "var(--belvo-text-1)", fontFamily: "'Inter', sans-serif" }}>
              Name
              <input
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                required
                placeholder="Enter your name"
                style={{ width: "100%", borderRadius: "14px", border: "1px solid var(--belvo-border-card)", padding: "14px 16px", background: "var(--belvo-bg)", color: "var(--belvo-text-1)" }}
              />
            </label>
            <label style={{ display: "grid", gap: "8px", color: "var(--belvo-text-1)", fontFamily: "'Inter', sans-serif" }}>
              Email
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                required
                placeholder="Enter your email"
                style={{ width: "100%", borderRadius: "14px", border: "1px solid var(--belvo-border-card)", padding: "14px 16px", background: "var(--belvo-bg)", color: "var(--belvo-text-1)" }}
              />
            </label>
            <label style={{ display: "grid", gap: "8px", color: "var(--belvo-text-1)", fontFamily: "'Inter', sans-serif" }}>
              WhatsApp Number
              <input
                value={form.whatsapp}
                onChange={(event) => setForm((prev) => ({ ...prev, whatsapp: event.target.value }))}
                required
                placeholder="Enter your WhatsApp number"
                style={{ width: "100%", borderRadius: "14px", border: "1px solid var(--belvo-border-card)", padding: "14px 16px", background: "var(--belvo-bg)", color: "var(--belvo-text-1)" }}
              />
            </label>

            {error && (
              <p style={{ color: "#ef4444", fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", textAlign: "center", margin: 0 }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? "rgba(123,47,190,0.5)" : "linear-gradient(135deg, #7B2FBE, #9D4EDD)",
                color: "#fff",
                border: "none",
                borderRadius: "14px",
                padding: "16px 18px",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                transition: "background 0.3s ease",
              }}
            >
              {loading ? "Submitting..." : "Register"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
