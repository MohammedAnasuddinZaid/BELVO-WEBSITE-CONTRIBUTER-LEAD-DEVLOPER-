import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const TEAMS = [
  {
    id: "web",
    name: "Web Development Team",
    accent: "#7B2FBE",
    members: ["Sri", "Lokesh", "Akhil", "Harsh", "Saurav", "Mohammad Anasuddin Zaid", "Ishvari", "Gaurav", "Sandali"],
    cards: [
      { title: "Brand Website",      tag: "UI / Web",    gradient: "linear-gradient(135deg, rgba(80,20,160,0.55) 0%, rgba(20,5,50,0.95) 100%)" },
      { title: "E-Commerce Platform", tag: "Full-Stack",  gradient: "linear-gradient(135deg, rgba(60,10,130,0.55) 0%, rgba(10,2,35,0.95) 100%)" },
      { title: "SaaS Dashboard",      tag: "Product",     gradient: "linear-gradient(135deg, rgba(100,30,180,0.55) 0%, rgba(25,5,60,0.95) 100%)" },
    ],
  },
  {
    id: "app",
    name: "App Development Team",
    accent: "#9D4EDD",
    members: ["Anand", "Anshika", "Aryan", "Chetan", "Chitti", "Navin Kumar", "Navin J.D"],
    cards: [
      { title: "Lifestyle App",   tag: "iOS / Android", gradient: "linear-gradient(135deg, rgba(90,25,170,0.55) 0%, rgba(15,3,45,0.95) 100%)" },
      { title: "Fitness Tracker", tag: "Mobile",         gradient: "linear-gradient(135deg, rgba(70,15,140,0.55) 0%, rgba(12,2,38,0.95) 100%)" },
      { title: "Fintech App",     tag: "React Native",   gradient: "linear-gradient(135deg, rgba(110,35,190,0.55) 0%, rgba(28,6,68,0.95) 100%)" },
    ],
  },
  {
    id: "analyst",
    name: "Business Analyst / Data Analyst Team",
    accent: "#B06AE8",
    members: ["Ishika", "Sibi Jain", "Saurav", "Sasi", "Obed"],
    cards: [
      { title: "Market Research Report", tag: "Analytics",  gradient: "linear-gradient(135deg, rgba(85,22,162,0.55) 0%, rgba(18,4,48,0.95) 100%)" },
      { title: "Growth Strategy Deck",   tag: "Strategy",   gradient: "linear-gradient(135deg, rgba(65,12,125,0.55) 0%, rgba(10,2,32,0.95) 100%)" },
      { title: "KPI Dashboard",          tag: "Data Viz",   gradient: "linear-gradient(135deg, rgba(105,28,180,0.55) 0%, rgba(24,5,58,0.95) 100%)" },
    ],
  },
  {
    id: "admin",
    name: "Administrator",
    accent: "#C9A341",
    members: ["Mohammad Ali"],
    cards: [
      { title: "Operations Hub", tag: "Management", gradient: "linear-gradient(135deg, rgba(90,60,10,0.45) 0%, rgba(10,5,2,0.95) 100%)" },
    ],
  },
] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

function ProjectCard({ title, tag, gradient, accent, inView, i }: {
  title: string; tag: string; gradient: string; accent: string; inView: boolean; i: number;
}) {
  return (
    <motion.div
      custom={i} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
      whileHover={{ y: -6, transition: { duration: 0.22, ease: "easeOut" } }}
      style={{
        background: "var(--belvo-bg-card)",
        border: "1px solid var(--belvo-border-card)",
        borderRadius: "14px", overflow: "hidden",
        transition: "border-color 0.3s, box-shadow 0.3s",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = `${accent}55`;
        el.style.boxShadow = `0 12px 48px rgba(80,10,150,0.22)`;
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "var(--belvo-border-card)";
        el.style.boxShadow = "none";
      }}
    >
      {/* Thumbnail */}
      <div style={{ height: "160px", background: gradient, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "80px", height: "80px", background: `radial-gradient(ellipse at center, ${accent}30, transparent 70%)`, filter: "blur(20px)" }} />
        <div style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(4,0,14,0.7)", border: `1px solid ${accent}40`, borderRadius: "100px", padding: "3px 10px", fontFamily: "'Inter',sans-serif", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: accent, backdropFilter: "blur(8px)" }}>
          Coming Soon
        </div>
        <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: `${accent}20`, border: `1px solid ${accent}30`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="7" height="7" rx="1.5" stroke={accent} strokeWidth="1.5" strokeOpacity="0.7"/>
            <rect x="14" y="3" width="7" height="7" rx="1.5" stroke={accent} strokeWidth="1.5" strokeOpacity="0.7"/>
            <rect x="3" y="14" width="7" height="7" rx="1.5" stroke={accent} strokeWidth="1.5" strokeOpacity="0.7"/>
            <rect x="14" y="14" width="7" height="7" rx="1.5" stroke={accent} strokeWidth="1.5" strokeOpacity="0.7"/>
          </svg>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "18px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", marginBottom: "6px" }}>
          <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "var(--belvo-text-1)", letterSpacing: "-0.01em" }}>{title}</span>
          <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: accent, background: `${accent}15`, border: `1px solid ${accent}30`, borderRadius: "100px", padding: "2px 8px", whiteSpace: "nowrap" }}>{tag}</span>
        </div>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "0.8rem", color: "var(--belvo-text-3)", margin: 0, lineHeight: 1.6 }}>
          Placeholder — real project coming soon.
        </p>
      </div>
    </motion.div>
  );
}

