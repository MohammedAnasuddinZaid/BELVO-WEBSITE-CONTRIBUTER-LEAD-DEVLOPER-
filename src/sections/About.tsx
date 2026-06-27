import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.1, ease: easeOut },
  }),
};

const staggerItem = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.6, delay: i * 0.08, ease: easeOut },
  }),
};

function Counter({ from = 0, to, duration = 2, suffix = "" }: { from?: number; to: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let startTime: number;
    let animId: number;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(from + (to - from) * eased));
      if (progress < 1) animId = requestAnimationFrame(step);
    };
    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [inView, from, to, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

function ImageCard({ src, index, inView }: { src: string; index: number; inView: boolean }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [30 * (index + 1), -30 * (index + 1)]);

  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={staggerItem}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      style={{
        borderRadius: "12px",
        overflow: "hidden",
        aspectRatio: "16/9",
        position: "relative",
        y,
      }}
      whileHover={{ scale: 1.03, transition: { duration: 0.4, ease: easeOut } }}
    >
      <img
        src={src}
        alt="Office"
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
      <motion.div
        style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(157,78,221,0.2), transparent)",
          opacity: 0,
        }}
        whileHover={{ opacity: 1 }}
      />
    </motion.div>
  );
}

export default function About() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -30]);

  return (
    <section
      id="about"
      ref={sectionRef}
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
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(130,40,200,0.3), transparent)",
        }}
      />

      <motion.div
        style={{
          position: "absolute",
          top: "40%",
          left: "80%",
          transform: "translate(-50%, -50%)",
          width: "55vw",
          height: "55vw",
          maxWidth: "700px",
          maxHeight: "700px",
          background: "radial-gradient(ellipse at center, var(--belvo-glow-blob) 0%, transparent 65%)",
          filter: "blur(70px)",
          pointerEvents: "none",
          y: bgY,
        }}
      />

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
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.8fr] gap-10 lg:gap-16">

          <div>
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
              <span style={{ display: "inline" }}>
                100+ Clients.
              </span>
              <br />
              <span style={{ color: "#9D4EDD" }}>
                <span style={{ display: "inline" }}>
                  Countless Stories.
                </span>
              </span>
            </motion.h2>

            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "1rem",
                lineHeight: "1.85",
                color: "var(--belvo-text-2)",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                marginTop: "40px",
              }}
            >
              {[
                "Over the years, Belvo has had the privilege of working with over 100+ clients — and every single one of them has taught us something new, pushed us to think differently, and reminded us why we do what we do. From scrappy startups with big dreams and bigger ambitions, to established brands ready to break through their next ceiling, we've sat across the table from founders, visionaries, risk-takers, and dreamers — and we've rolled up our sleeves and built something incredible with every single one of them.",
                "We've crafted brand identities that made people stop mid-scroll and say \"who is that?\" We've run performance campaigns that turned modest budgets into jaw-dropping returns. We've built websites that don't just look beautiful but actually work — pulling in traffic, holding attention, and converting visitors into loyal customers. We've managed social media accounts that went from ghost towns to buzzing communities. We've launched e-commerce stores that sold out. We've written code that scaled. We've generated leads that closed. We've delivered research that changed the direction of entire businesses.",
                "But beyond the numbers, the campaigns, and the deliverables — what we're most proud of is the relationships. Because behind every brief is a person who bet on their idea, and behind every project at Belvo is a team that refused to let them down.",
                "100+ clients later, our hunger hasn't changed — if anything, it's only grown stronger. Because for us, every new client isn't just a project. It's a new story. And at Belvo, we intend to make every single one worth telling.",
              ].map((text, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.5 + i * 0.15, ease: easeOut }}
                  style={{ margin: 0 }}
                >
                  {text}
                </motion.p>
              ))}
            </motion.div>
          </div>

          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            style={{
              background: "var(--belvo-bg-card)",
              border: "1px solid var(--belvo-border-card)",
              borderRadius: "16px",
              padding: "clamp(20px, 3vw, 32px)",
              backdropFilter: "blur(12px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
            }}
            whileHover={{
              borderColor: "rgba(157,78,221,0.3)",
              boxShadow: "0 0 40px rgba(130,40,200,0.1)",
              transition: { duration: 0.4, ease: easeOut },
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              {[
                { label: "Global Clients", value: 100, suffix: "+", color: "#9D4EDD" },
                { label: "Commitment", value: 100, suffix: "%", color: "var(--belvo-text-1)" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.8 + i * 0.1, ease: easeOut }}
                  style={{
                    background: "var(--belvo-bg)",
                    border: "1px solid var(--belvo-border-bottom)",
                    borderRadius: "12px",
                    padding: "16px",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  whileHover={{
                    borderColor: "rgba(157,78,221,0.3)",
                    scale: 1.02,
                    transition: { duration: 0.3 },
                  }}
                >
                  <motion.div
                    style={{
                      position: "absolute", top: -20, right: -20,
                      width: 60, height: 60, borderRadius: "50%",
                      background: "radial-gradient(circle, rgba(157,78,221,0.1), transparent)",
                      pointerEvents: "none",
                    }}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                  />
                  <div
                    style={{
                      fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
                      fontWeight: 900,
                      color: stat.color,
                      fontFamily: "'Inter', sans-serif",
                      lineHeight: 1,
                    }}
                  >
                    <Counter from={0} to={stat.value} duration={2} suffix={stat.suffix} />
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "var(--belvo-text-2)",
                      marginTop: "4px",
                    }}
                  >
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 1.2 }}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.85rem",
                lineHeight: "1.7",
                color: "var(--belvo-text-2)",
                margin: "20px 0 0 0",
              }}
            >
              From our creative studio to yours — every space at Belvo is built for collaboration, craft, and breakthrough ideas.
            </motion.p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                marginTop: "16px",
              }}
            >
              {["Office1", "Office2", "Office3"].map((img, i) => (
                <ImageCard key={img} src={`/OfficeImages/${img}.jpeg`} index={i} inView={inView} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
