import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const TEAMS = [
  {
    id: "web",
    name: "Web Development",
    color: "#7B2FBE",
    lightColor: "#9D4EDD",
    members: [
      "Sri", "Lokesh", "Akhil", "Harsh", "Saurav",
      "Mohammad Anasuddin Zaid", "Ishvari", "Gaurav", "Sandali",
    ],
  },
  {
    id: "app",
    name: "App Development",
    color: "#7B2FBE",
    lightColor: "#9D4EDD",
    members: ["Anand", "Anshika", "Aryan", "Chetan", "Chitti", "Navin Kumar", "Navin J.D"],
  },
  {
    id: "analytics",
    name: "Business & Data Analytics",
    color: "#7B2FBE",
    lightColor: "#9D4EDD",
    members: ["Ishika", "Sibi Jain", "Saurav", "Sasi", "Obed"],
  },
  {
    id: "admin",
    name: "Administration",
    color: "#C9A341",
    lightColor: "#E0B84A",
    members: ["Mohammad Ali"],
    responsibilities: ["Operations", "Team Coordination", "Client Communication", "Internal Management"] as readonly string[],
  },
] as const;

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] },
  }),
};

function MemberCard({
  name,
  team,
  color,
  lightColor,
  responsibilities,
  inView,
  index,
}: {
  name: string;
  team: string;
  color: string;
  lightColor: string;
  responsibilities?: readonly string[];
  inView: boolean;
  index: number;
}) {
  const initials = getInitials(name);

  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover={{ y: -6, transition: { duration: 0.22, ease: "easeOut" } }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "28px 20px 24px",
        background: "var(--belvo-bg-card)",
        border: "1px solid var(--belvo-border-card)",
        borderRadius: "18px",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
        backdropFilter: "blur(14px)",
        transition: "border-color 0.3s, box-shadow 0.3s",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = `${color}55`;
        el.style.boxShadow = `0 16px 56px rgba(123,47,190,0.18), 0 0 0 1px ${color}22`;
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "var(--belvo-border-card)";
        el.style.boxShadow = "none";
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: "80px", height: "40px",
        background: `radial-gradient(ellipse at center, ${color}25, transparent 70%)`,
        filter: "blur(12px)",
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", marginBottom: "16px" }}>
        <div style={{
          width: "84px",
          height: "84px",
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${color}cc, ${lightColor}88)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `2px solid ${color}44`,
          boxShadow: `0 0 28px ${color}22`,
          position: "relative",
        }}>
          <div style={{
            position: "absolute", inset: "4px",
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.15)",
          }} />
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 800,
            fontSize: "1.35rem",
            color: "#ffffff",
            letterSpacing: "-0.02em",
            position: "relative",
            zIndex: 1,
          }}>{initials}</span>
        </div>
        <div style={{
          position: "absolute",
          bottom: "4px",
          right: "4px",
          width: "14px",
          height: "14px",
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${color}, ${lightColor})`,
          border: "2.5px solid var(--belvo-bg)",
          boxShadow: `0 0 10px ${color}80`,
        }} />
      </div>

      <span style={{
        fontFamily: "'Inter', sans-serif",
        fontWeight: 700,
        fontSize: "0.9rem",
        color: "var(--belvo-text-1)",
        textAlign: "center",
        letterSpacing: "-0.01em",
        lineHeight: 1.3,
        marginBottom: "6px",
      }}>{name}</span>

      <span style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.65rem",
        fontWeight: 500,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: lightColor,
        marginBottom: responsibilities ? "14px" : "0",
      }}>{team}</span>

      {responsibilities && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", justifyContent: "center", marginTop: "4px" }}>
          {responsibilities.map(r => (
            <span key={r} style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.6rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--belvo-text-2)",
              background: "var(--belvo-bg-card-2)",
              border: "1px solid var(--belvo-border-card)",
              borderRadius: "100px",
              padding: "3px 10px",
            }}>{r}</span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function TeamGroup({ team }: { team: typeof TEAMS[number] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} style={{ marginBottom: "64px" }}>
      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "32px" }}
      >
        <div style={{
          width: "3px", height: "22px",
          background: `linear-gradient(180deg, ${team.color}, transparent)`,
          borderRadius: "2px", flexShrink: 0,
        }} />
        <h3 style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 800,
          fontSize: "clamp(0.95rem, 2vw, 1.15rem)",
          color: "var(--belvo-text-1)",
          margin: 0,
          letterSpacing: "-0.01em",
        }}>{team.name}</h3>
        <div style={{
          height: "1px", flex: 1,
          background: `linear-gradient(90deg, ${team.color}28, transparent)`,
        }} />
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.65rem",
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--belvo-text-4)",
        }}>{team.members.length} {team.members.length === 1 ? "member" : "members"}</span>
      </motion.div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: "16px",
      }}>
        {team.members.map((name, i) => (
          <MemberCard
            key={name}
            name={name}
            team={team.name}
            color={team.color}
            lightColor={team.lightColor}
            responsibilities={"responsibilities" in team ? team.responsibilities : undefined}
            inView={inView}
            index={i + 1}
          />
        ))}
      </div>
    </div>
  );
}

export default function TeamSection() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <section
      id="team"
      style={{
        background: "var(--belvo-bg)",
        position: "relative",
        overflow: "hidden",
        padding: "100px 24px 120px",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: "linear-gradient(90deg, transparent, var(--belvo-border-divider), transparent)",
      }} />
      <div style={{
        position: "absolute", top: "0", left: "50%", transform: "translateX(-50%)",
        width: "70vw", height: "400px",
        background: "radial-gradient(ellipse at center, var(--belvo-glow-blob) 0%, transparent 65%)",
        filter: "blur(70px)", pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div ref={headerRef} style={{ textAlign: "center", marginBottom: "80px" }}>
          <motion.span
            custom={0} variants={fadeUp} initial="hidden"
            animate={headerInView ? "visible" : "hidden"}
            style={{
              display: "block",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.68rem",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "#9D4EDD",
              marginBottom: "14px",
            }}
          >Our Team</motion.span>

          <motion.h2
            custom={1} variants={fadeUp} initial="hidden"
            animate={headerInView ? "visible" : "hidden"}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(2rem, 5vw, 3.8rem)",
              lineHeight: 1.05,
              color: "var(--belvo-text-1)",
              margin: "0 0 16px",
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
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.95rem",
              lineHeight: 1.75,
              color: "var(--belvo-text-3)",
              maxWidth: "520px",
              margin: "0 auto",
              letterSpacing: "0.01em",
            }}
          >
            Meet the talented people building exceptional digital experiences together.
          </motion.p>
        </div>

        {TEAMS.map((team) => (
          <TeamGroup key={team.id} team={team} />
        ))}
      </div>
    </section>
  );
}