function TeamSection({ team, globalIndex }: { team: typeof TEAMS[number]; globalIndex: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} style={{ marginBottom: "72px" }}>
      <motion.div
        custom={0} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
        style={{ marginBottom: "24px" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
          <div style={{ width: "3px", height: "24px", background: `linear-gradient(180deg, ${team.accent}, transparent)`, borderRadius: "2px", flexShrink: 0 }} />
          <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: "clamp(1rem,2.5vw,1.25rem)", color: "var(--belvo-text-1)", margin: 0, letterSpacing: "-0.01em" }}>
            {team.name}
          </h3>
          <div style={{ height: "1px", flex: 1, background: `linear-gradient(90deg, ${team.accent}30, transparent)` }} />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
          {team.members.map(m => (
            <span key={m} style={{ fontFamily: "'Inter',sans-serif", fontSize: "0.72rem", fontWeight: 500, color: "var(--belvo-text-2)", background: "var(--belvo-bg-card)", border: `1px solid ${team.accent}25`, borderRadius: "100px", padding: "4px 12px", letterSpacing: "0.02em" }}>
              {m}
            </span>
          ))}
        </div>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "18px" }}>
        {team.cards.map((card, i) => (
          <ProjectCard
            key={card.title} title={card.title} tag={card.tag}
            gradient={card.gradient} accent={team.accent}
            inView={inView} i={i + 1 + globalIndex}
          />
        ))}
      </div>
    </div>
  );
}

export default function Works() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <section
      id="works"
      style={{ background: "var(--belvo-bg)", position: "relative", overflow: "hidden", padding: "100px 24px 120px" }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, var(--belvo-border-divider), rgba(201,163,65,0.2), transparent)" }} />
      <div style={{ position: "absolute", top: "0", left: "50%", transform: "translateX(-50%)", width: "80vw", height: "500px", background: "radial-gradient(ellipse at center, var(--belvo-glow-blob) 0%, transparent 65%)", filter: "blur(70px)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div ref={headerRef} style={{ textAlign: "center", marginBottom: "80px" }}>
          <motion.span custom={0} variants={fadeUp} initial="hidden" animate={headerInView ? "visible" : "hidden"}
            style={{ display: "block", fontFamily: "'Inter',sans-serif", fontSize: "0.68rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "#9D4EDD", marginBottom: "14px" }}>
            Portfolio
          </motion.span>
          <motion.h2 custom={1} variants={fadeUp} initial="hidden" animate={headerInView ? "visible" : "hidden"}
            style={{ fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: "clamp(2rem,5vw,3.8rem)", lineHeight: 1.05, color: "var(--belvo-text-1)", margin: "0 0 16px", letterSpacing: "-0.01em" }}>
            Best Pick From{" "}<span style={{ color: "#9D4EDD" }}>Each Domain</span>
          </motion.h2>
          <motion.p custom={2} variants={fadeUp} initial="hidden" animate={headerInView ? "visible" : "hidden"}
            style={{ fontFamily: "'Inter',sans-serif", fontSize: "0.95rem", lineHeight: 1.75, color: "var(--belvo-text-3)", maxWidth: "480px", margin: "0 auto", letterSpacing: "0.01em" }}>
            Showcasing BELVO's best work across every team. Real portfolio assets coming soon.
          </motion.p>
        </div>

        {TEAMS.map((team, i) => (
          <TeamSection key={team.id} team={team} globalIndex={i * 3} />
        ))}
      </div>
    </section>
  );
}
