import { useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle2, ArrowLeft } from "lucide-react";

// In production (Vercel): /api/tools-register goes to the serverless function
// In development: use local backend on port 3001
const API_URL = window.location.hostname.includes("belvo.buzz")
    ? ""
    : "http://localhost:3001";

export default function ToolRegister() {
    const [, navigate] = useLocation();

    const params = new URLSearchParams(window.location.search);
    const toolId = params.get("toolId") || "";

    const TOOL_DETAILS: Record<
        string,
        {
            name: string;
            plan: string;
            price: string;
        }
    > = {
        "canva-pro-2-months": {
            name: "Canva Pro",
            plan: "2 Months",
            price: "₹167",
        },
        "canva-pro-1-year": {
            name: "Canva Pro",
            plan: "1 Year",
            price: "₹1,000",
        },
        "canva-pro-4-years": {
            name: "Canva Pro",
            plan: "4 Years",
            price: "₹2,500",
        },
        "canva-lifetime": {
            name: "Canva Lifetime",
            plan: "Lifetime",
            price: "₹4,999",
        },
        "adobe-creative-cloud": {
            name: "Adobe Creative Cloud",
            plan: "Standard",
            price: "₹10,000",
        },
        "chatgpt-plus-monthly": {
            name: "ChatGPT Plus",
            plan: "Monthly",
            price: "₹1,500",
        },
        "claude-clickup-monthly": {
            name: "Claude (ClickUp)",
            plan: "Monthly",
            price: "₹999",
        },
        "netflix-shared-monthly": {
            name: "Netflix Shared",
            plan: "Monthly",
            price: "₹499",
        },
        "coursera-plus-1-year": {
            name: "Coursera Plus",
            plan: "1 Year",
            price: "₹4,999",
        },
        "gemini-ai-1-year": {
            name: "Gemini AI",
            plan: "1 Year",
            price: "₹4,999",
        },
        "amazon-prime-1-year": {
            name: "Amazon Prime",
            plan: "1 Year",
            price: "₹499",
        },
        "youtube-premium-monthly": {
            name: "YouTube Premium",
            plan: "Monthly",
            price: "₹299",
        },
    };

    const selectedTool = TOOL_DETAILS[toolId];

    console.log("Current search:", window.location.search);
    console.log("toolId:", toolId);
    console.log("selectedTool:", selectedTool);

    const tool = selectedTool?.name || "";
    const plan = selectedTool?.plan || "";
    const price = selectedTool?.price || "";

    const [form, setForm] = useState({
        name: "",
        email: "",
        whatsapp: "",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!toolId || !selectedTool) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6 py-24" style={{ background: "var(--belvo-bg)" }}>
                <div style={{ maxWidth: "720px", width: "100%", textAlign: "center", color: "var(--belvo-text-1)" }}>
                    <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: "1rem" }}>
                        No tool selected
                    </h1>
                    <p style={{ color: "var(--belvo-text-3)", lineHeight: 1.8, marginBottom: "2rem" }}>
                        Please go back to the Tools page and choose a plan to continue.
                    </p>
                    <button onClick={() => navigate("/tools")} style={primaryBtnStyle}>
                        Back to Tools
                    </button>
                </div>
            </div>
        );
    }

    const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${API_URL}/api/tools-register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    toolId,
                    name: form.name,
                    email: form.email,
                    whatsapp: form.whatsapp,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Registration failed");
            }

            setSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6 py-24" style={{ background: "var(--belvo-bg)" }}>
                <div
                    style={{
                        maxWidth: "560px",
                        width: "100%",
                        textAlign: "center",
                        background: "var(--belvo-bg-card)",
                        border: "1px solid var(--belvo-border-card)",
                        borderRadius: "24px",
                        padding: "48px 32px",
                    }}
                >
                    <div
                        style={{
                            width: "64px",
                            height: "64px",
                            borderRadius: "50%",
                            background: "rgba(157,78,221,0.12)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 24px",
                        }}
                    >
                        <CheckCircle2 size={32} color="#9D4EDD" strokeWidth={2} />
                    </div>

                    <h1
                        style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 800,
                            fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                            color: "var(--belvo-text-1)",
                            margin: "0 0 12px",
                        }}
                    >
                        Thank you for registering!
                    </h1>

                    <p style={{ color: "var(--belvo-text-6)", lineHeight: 1.8, margin: "0 0 8px", fontSize: "0.95rem" }}>
                        We've received your request for <strong style={{ color: "var(--belvo-text-1)" }}>{tool}</strong>
                        {plan ? ` (${plan})` : ""}.
                    </p>
                    <p style={{ color: "var(--belvo-text-6)", lineHeight: 1.8, margin: "0 0 32px", fontSize: "0.95rem" }}>
                        Our team will contact you shortly on the email or WhatsApp number you provided to complete
                        your access.
                    </p>

                    <button onClick={() => navigate("/")} style={primaryBtnStyle}>
                        <ArrowLeft size={16} strokeWidth={2.5} style={{ marginRight: "8px" }} />
                        Return to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-24 px-4" style={{ background: "var(--belvo-bg)" }}>
            <div
                style={{
                    maxWidth: "560px",
                    margin: "0 auto",
                    background: "var(--belvo-bg-card)",
                    border: "1px solid var(--belvo-border-card)",
                    borderRadius: "24px",
                    padding: "32px",
                }}
            >
                <div style={{ marginBottom: "32px" }}>
                    <p
                        style={{
                            margin: 0,
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "0.78rem",
                            letterSpacing: "0.26em",
                            textTransform: "uppercase",
                            color: "#9D4EDD",
                        }}
                    >
                        Get Access
                    </p>
                    <h1
                        style={{
                            margin: "12px 0 0",
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
                            lineHeight: 1.1,
                            color: "var(--belvo-text-1)",
                        }}
                    >
                        {tool}
                    </h1>
                    {(plan || price) && (
                        <p style={{ margin: "8px 0 0", color: "var(--belvo-text-6)", fontSize: "0.9rem" }}>
                            {plan}
                            {plan && price ? " · " : ""}
                            {price}
                        </p>
                    )}
                    <p style={{ margin: "16px 0 0", color: "var(--belvo-text-6)", fontSize: "0.9rem", lineHeight: 1.7 }}>
                        Fill in your details below and our team will reach out to set up your access.
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                    <div>
                        <label style={labelStyle}>Full Name</label>
                        <input
                            required
                            type="text"
                            value={form.name}
                            onChange={handleChange("name")}
                            placeholder="Your full name"
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Email</label>
                        <input
                            required
                            type="email"
                            value={form.email}
                            onChange={handleChange("email")}
                            placeholder="you@example.com"
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>WhatsApp Number</label>
                        <input
                            required
                            type="tel"
                            value={form.whatsapp}
                            onChange={handleChange("whatsapp")}
                            placeholder="+91 98765 43210"
                            style={inputStyle}
                        />
                    </div>

                    {error && (
                        <p style={{ color: "#ff6b6b", fontSize: "0.85rem", margin: 0 }}>{error}</p>
                    )}

                    <div style={{ display: "flex", gap: "12px", marginTop: "8px", flexWrap: "wrap" }}>
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            style={{ ...secondaryBtnStyle, flex: "1 1 auto" }}
                        >
                            <ArrowLeft size={16} strokeWidth={2.5} style={{ marginRight: "8px" }} />
                            Return to Home
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{ ...primaryBtnStyle, flex: "1 1 auto", opacity: loading ? 0.7 : 1 }}
                        >
                            {loading ? "Submitting..." : "Submit Request"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.78rem",
    fontWeight: 600,
    color: "var(--belvo-text-3)",
    marginBottom: "6px",
    letterSpacing: "0.04em",
};

const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid var(--belvo-border-card)",
    background: "var(--belvo-bg)",
    color: "var(--belvo-text-1)",
    fontFamily: "'Inter', sans-serif",
    fontSize: "0.9rem",
    outline: "none",
};

const primaryBtnStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #7B2FBE, #9D4EDD)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "14px 24px",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    fontWeight: 700,
    fontSize: "0.85rem",
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
};

const secondaryBtnStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    color: "var(--belvo-text-1)",
    border: "1px solid var(--belvo-border-card)",
    borderRadius: "12px",
    padding: "14px 24px",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    fontWeight: 700,
    fontSize: "0.85rem",
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
};