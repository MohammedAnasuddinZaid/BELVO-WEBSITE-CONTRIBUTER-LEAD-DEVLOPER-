import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const easeSmooth = [0.22, 1, 0.36, 1] as const;

const imageModules = import.meta.glob<{ default: string }>("/src/Collective/*", { eager: true, import: "default" });

const IMAGE_MAP: Record<string, string> = {};
Object.entries(imageModules).forEach(([path, url]) => {
  const name = path.split("/").pop()!.replace(/\.[^.]+$/, "").toLowerCase();
  IMAGE_MAP[name] = url;
});

const NAME_OVERRIDES: Record<string, string> = {
  "ramnath": "ram nath",
  "ram nath g k": "ram nath",
  "saurav": "sourav",
  "sharfudeen": "sharfu",
  "sheth yamani": "yamini",
  "naveen k d": "naveen kumar",
  "mohammad anasuddin zaid": "mohammed anasuddin zaid",
  "lokesh": "lokesh2",
};

function getImageUrl(memberName: string): string | undefined {
  const key = memberName.toLowerCase().trim();
  const override = NAME_OVERRIDES[key];
  if (override && IMAGE_MAP[override]) return IMAGE_MAP[override];
  const BLOCKED = new Set(["naveen kumar"]);
  if (!BLOCKED.has(key) && IMAGE_MAP[key]) return IMAGE_MAP[key];
  const firstName = key.split(/\s+/)[0];
  if (!BLOCKED.has(firstName) && IMAGE_MAP[firstName]) return IMAGE_MAP[firstName];
  const lastName = key.split(/\s+/).pop()!;
  if (!BLOCKED.has(lastName) && IMAGE_MAP[lastName]) return IMAGE_MAP[lastName];
  const fuzzy = Object.keys(IMAGE_MAP).find(k => !BLOCKED.has(k) && (key.includes(k) || k.includes(key)));
  if (fuzzy) return IMAGE_MAP[fuzzy];
  return undefined;
}

// ─── DATA ───────────────────────────────────────────────────────────────────

const CEO = {
  name: "Hrishikesh Mishra",
  title: "Founder & CEO",
  tagline:
    "Building BELVO to deliver world-class digital solutions — one idea, one team, one product at a time.",
};

const TEAMS = [
  {
    id: "web",
    name: "Web Development",
    color: "#7B2FBE",
    lightColor: "#9D4EDD",
    members: [
      "Lokesh", "Sri Satya", "Akhil",
      "Mohammad Anasuddin Zaid", "Ishwari",
      "Sandali", "Tamil Selvan", "Ram Nath G K",
      "Guru dutt", "Shailender",
    ],
  },
  {
    id: "app",
    name: "App Development",
    color: "#7B2FBE",
    lightColor: "#9D4EDD",
    members: ["Anand", "Anshika Srivastava", "Aaryan", "Suhani", "Aditya", "Naveen Kumar", "Naveen K D"],
  },
  {
    id: "cyber",
    name: "Cyber Security",
    color: "#7B2FBE",
    lightColor: "#9D4EDD",
    members: ["Harsh", "Sourav", "Parv"],
  },
  {
    id: "analytics",
    name: "Business & Data Analytics",
    color: "#7B2FBE",
    lightColor: "#9D4EDD",
    members: ["Ishika", "Obed", "Sasikumar", "Sharfudeen", "Sibijan"],
  },
  {
    id: "Graphic",
    name: "Graphic Designing",
    color: "#7B2FBE",
    lightColor: "#9D4EDD",
    members: ["Anurag khushwaha", "Rimi gosh", "Sanskruti akare", "Deepak Sharma"],
  },
  {
    id: "hr",
    name: "Human Resource",
    color: "#7B2FBE",
    lightColor: "#9D4EDD",
    members: ["Raavula Vaibhav", "Mohammad Anasuddin Zaid", "Mohd Usaid Ali Khan"],
    responsibilities: ["HR"],
  },
  {
    id: "admin",
    name: "Administration",
    color: "#007BFF",
    lightColor: "#0056b3",
    members: ["Mohammad Ali"],
    responsibilities: ["Operations", "Team Coordination", "Client Communication", "Internal Management"] as readonly string[],
  },
  {
    id: "coadmin",
    name: "Co-Administration",
    color: "#007BFF",
    lightColor: "#0056b3",
    members: ["Achintya Gurba "],
    responsibilities: ["Operations", "Team Coordination", "Client Communication", "Internal Management"] as readonly string[],

  },
  {
    id: "content",
    name: "Content Writer",
    color: "#7B2FBE",
    lightColor: "#9D4EDD",
    members: ["Sheth Yamani"],
  }

] as const;

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: i * 0.15, ease: easeSmooth },
  }),
};

