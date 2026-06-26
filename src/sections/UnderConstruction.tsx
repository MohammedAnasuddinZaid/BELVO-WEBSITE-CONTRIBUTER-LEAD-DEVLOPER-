import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Construction } from "lucide-react";

interface Props {
  id: string;
  number: string;
  title: string;
  glowSide?: "left" | "right" | "center";
}

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function UnderConstruction({ id, number, title, glowSide = "center" }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const glowX = glowSide === "left" ? "20%" : glowSide === "right" ? "80%" : "50%";

  return (
    <section
      id={id}
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
        padding: "80px 24px",
      }}
    >
      {/* Top divider */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "1px",
        background: "linear-gradient(90deg, transparent, var(--belvo-border-divider), transparent)",
      }} />

      {/* Ambient glow blob */}
      <div style={{
        position: "absolute",
        top: "40%", left: glowX,
        transform: "translate(-50%, -50%)",
        width: "55vw", height: "55vw",
        maxWidth: "700px", maxHeight: "700px",
        background: "radial-gradient(ellipse at center, var(--belvo-glow-blob) 0%, transparent 65%)",
        filter: "blur(70px)",
        pointerEvents: "none",
      }} />

      {/* Ghost number */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.2, delay: 0.1 }}
        style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "clamp(8rem, 22vw, 20rem)",
          fontFamily: "'Inter', sans-serif",
          fontWeight: 900,
          color: "var(--belvo-ghost-num)",
          letterSpacing: "-0.06em",
          userSelect: "none",
          pointerEvents: "none",
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        {number}
      </motion.div>

      {/* Card */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: "640px", width: "100%", textAlign: "center" }}>

        {/* Coming Soon badge */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ marginBottom: "28px" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "7px",
            padding: "6px 18px",
            background: "linear-gradient(135deg, rgba(123,47,190,0.18), rgba(157,78,221,0.1))",
            border: "1px solid rgba(157,78,221,0.35)",
            borderRadius: "100px",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600, fontSize: "0.65rem",
            letterSpacing: "0.28em", textTransform: "uppercase",
            color: "#9D4EDD",
          }}>
            <span style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: "#9D4EDD", boxShadow: "0 0 8px rgba(157,78,221,0.9)",
              animation: "pulse-dot 2s ease-in-out infinite",
            }} />
            Coming Soon
          </span>
        </motion.div>

        {/* Section number */}
        <motion.p
          custom={1} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.68rem", letterSpacing: "0.35em",
            textTransform: "uppercase", color: "rgba(157,78,221,0.6)",
            marginBottom: "12px",
          }}
        >
          Section {number}
        </motion.p>

        {/* Title */}
        <motion.h2
          custom={2} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(2rem, 5vw, 3.6rem)",
            lineHeight: 1.06,
            color: "var(--belvo-text-1)",
            margin: "0 0 24px",
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </motion.h2>

        {/* Glass card body */}
        <motion.div
          custom={3} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
          style={{
            background: "var(--belvo-bg-card)",
            border: "1px solid var(--belvo-border-card)",
            borderRadius: "16px",
            padding: "clamp(28px, 5vw, 44px)",
            backdropFilter: "blur(14px)",
          }}
        >
          <div style={{
            width: "52px", height: "52px", borderRadius: "12px",
            background: "linear-gradient(135deg, rgba(123,47,190,0.2), rgba(157,78,221,0.08))",
            border: "1px solid rgba(157,78,221,0.22)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px",
          }}>
            <Construction size={22} style={{ color: "rgba(157,78,221,0.8)" }} />
          </div>

          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.95rem", lineHeight: 1.75,
            color: "var(--belvo-text-6)",
            letterSpacing: "0.01em", margin: 0,
          }}>
            This section is currently under construction.
            <br />
            <span style={{ color: "var(--belvo-text-4)" }}>
              Something exceptional is coming soon.
            </span>
          </p>

          {/* Progress bar */}
          <div style={{
            marginTop: "28px", height: "2px",
            background: "var(--belvo-progress-track)",
            borderRadius: "2px", overflow: "hidden",
          }}>
            <motion.div
              initial={{ width: "0%" }}
              animate={inView ? { width: "38%" } : { width: "0%" }}
              transition={{ duration: 1.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ height: "100%", background: "linear-gradient(90deg, #7B2FBE, #9D4EDD)", borderRadius: "2px" }}
            />
          </div>
          <div style={{ marginTop: "8px", display: "flex", justifyContent: "flex-end" }}>
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.65rem", color: "rgba(157,78,221,0.5)",
              letterSpacing: "0.1em",
            }}>38% complete</span>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.7); }
        }
      `}</style>
    </section>
  );
}
