import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

interface TeamMemberDisplay {
  name: string;
  imageUrl?: string | null;
  responsibilities?: readonly string[];
}

interface TeamDisplay {
  id: string;
  name: string;
  color: string;
  lightColor: string;
  members: TeamMemberDisplay[];
  responsibilities?: readonly string[];
}

const easeSmooth = [0.22, 1, 0.36, 1] as const;

const imageModules = import.meta.glob("/src/collectives/*", { eager: true, import: "default" }) as Record<string, string>;

const IMAGE_MAP: Record<string, string> = {};
Object.entries(imageModules).forEach(([path, url]) => {
  const name = path.split("/").pop()!.replace(/\.[^.]+$/, "").toLowerCase();
  IMAGE_MAP[name] = url;
});

const NAME_OVERRIDES: Record<string, string> = {
  "ram nath g k": "ramnath",
  "saurav": "sourav",
  "sharfudeen": "sharfu",
  "sheth yamani": "seth yamani",
  "naveen k d": "naveen kumar",
  "shailender": "shilendar",
  "sibijan": "sibi",
  "raavula vaibhav": "vaibhav",
  "sanskruti akare": "sanskruthi",
  "rimi gosh": "rimi",
  "mohd usaid ali khan": "mohd usaid",
  "mohammad ali": "mohd usaid",
  "mohammad anasuddin zaid": "mohs anas",
  "anshika srivastava": "anshika",
  "sri satya": "sri",
  "guru dutt": "guru",
  "anurag khushwaha": "anurag",
  "achintya gurba": "achintya gurba",
  "deepak sharma": "deepak sharma",
  "tamil selvan": "tamil",
  "yash": "yash1",
  "chirag arora": "chirag-arora",
};

function getImageUrl(memberName: string): string | undefined {
  const key = memberName.toLowerCase().trim();
  const override = NAME_OVERRIDES[key];
  if (override !== undefined) {
    if (override === "") return undefined;
    if (IMAGE_MAP[override]) return IMAGE_MAP[override];
  }
  if (IMAGE_MAP[key]) return IMAGE_MAP[key];
  const firstName = key.split(/\s+/)[0];
  if (IMAGE_MAP[firstName]) return IMAGE_MAP[firstName];
  const lastName = key.split(/\s+/).pop()!;
  if (IMAGE_MAP[lastName]) return IMAGE_MAP[lastName];
  const fuzzy = Object.keys(IMAGE_MAP).find(k => key.includes(k) || k.includes(key));
  if (fuzzy) return IMAGE_MAP[fuzzy];
  return undefined;
}

const CEO = {
  name: "Hrishikesh Mishra",
  title: "Founder & CEO",
  tagline: "Building BELVO to deliver world-class digital solutions — one idea, one team, one product at a time.",
};

