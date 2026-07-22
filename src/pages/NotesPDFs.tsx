import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ArrowLeft, FileText, Clock, BookOpen, Zap, GitBranch, Code, Cpu, Layers, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";

const pdfData = [
  {
    file: "ClaudeAI Notes.pdf",
    title: "ClaudeAI Notes",
    category: "AI & Machine Learning",
    author: "Claude AI",
    date: "March 2026",
    size: "2.1 MB",
    pages: "15 pages",
    tags: ["Claude AI", "Prompt Engineering", "AI"],
    icon: Cpu,
  },
  {
    file: "ClaudeAI Notes (1).pdf",
    title: "ClaudeAI Notes (Extended)",
    category: "AI & Machine Learning",
    author: "Claude AI",
    date: "March 2026",
    size: "2.3 MB",
    pages: "18 pages",
    tags: ["Claude AI", "Advanced Prompts", "Workflows"],
    icon: Zap,
  },
  {
    file: "Git and GitHub Notes.pdf",
    title: "Git and GitHub Notes",
    category: "Version Control",
    author: "GitHub Education",
    date: "February 2026",
    size: "1.8 MB",
    pages: "12 pages",
    tags: ["Git", "GitHub", "Version Control"],
    icon: GitBranch,
  },
  {
    file: "Java_Complete_Guide-1.pdf",
    title: "Java Complete Guide",
    category: "Programming Languages",
    author: "Java Documentation",
    date: "January 2026",
    size: "8.5 MB",
    pages: "45 pages",
    tags: ["Java", "OOP", "Collections"],
    icon: Code,
  },
];

export default function NotesPDFs() {
  const [search, setSearch] = useState("");

  const filtered = pdfData.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f8f6fc", fontFamily: "'Inter',sans-serif" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "48px 24px 80px" }}>
        <Link href="/careers">
          <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", cursor: "pointer", color: "#7B2FBE", fontSize: "0.85rem", fontWeight: 500, marginBottom: "24px" }}>
            <ArrowLeft size={16} /> Back to Careers
          </span>
        </Link>

        <div style={{ marginBottom: "12px" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9D4EDD" }}>
            Study Resources
          </span>
        </div>
        <h1 style={{ fontSize: "2.4rem", fontWeight: 800, color: "#1a1a1a", margin: "0 0 6px", lineHeight: 1.15 }}>
          PDF Notes Library
        </h1>
        <p style={{ fontSize: "0.92rem", color: "#666", margin: "0 0 32px" }}>
          Comprehensive study materials for Operating Systems
        </p>

        <div style={{ position: "relative", marginBottom: "36px" }}>
          <Search size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#999", pointerEvents: "none" }} />
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "14px 16px 14px 48px",
              border: "1px solid rgba(157,78,221,0.2)", borderRadius: "12px",
              fontSize: "0.92rem", outline: "none", background: "#ffffff",
              color: "#333", boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {filtered.map((pdf, i) => {
            const Icon = pdf.icon;
            return (
              <motion.div
                key={pdf.file}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                style={{
                  background: "#ffffff",
                  border: "1px solid rgba(157,78,221,0.12)",
                  borderRadius: "16px",
                  padding: "24px",
                  transition: "box-shadow 0.25s, transform 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(157,78,221,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                  <div style={{
                    width: "52px", height: "52px", borderRadius: "14px",
                    background: "linear-gradient(135deg, rgba(157,78,221,0.1), rgba(123,47,190,0.06))",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <Icon size={24} color="#9D4EDD" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", flexWrap: "wrap" }}>
                      <div>
                        <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#1a1a1a", margin: "0 0 4px" }}>{pdf.title}</h3>
                        <span style={{ fontSize: "0.78rem", color: "#9D4EDD", fontWeight: 500 }}>{pdf.category}</span>
                      </div>
                      <a
                        href={`/notes/pdfs/${pdf.file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex", alignItems: "center", gap: "6px",
                          padding: "8px 18px", background: "linear-gradient(135deg,#7B2FBE,#9D4EDD)",
                          border: "none", borderRadius: "8px", color: "#ffffff",
                          fontSize: "0.78rem", fontWeight: 600, cursor: "pointer",
                          textDecoration: "none", whiteSpace: "nowrap",
                        }}
                      >
                        Open Notes <ArrowUpRight size={13} strokeWidth={2.5} />
                      </a>
                    </div>
                    <div style={{ display: "flex", gap: "16px", marginTop: "10px", flexWrap: "wrap" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "0.75rem", color: "#888" }}>
                        <BookOpen size={13} /> {pdf.author}
                      </span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "0.75rem", color: "#888" }}>
                        <Clock size={13} /> {pdf.date}
                      </span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "0.75rem", color: "#888" }}>
                        <FileText size={13} /> {pdf.size}
                      </span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "0.75rem", color: "#888" }}>
                        <Layers size={13} /> {pdf.pages}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "6px", marginTop: "10px", flexWrap: "wrap" }}>
                      {pdf.tags.map(tag => (
                        <span key={tag} style={{
                          padding: "3px 10px", borderRadius: "100px",
                          background: "rgba(157,78,221,0.07)",
                          color: "#7B2FBE", fontSize: "0.7rem", fontWeight: 500,
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#999", fontSize: "0.9rem" }}>
            No notes found for "{search}"
          </div>
        )}

        <div style={{ marginTop: "60px", paddingTop: "24px", borderTop: "1px solid rgba(157,78,221,0.1)", textAlign: "center" }}>
          <p style={{ fontSize: "0.78rem", color: "#aaa", margin: 0 }}>
            &copy; 2026 PDF Notes Library. v1.0
          </p>
        </div>
      </div>
    </div>
  );
}
