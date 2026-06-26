import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Users } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="about"
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
      {/* Top divider */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(130,40,200,0.3), transparent)",
        }}
      />

      {/* Ambient glow blob */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "80%",
          transform: "translate(-50%, -50%)",
          width: "55vw",
          height: "55vw",
          maxWidth: "700px",
          maxHeight: "700px",
          background:
            "radial-gradient(ellipse at center, var(--belvo-glow-blob) 0%, transparent 65%)",
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />

      {/* Section number — large ghosted bg */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.2, delay: 0.1 }}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
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
        01
      </motion.div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1100px",
          width: "100%",
        }}
      >
        <div
          className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.8fr] gap-10 lg:gap-16"
        >
          {/* Left Column - Heading & Info */}
          <div>

            {/* Title */}
            <motion.h2
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 900,
                fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
                lineHeight: 1.08,
                color: "var(--belvo-text-1)",
                margin: "0 0 24px",
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
              }}
            >
              100+ Clients.
              <br />
              <span style={{ color: "#9D4EDD" }}>Countless Stories.</span>
            </motion.h2>

            {/* Stats Block */}
            <motion.div
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                marginTop: "40px",
              }}
            >
              <div
                style={{
                  background: "var(--belvo-bg-card)",
                  border: "1px solid var(--belvo-border-bottom)",
                  borderRadius: "12px",
                  padding: "20px",
                }}
              >
                <div
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: 900,
                    color: "#9D4EDD",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  100+
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--belvo-text-2)",
                    marginTop: "4px",
                  }}
                >
                  Global Clients
                </div>
              </div>

              <div
                style={{
                  background: "var(--belvo-bg-card)",
                  border: "1px solid var(--belvo-border-bottom)",
                  borderRadius: "12px",
                  padding: "20px",
                }}
              >
                <div
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: 900,
                    color: "var(--belvo-text-1)",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  100%
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--belvo-text-2)",
                    marginTop: "4px",
                  }}
                >
                  Commitment
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Text Description in Glassmorphism Card */}
          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            style={{
              background: "var(--belvo-bg-card)",
              border: "1px solid var(--belvo-border-card)",
              borderRadius: "16px",
              padding: "clamp(24px, 4vw, 40px)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "1.05rem",
                lineHeight: "1.85",
                color: "var(--belvo-text-2)",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
              <p>
                {"Over the years, Belvo has had the privilege of working with over 100+ clients — and every single one of them has taught us something new, pushed us to think differently, and reminded us why we do what we do. From scrappy startups with big dreams and bigger ambitions, to established brands ready to break through their next ceiling, we've sat across the table from founders, visionaries, risk-takers, and dreamers — and we've rolled up our sleeves and built something incredible with every single one of them."}
              </p>
              <p>
                {"We've crafted brand identities that made people stop mid-scroll and say \"who is that?\" We've run performance campaigns that turned modest budgets into jaw-dropping returns. We've built websites that don't just look beautiful but actually work — pulling in traffic, holding attention, and converting visitors into loyal customers. We've managed social media accounts that went from ghost towns to buzzing communities. We've launched e-commerce stores that sold out. We've written code that scaled. We've generated leads that closed. We've delivered research that changed the direction of entire businesses."}
              </p>
              <p>
                {"But beyond the numbers, the campaigns, and the deliverables — what we're most proud of is the relationships. Because behind every brief is a person who bet on their idea, and behind every project at Belvo is a team that refused to let them down."}
              </p>
              <p style={{ margin: 0 }}>
                {"100+ clients later, our hunger hasn't changed — if anything, it's only grown stronger. Because for us, every new client isn't just a project. It's a new story. And at Belvo, we intend to make every single one worth telling."}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