const HARDCODED_TEAMS: TeamDisplay[] = [
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
      "Aditya Sarkar", "Divyansh Salanki", "Harshitha",
      "Chirag Arora", "Prathamesh Kharbal", "Himagiri Siddesh", "Yashwanth Polepalli",
    ].map(name => ({ name })),
  },
  {
    id: "app",
    name: "App Development",
    color: "#7B2FBE",
    lightColor: "#9D4EDD",
    members: ["Anand", "Anshika Srivastava", "Aaryan", "Suhani", "Aman", "Naveen Kumar", "Sushmitha", "Sinchana"].map(name => ({ name })),
  },
  {
    id: "cyber",
    name: "Cyber Security",
    color: "#7B2FBE",
    lightColor: "#9D4EDD",
    members: ["Harsh", "Sourav", "Parv", "Ankit Sharma"].map(name => ({ name })),
  },
  {
    id: "software",
    name: "Software Development",
    color: "#7B2FBE",
    lightColor: "#9D4EDD",
    members: ["Aditya Siras", "Rudra Matta", "Ankush Gemnnani", "Aditya Singh", "Aryan"].map(name => ({ name })),
  },
  {
    id: "analytics",
    name: "Business & Data Analytics",
    color: "#7B2FBE",
    lightColor: "#9D4EDD",
    members: ["Ishika", "Obed", "Sasikumar", "Sharfudeen", "Sibijan", "Tejaswini"].map(name => ({ name })),
  },
  {
    id: "graphic",
    name: "Graphic Designing",
    color: "#7B2FBE",
    lightColor: "#9D4EDD",
    members: ["Anurag khushwaha", "Rimi gosh", "Sanskruti akare", "Deepak Sharma", "Neha", "Yash"].map(name => ({ name })),
  },
  {
    id: "social",
    name: "Social Media Management",
    color: "#7B2FBE",
    lightColor: "#9D4EDD",
    members: ["Yash Mewati"].map(name => ({ name })),
  },
  {
    id: "content",
    name: "Content Writer",
    color: "#7B2FBE",
    lightColor: "#9D4EDD",
    members: ["Sheth Yamani"].map(name => ({ name })),
  },
  {
    id: "admin",
    name: "Administration",
    color: "#007BFF",
    lightColor: "#0056b3",
    members: ["Mohd Usaid Ali Khan", "Raavula Vaibhav", "Achintya Gurba", "Chetan Pawar"].map(name => ({ name })),
    responsibilities: ["Operations", "Team Coordination", "Client Communication", "Internal Management"] as readonly string[],
  },
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const fadeUp = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { duration: 0.5, delay: i * 0.05, ease: "easeOut" as const },
  }),
};

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
      style={{ display: "flex", justifyContent: "center", marginBottom: "80px" }}
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
        <div style={{
          position: "absolute", top: -60, right: -60,
          width: 220, height: 220, borderRadius: "50%",
          background: `radial-gradient(ellipse, ${gold}22, transparent 70%)`,
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", flexShrink: 0 }}>
          <div style={{ position: "absolute", inset: -8, borderRadius: "50%", border: `1.5px solid ${gold}44` }} />
          <div style={{ position: "absolute", inset: -16, borderRadius: "50%", border: `0.5px dashed ${gold}44` }} />
          <div style={{
            width: 120, height: 120, borderRadius: "50%",
            background: ceoImg ? "none" : "linear-gradient(135deg, #C9A341, #E0B84A)",
            border: `2px solid ${gold}66`,
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", zIndex: 1, overflow: "hidden",
            boxShadow: `0 0 30px ${gold}33`,
          }}>
            {ceoImg ? (
              <img src={ceoImg} alt={CEO.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
            ) : (
              <>
                <div style={{ position: "absolute", inset: 4, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.3)" }} />
                <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "2rem", color: "#fff", letterSpacing: "-0.02em", position: "relative", zIndex: 1 }}>{initials}</span>
              </>
            )}
          </div>
          <div style={{
            position: "absolute", bottom: 6, right: 6,
            width: 18, height: 18, borderRadius: "50%",
            background: "linear-gradient(135deg, #C9A341, #E0B84A)",
            border: "2.5px solid var(--belvo-bg)",
            boxShadow: `0 0 10px ${gold}66`,
            zIndex: 2,
          }} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: `${gold}15`, border: `0.5px solid ${gold}55`,
            borderRadius: "100px", padding: "4px 14px", marginBottom: 10,
          }}>
            <svg width={11} height={11} viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M10 2l2.3 5H17l-3.9 3 1.4 5.3L10 12.5 5.5 15.3l1.4-5.3L3 7h4.7z" fill={gold} />
            </svg>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: gold }}>
              Chief Executive Officer
            </span>
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "1.6rem", color: "var(--belvo-text-1)", letterSpacing: "-0.02em", marginBottom: 4, lineHeight: 1.1 }}>
            {CEO.name}
            <span style={{ color: "var(--belvo-text-3)", fontWeight: 400, fontSize: "1rem" }}> — Founder & CEO</span>
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "var(--belvo-text-3)", marginBottom: 18 }}>
            BELVO · Visionary · Builder
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.88rem", color: "var(--belvo-text-2)", lineHeight: 1.7, fontStyle: "italic", borderLeft: `2px solid ${gold}66`, paddingLeft: 14 }}>
            {CEO.tagline}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function MemberCard({
  name, team, color, lightColor, responsibilities, inView, index, imageUrl,
}: {
  name: string; team: string; color: string; lightColor: string;
  responsibilities?: readonly string[]; inView: boolean; index: number;
  imageUrl?: string | null;
}) {
  const initials = getInitials(name);
  const img = getImageUrl(name) || imageUrl;
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
        <div style={{
          width: 84, height: 84, borderRadius: "50%",
          background: img ? "none" : `linear-gradient(135deg, ${color}cc, ${lightColor}88)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          border: `2px solid ${color}44`,
          boxShadow: `0 0 28px ${color}22`,
          position: "relative", overflow: "hidden",
        }}>
          {img ? (
            <img src={img} alt={name} style={{
              width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%",
              objectPosition: name === "Mohammad Anasuddin Zaid" ? "50% 30%" : "50% 50%",
            }} />
          ) : (
            <>
              <div style={{ position: "absolute", inset: 4, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)" }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "1.35rem", color: "#fff", letterSpacing: "-0.02em", position: "relative", zIndex: 1 }}>{initials}</span>
            </>
          )}
        </div>
        <div style={{
          position: "absolute", bottom: 4, right: 4,
          width: 14, height: 14, borderRadius: "50%",
          background: `linear-gradient(135deg, ${color}, ${lightColor})`,
          border: "2.5px solid var(--belvo-bg)",
          boxShadow: `0 0 10px ${color}80`,
        }} />
      </div>

      <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "var(--belvo-text-1)", textAlign: "center", letterSpacing: "-0.01em", lineHeight: 1.3, marginBottom: 6 }}>
        {name}
      </span>
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: lightColor, marginBottom: responsibilities ? 14 : 0 }}>
        {team}
      </span>

      {responsibilities && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginTop: 4 }}>
          {responsibilities.map(r => (
            <span key={r} style={{
              fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", fontWeight: 600,
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: "var(--belvo-text-2)",
              background: "var(--belvo-bg-card-2)",
              border: "1px solid var(--belvo-border-card)",
              borderRadius: "100px", padding: "3px 10px",
            }}>{r}</span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function AdminGroup({ adminTeam }: { adminTeam?: TeamDisplay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  if (!adminTeam) return null;

  return (
    <div ref={ref} style={{ marginBottom: "64px", width: "100%" }}>
      <motion.div
        custom={0} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
        style={{ display: "flex", alignItems: "center", marginBottom: 40, marginTop: 16 }}
      >
        <div style={{ flex: 1, height: 1, background: "var(--belvo-border-card)" }} />
        <span style={{
          fontFamily: "'Inter', sans-serif", fontSize: "0.62rem", fontWeight: 600,
          letterSpacing: "0.22em", textTransform: "uppercase", color: "#007BFF",
          background: "rgba(0, 123, 255, 0.1)", border: "0.5px solid rgba(0, 123, 255, 0.3)",
          borderRadius: "100px", padding: "5px 16px", margin: "0 16px",
        }}>
          ADMINISTRATION
        </span>
        <div style={{ flex: 1, height: 1, background: "var(--belvo-border-card)" }} />
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 240px))", gap: 16 }}>
        {adminTeam.members.map((member, i) => (
          <MemberCard
            key={member.name} name={member.name} team={adminTeam.name} color={adminTeam.color} lightColor={adminTeam.lightColor}
            responsibilities={member.responsibilities ?? adminTeam.responsibilities}
            imageUrl={member.imageUrl}
            inView={inView} index={i}
          />
        ))}
      </div>
    </div>
  );
}

function TeamGroup({ team }: { team: TeamDisplay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} style={{ marginBottom: "64px", width: "100%" }}>
      <motion.div
        custom={0} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
        style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}
      >
        <div style={{ width: 3, height: 22, background: `linear-gradient(180deg, ${team.color}, transparent)`, borderRadius: 2, flexShrink: 0 }} />
        <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "clamp(0.95rem, 2vw, 1.15rem)", color: "var(--belvo-text-1)", margin: 0, letterSpacing: "-0.01em" }}>
          {team.name}
        </h3>
        <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, ${team.color}28, transparent)` }} />
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--belvo-text-4)" }}>
          {team.members.length} {team.members.length <= 1 ? "member" : "members"}
        </span>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16 }}>
        {team.members.map((member, i) => (
          <MemberCard
            key={member.name} name={member.name} team={team.name} color={team.color} lightColor={team.lightColor}
            responsibilities={member.responsibilities}
            imageUrl={member.imageUrl}
            inView={inView} index={i + 1}
          />
        ))}
      </div>
    </div>
  );
}