// ─── CEO CARD ────────────────────────────────────────────────────────────────

function CeoCard({ inView }: { inView: boolean }) {
  const initials = getInitials(CEO.name);
  const gold = "#C9A341";
  const ceoImg = getImageUrl(CEO.name);

  return (
    <motion.div
      custom={3}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: "80px",
      }}
    >
      <motion.div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "48px",
          maxWidth: "680px",
          width: "100%",
          padding: "48px 56px",
          background: "var(--belvo-bg-card)",
          border: `1px solid ${gold}44`,
          borderRadius: "20px",
          position: "relative",
          overflow: "hidden",
          backdropFilter: "blur(14px)",
          boxShadow: `0 0 0 1px ${gold}22, inset 0 1px 0 rgba(255,255,255,0.06)`,
        }}
      >
        {/* top-right ambient glow - Updated to gold */}
        <div style={{
          position: "absolute", top: -60, right: -60,
          width: 220, height: 220, borderRadius: "50%",
          background: `radial-gradient(ellipse, ${gold}22, transparent 70%)`,
          pointerEvents: "none",
        }} />

        {/* avatar */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <motion.div
            style={{
              position: "absolute", inset: -8, borderRadius: "50%",
              border: `1.5px solid ${gold}44`,
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            style={{
              position: "absolute", inset: -16, borderRadius: "50%",
              border: `0.5px dashed ${gold}44`,
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            style={{
              position: "absolute", inset: -24, borderRadius: "50%",
              border: `1px solid ${gold}22`,
              opacity: 0.5,
            }}
            animate={{ rotate: 360, scale: [1, 1.05, 1] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />

          {/* Avatar Background - Gold gradient */}
          <motion.div
            style={{
              width: 120, height: 120, borderRadius: "50%",
              background: ceoImg ? "none" : "linear-gradient(135deg, #C9A341, #E0B84A)",
              border: `2px solid ${gold}66`,
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative", zIndex: 1, overflow: "hidden",
              boxShadow: `0 0 30px ${gold}33`,
            }}
            animate={{ boxShadow: [`0 0 20px ${gold}22`, `0 0 40px ${gold}44`, `0 0 20px ${gold}22`] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            {ceoImg ? (
              <motion.img
                src={ceoImg} alt={CEO.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              />
            ) : (
              <>
                <div style={{
                  position: "absolute", inset: 4, borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.3)",
                }} />
                <span style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 800, fontSize: "2rem", color: "#fff",
                  letterSpacing: "-0.02em", position: "relative", zIndex: 1,
                }}>{initials}</span>
              </>
            )}
          </motion.div>

          {/* Gold status dot */}
          <div style={{
            position: "absolute", bottom: 6, right: 6,
            width: 18, height: 18, borderRadius: "50%",
            background: "linear-gradient(135deg, #C9A341, #E0B84A)",
            border: "2.5px solid var(--belvo-bg)",
            boxShadow: `0 0 10px ${gold}66`,
            zIndex: 2,
          }} />
        </div>

        {/* info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* CEO badge - Gold */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: `${gold}15`,
            border: `0.5px solid ${gold}55`,
            borderRadius: "100px", padding: "4px 14px",
            marginBottom: 10,
          }}>
            <svg width={11} height={11} viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M10 2l2.3 5H17l-3.9 3 1.4 5.3L10 12.5 5.5 15.3l1.4-5.3L3 7h4.7z" fill={gold} />
            </svg>
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.62rem", fontWeight: 600,
              letterSpacing: "0.2em", textTransform: "uppercase",
              color: gold,
            }}>Chief Executive Officer</span>
          </div>

          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 800, fontSize: "1.6rem",
            color: "var(--belvo-text-1)", letterSpacing: "-0.02em",
            marginBottom: 4, lineHeight: 1.1,
          }}>
            {CEO.name}
            <span style={{ color: "var(--belvo-text-3)", fontWeight: 400, fontSize: "1rem" }}>
              {" "}— Founder & CEO
            </span>
          </div>

          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.8rem", color: "var(--belvo-text-3)", marginBottom: 18,
          }}>BELVO · Visionary · Builder</div>

          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.88rem", color: "var(--belvo-text-2)",
            lineHeight: 1.7, fontStyle: "italic",
            borderLeft: `2px solid ${gold}66`,
            paddingLeft: 14,
          }}>
            {CEO.tagline}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}


// ─── MEMBER CARD ─────────────────────────────────────────────────────────────

