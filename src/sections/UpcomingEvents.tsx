import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Calendar, Globe, MapPin, Wifi } from "lucide-react";

const EVENTS = [
  {
    id: 1,
    title: "React Free Webinar",
    category: "Free Webinar",
    mode: "Online" as const,
    date: "Tomorrow",
    description:
      "Join our free React webinar where we'll cover modern React fundamentals, reusable components, hooks, state management, and best practices for building scalable applications.",
    accentColor: "#9D4EDD",
    gradientFrom: "rgba(123,47,190,0.22)",
    gradientTo: "rgba(157,78,221,0.06)",
  },
  {
    id: 2,
    title: "Flutter Workshop",
    category: "Workshop",
    mode: "Online" as const,
    date: "Next Sunday",
    description:
      "Learn Flutter from scratch and build beautiful cross-platform mobile applications through practical live sessions.",
    accentColor: "#7B2FBE",
    gradientFrom: "rgba(90,20,160,0.20)",
    gradientTo: "rgba(123,47,190,0.05)",
  },
  {
    id: 3,
    title: "Founders Meet-up",
    category: "Networking Event",
    mode: "Offline" as const,
    date: "15 July",
    description:
      "Meet startup founders, entrepreneurs, developers, and innovators to network, exchange ideas, and build meaningful connections.",
    accentColor: "#B06AE8",
    gradientFrom: "rgba(160,80,220,0.20)",
    gradientTo: "rgba(176,106,232,0.05)",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.14, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

function EventCard({ event, index }: { event: typeof EVENTS[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover={{ y: -6, transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] } }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "rgba(157,78,221,0.45)";
        el.style.boxShadow = "0 16px 48px rgba(100,20,180,0.18), 0 2px 8px rgba(100,20,180,0.10)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "var(--belvo-border-card)";
        el.style.boxShadow = "none";
      }}
      style={{
        background: "var(--belvo-bg-card)",
        border: "1px solid var(--belvo-border-card)",
        borderRadius: "18px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
        cursor: "default",
      }}
    >
      {/* Top accent bar */}
      <div style={{ height: "3px", background: `linear-gradient(90deg, ${event.accentColor}, transparent)` }} />

      {/* Header zone */}
      <div
        style={{
          padding: "28px 28px 20px",
          background: `linear-gradient(135deg, ${event.gradientFrom}, ${event.gradientTo})`,
          borderBottom: "1px solid var(--belvo-border-bottom)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "8px" }}>
          <span
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "4px 12px",
              background: "rgba(157,78,221,0.14)",
              border: "1px solid rgba(157,78,221,0.28)",
              borderRadius: "100px",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.65rem", fontWeight: 700,
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: event.accentColor,
            }}
          >
            {event.category}
          </span>

          <span
            style={{
              display: "inline-flex", alignItems: "center", gap: "5px",
              padding: "4px 10px",
              background: event.mode === "Online" ? "rgba(34,197,94,0.10)" : "rgba(251,146,60,0.10)",
              border: `1px solid ${event.mode === "Online" ? "rgba(34,197,94,0.28)" : "rgba(251,146,60,0.28)"}`,
              borderRadius: "100px",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.65rem", fontWeight: 600,
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: event.mode === "Online" ? "rgba(34,197,94,0.9)" : "rgba(251,146,60,0.9)",
            }}
          >
            {event.mode === "Online" ? <Wifi size={11} strokeWidth={2} /> : <MapPin size={11} strokeWidth={2} />}
            {event.mode}
          </span>
        </div>

        <h3
          style={{
            fontFamily: "'Inter', sans-serif", fontWeight: 800,
            fontSize: "clamp(1.1rem, 2vw, 1.3rem)", lineHeight: 1.25,
            color: "var(--belvo-text-1)", margin: "0 0 12px", letterSpacing: "-0.01em",
          }}
        >
          {event.title}
        </h3>

        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <Calendar size={13} style={{ color: event.accentColor, flexShrink: 0 }} strokeWidth={2} />
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", fontWeight: 600, color: event.accentColor, letterSpacing: "0.04em" }}>
            {event.date}
          </span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "22px 28px 28px", flex: 1, display: "flex", flexDirection: "column" }}>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", lineHeight: 1.78, color: "var(--belvo-text-6)", margin: 0, flex: 1 }}>
          {event.description}
        </p>

        <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid var(--belvo-border-bottom)", display: "flex", alignItems: "center", gap: "7px" }}>
          {event.mode === "Online"
            ? <Globe size={13} style={{ color: "var(--belvo-text-3)" }} strokeWidth={1.8} />
            : <MapPin size={13} style={{ color: "var(--belvo-text-3)" }} strokeWidth={1.8} />
          }
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: "var(--belvo-text-3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {event.mode === "Online" ? "Virtual Event — Join from Anywhere" : "In-Person Event"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function UpcomingEvents() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="events"
      ref={ref}
      style={{
        background: "var(--belvo-bg)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "100px 24px",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, var(--belvo-border-divider), transparent)" }} />

      <div style={{ position: "absolute", top: "35%", left: "50%", transform: "translate(-50%, -50%)", width: "60vw", height: "60vw", maxWidth: "750px", maxHeight: "750px", background: "radial-gradient(ellipse at center, var(--belvo-glow-blob) 0%, transparent 65%)", filter: "blur(70px)", pointerEvents: "none" }} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.2, delay: 0.1 }}
        style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "clamp(8rem, 22vw, 20rem)", fontFamily: "'Inter', sans-serif", fontWeight: 900, color: "var(--belvo-ghost-num)", letterSpacing: "-0.06em", userSelect: "none", pointerEvents: "none", lineHeight: 1, whiteSpace: "nowrap" }}
      >
        05
      </motion.div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1100px", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "clamp(40px, 6vw, 64px)" }}>
          <motion.p
            custom={0} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(157,78,221,0.6)", marginBottom: "14px" }}
          >
            Section 05
          </motion.p>

          <motion.h2
            custom={1} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: "clamp(2rem, 5vw, 3.6rem)", lineHeight: 1.06, color: "var(--belvo-text-1)", margin: "0 0 18px", letterSpacing: "-0.01em", textTransform: "uppercase" }}
          >
            Upcoming <span style={{ color: "#9D4EDD" }}>Events</span>
          </motion.h2>

          <motion.p
            custom={2} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.97rem", lineHeight: 1.7, color: "var(--belvo-text-2)", maxWidth: "520px", margin: "0 auto" }}
          >
            Webinars, workshops, and networking events crafted for founders, developers, and creators ready to level up.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ alignItems: "stretch" }}>
          {EVENTS.map((event, index) => (
            <EventCard key={event.id} event={event} index={index + 3} />
          ))}
        </div>
      </div>
    </section>
  );
}