export default function TeamSection() {
  const [teams, setTeams] = useState<TeamDisplay[] | null>(null);
  const [apiStatus, setApiStatus] = useState<"loading" | "success" | "failed">("loading");
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

  useEffect(() => {
    const fetchFromAPI = async () => {
      try {
        const [teamRes, deptRes] = await Promise.all([
          fetch(`${API_BASE}/api/team`),
          fetch(`${API_BASE}/api/departments`),
        ]);

        if (!teamRes.ok || !deptRes.ok) {
          throw new Error("API request failed");
        }

        const teamData = await teamRes.json();
        const deptData = await deptRes.json();

        if (!teamData.success || !deptData.success) {
          throw new Error("API returned error");
        }

        const deptMap = new Map<string, any>(deptData.departments.map((d: any) => [d.id, d]));
        const grouped = new Map<string, TeamMemberDisplay[]>();
        
        for (const m of teamData.members) {
          if (!grouped.has(m.team_id)) grouped.set(m.team_id, []);
          grouped.get(m.team_id)!.push({
            name: m.name,
            imageUrl: m.image_url,
            responsibilities: m.responsibilities,
          });
        }

        const apiTeams: TeamDisplay[] = [];
        const apiIds = new Set<string>();

        for (const [id, dept] of deptMap) {
          const members = grouped.get(id);
          if (!members || members.length === 0) continue;
          apiIds.add(id);
          apiTeams.push({
            id: dept.id,
            name: dept.name,
            color: dept.color,
            lightColor: dept.light_color,
            members,
          });
        }

        for (const hard of HARDCODED_TEAMS) {
          if (!apiIds.has(hard.id)) {
            apiTeams.push(hard);
          }
        }

        if (apiTeams.length > 0) {
          setTeams(apiTeams);
        }
        setApiStatus("success");
      } catch (error) {
        console.warn("API unavailable, using hardcoded data:", error);
        setApiStatus("failed");
      }
    };

    fetchFromAPI();
  }, []);

  const displayTeams = teams ?? (apiStatus === "failed" ? HARDCODED_TEAMS : []);

  return (
    <>
      <style>{`
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
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg, transparent, var(--belvo-border-divider), transparent)",
        }} />
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: "70vw", height: 400,
          background: "radial-gradient(ellipse at center, var(--belvo-glow-blob) 0%, transparent 65%)",
          filter: "blur(70px)", pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div ref={headerRef} style={{ textAlign: "center", marginBottom: "80px" }}>
            <motion.span
              custom={0} variants={fadeUp} initial="hidden" animate={headerInView ? "visible" : "hidden"}
              style={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "#9D4EDD", marginBottom: 14 }}
            >
              Our Team
            </motion.span>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={headerInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: "clamp(2rem, 5vw, 3.8rem)", lineHeight: 1.05, color: "var(--belvo-text-1)", margin: "0 0 16px", letterSpacing: "-0.01em" }}
            >
              The BELVO <span style={{ color: "#9D4EDD" }}>Collective</span>
            </motion.h2>

            <motion.p
              custom={2} variants={fadeUp} initial="hidden" animate={headerInView ? "visible" : "hidden"}
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.95rem", lineHeight: 1.75, color: "var(--belvo-text-3)", maxWidth: 520, margin: "0 auto", letterSpacing: "0.01em" }}
            >
              Meet the talented people building exceptional digital experiences together.
            </motion.p>
          </div>

          <CeoCard inView={headerInView} />

          {displayTeams.filter(t => t.id !== "admin").map((team) => (
            <TeamGroup key={team.id} team={team} />
          ))}

          <AdminGroup adminTeam={displayTeams.find(t => t.id === "admin")} />
        </div>
      </section>
    </>
  );
}