function MemberCard({
  name, team, color, lightColor, responsibilities, inView, index,
}: {
  name: string; team: string; color: string; lightColor: string;
  responsibilities?: readonly string[]; inView: boolean; index: number;
}) {
  const initials = getInitials(name);
  const img = getImageUrl(name);
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={cardRef}
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "28px 20px 24px",
        background: "var(--belvo-bg-card)",
        border: "1px solid var(--belvo-border-card)",
        borderRadius: "18px",
        cursor: "default", position: "relative", overflow: "hidden",
        backdropFilter: "blur(14px)",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: 80, height: 40,
        background: `radial-gradient(ellipse at center, ${color}25, transparent 70%)`,
        filter: "blur(12px)", pointerEvents: "none",
      }} />

      <div style={{ position: "relative", marginBottom: 16 }}>
        <motion.div
          style={{
            width: 84, height: 84, borderRadius: "50%",
            background: img ? "none" : `linear-gradient(135deg, ${color}cc, ${lightColor}88)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: `2px solid ${color}44`,
            boxShadow: `0 0 28px ${color}22`,
            position: "relative", overflow: "hidden",
          }}
          animate={{ boxShadow: [`0 0 20px ${color}22`, `0 0 35px ${color}44`, `0 0 20px ${color}22`] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.1 }}
        >
          {img ? (
            <img src={img} alt={name}
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
            />
          ) : (
            <>
              <div style={{
                position: "absolute", inset: 4, borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.15)",
              }} />
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 800, fontSize: "1.35rem", color: "#fff",
                letterSpacing: "-0.02em", position: "relative", zIndex: 1,
              }}>{initials}</span>
            </>
          )}
        </motion.div>
        <motion.div
          style={{
            position: "absolute", bottom: 4, right: 4,
            width: 14, height: 14, borderRadius: "50%",
            background: `linear-gradient(135deg, ${color}, ${lightColor})`,
            border: "2.5px solid var(--belvo-bg)",
            boxShadow: `0 0 10px ${color}80`,
          }}
          animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.15 }}
        />
      </div>

      <span style={{
        fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "0.9rem",
        color: "var(--belvo-text-1)", textAlign: "center",
        letterSpacing: "-0.01em", lineHeight: 1.3, marginBottom: 6,
      }}>{name}</span>

      <span style={{
        fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", fontWeight: 500,
        letterSpacing: "0.18em", textTransform: "uppercase",
        color: lightColor,
        marginBottom: responsibilities ? 14 : 0,
      }}>{team}</span>

      {responsibilities && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginTop: 4 }}>
          {responsibilities.map(r => (
            <motion.span
              key={r}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              style={{
                fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", fontWeight: 600,
                letterSpacing: "0.12em", textTransform: "uppercase",
                color: "var(--belvo-text-2)",
                background: "var(--belvo-bg-card-2)",
                border: "1px solid var(--belvo-border-card)",
                borderRadius: "100px", padding: "3px 10px",
              }}
            >{r}</motion.span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─── ADMIN GROUP (Side-by-Side Layout) ───────────────────────────────────────

function AdminGroup({ adminTeam, coadminTeam }: { adminTeam: any; coadminTeam: any }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  if (!adminTeam || !coadminTeam) return null;

  return (
    <div ref={ref} style={{ marginBottom: "64px", width: "100%" }}>
      {/* 1. The Shared Administration Separator */}
      <motion.div
        custom={0} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
        style={{ display: "flex", alignItems: "center", marginBottom: 40, marginTop: 16 }}
      >
        <div style={{ flex: 1, height: 1, background: "var(--belvo-border-card)" }} />
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.62rem",
          fontWeight: 600,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "#007BFF", // The blue text color
          // Background and border updated to blue-tinted transparency
          background: "rgba(0, 123, 255, 0.1)",
          border: "0.5px solid rgba(0, 123, 255, 0.3)",
          borderRadius: "100px",
          padding: "5px 16px",
          margin: "0 16px"
        }}>
          ADMINISTRATION
        </span>
        <div style={{ flex: 1, height: 1, background: "var(--belvo-border-card)" }} />
      </motion.div>

      {/* 2. The Horizontal Card Container */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 240px))", // Ensures side-by-side
        gap: 16,
      }}>
        {/* Admin Card(s) */}
        {adminTeam.members.map((name: string, i: number) => (
          <MemberCard
            key={name} name={name} team={adminTeam.name} color={adminTeam.color} lightColor={adminTeam.lightColor}
            responsibilities={"responsibilities" in adminTeam ? adminTeam.responsibilities : undefined}
            inView={inView} index={i}
          />
        ))}

        {/* Co-Admin Card(s) */}
        {coadminTeam.members.map((name: string, i: number) => (
          <MemberCard
            key={name} name={name} team={coadminTeam.name} color={coadminTeam.color} lightColor={coadminTeam.lightColor}
            responsibilities={"responsibilities" in coadminTeam ? coadminTeam.responsibilities : undefined}
            inView={inView} index={i + 1}
          />
        ))}
      </div>
    </div>
  );
}

/// ─── TEAM GROUP (For Regular Teams) ──────────────────────────────────────────

function TeamGroup({ team }: { team: typeof TEAMS[number] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} style={{ marginBottom: "64px", width: "100%" }}>
      {/* Group header */}
      <motion.div
        custom={0} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
        style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}
      >
        <div style={{
          width: 3, height: 22, background: `linear-gradient(180deg, ${team.color}, transparent)`,
          borderRadius: 2, flexShrink: 0,
        }} />
        <h3 style={{
          fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "clamp(0.95rem, 2vw, 1.15rem)",
          color: "var(--belvo-text-1)", margin: 0, letterSpacing: "-0.01em",
        }}>{team.name}</h3>
        <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, ${team.color}28, transparent)` }} />
        <span style={{
          fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", fontWeight: 600,
          letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--belvo-text-4)",
        }}>{team.members.length} {team.members.length <= 1 ? "member" : "members"}</span>
      </motion.div>

      {/* Grid for standard members */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16,
      }}>
        {team.members.map((name, i) => (
          <MemberCard
            key={name} name={name} team={team.name} color={team.color} lightColor={team.lightColor}
            inView={inView} index={i + 1}
          />
        ))}
      </div>
    </div>
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────

export default function TeamSection() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <>
      {/* CSS keyframes for CEO card orbit rings */}
      <style>{`
        @keyframes belvoCeoSpin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 600px) {
          .belvo-ceo-inner {
            flex-direction: column !important;
            text-align: center !important;
            padding: 36px 28px !important;
            gap: 28px !important;
          }
        }
      `}</style>

      <section
        id="team"
        style={{
          background: "var(--belvo-bg)",
          position: "relative",
          overflow: "hidden",
          padding: "100px 24px 120px",
        }}
      >
        {/* top divider */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg, transparent, var(--belvo-border-divider), transparent)",
        }} />
        {/* ambient glow blob */}
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: "70vw", height: 400,
          background: "radial-gradient(ellipse at center, var(--belvo-glow-blob) 0%, transparent 65%)",
          filter: "blur(70px)", pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>

          {/* ── Section header ── */}
          <div ref={headerRef} style={{ textAlign: "center", marginBottom: "80px" }}>
            <motion.span
              custom={0} variants={fadeUp} initial="hidden"
              animate={headerInView ? "visible" : "hidden"}
              style={{
                display: "block",
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.68rem", letterSpacing: "0.35em",
                textTransform: "uppercase", color: "#9D4EDD", marginBottom: 14,
              }}
            >Our Team</motion.span>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={headerInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              style={{
                fontFamily: "'Inter', sans-serif", fontWeight: 900,
                fontSize: "clamp(2rem, 5vw, 3.8rem)", lineHeight: 1.05,
                color: "var(--belvo-text-1)", margin: "0 0 16px",
                letterSpacing: "-0.01em",
              }}
            >
              The BELVO{" "}
              <span style={{ color: "#9D4EDD" }}>Collective</span>
            </motion.h2>

            <motion.p
              custom={2} variants={fadeUp} initial="hidden"
              animate={headerInView ? "visible" : "hidden"}
              style={{
                fontFamily: "'Inter', sans-serif", fontSize: "0.95rem",
                lineHeight: 1.75, color: "var(--belvo-text-3)",
                maxWidth: 520, margin: "0 auto", letterSpacing: "0.01em",
              }}
            >
              Meet the talented people building exceptional digital experiences together.
            </motion.p>
          </div>

          {/* ── CEO card ── */}
          <CeoCard inView={headerInView} />





          {/* ── Regular Team groups ── */}
          {TEAMS.filter(t => t.id !== "admin" && t.id !== "coadmin").map((team) => (
            <TeamGroup key={team.id} team={team} />
          ))}

          {/* ── Admin & Co-Admin Side-by-Side ── */}
          <AdminGroup
            adminTeam={TEAMS.find(t => t.id === "admin")}
            coadminTeam={TEAMS.find(t => t.id === "coadmin")}
          />

        </div>
      </section>
    </>
  );
}
