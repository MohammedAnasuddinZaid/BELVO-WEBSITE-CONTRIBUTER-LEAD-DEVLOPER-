import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Sparkles, Check } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const TOOLS = [
  {
    name: "ChatGPT Pro",
    desc: "Premium AI assistant for content, research, and automation",
    originalPrice: "₹2,499/mo",
    price: "₹999/mo",
    discount: "60% OFF",
    features: ["GPT-4 access", "Custom instructions", "Priority support", "API credits"],
  },
  {
    name: "Midjourney",
    desc: "AI-powered image generation for stunning visuals",
    originalPrice: "₹4,999/mo",
    price: "₹1,899/mo",
    discount: "62% OFF",
    features: ["Commercial license", "HD renders", "Style customization", "Batch processing"],
  },
  {
    name: "Canva Pro",
    desc: "Professional design tool with premium templates",
    originalPrice: "₹1,899/mo",
    price: "₹799/mo",
    discount: "58% OFF",
    features: ["Premium templates", "Brand kit", "Background remover", "Team collaboration"],
  },
  {
    name: "Jasper AI",
    desc: "Advanced AI copywriting & marketing assistant",
    originalPrice: "₹3,999/mo",
    price: "₹1,499/mo",
    discount: "63% OFF",
    features: ["50+ templates", "SEO mode", "Brand voice", "Plagiarism check"],
  },
  {
    name: "Adobe Creative Cloud",
    desc: "Full suite of Adobe creative applications",
    originalPrice: "₹6,999/mo",
    price: "₹2,499/mo",
    discount: "64% OFF",
    features: ["All Adobe apps", "100GB cloud", "Font library", "Adobe Fonts"],
  },
  {
    name: "Notion AI",
    desc: "AI-powered workspace for docs, wikis & projects",
    originalPrice: "₹1,499/mo",
    price: "₹649/mo",
    discount: "57% OFF",
    features: ["AI writing assist", "Unlimited blocks", "Version history", "Guest access"],
  },
  {
    name: "Copy.ai",
    desc: "AI content generation for marketing & sales",
    originalPrice: "₹2,299/mo",
    price: "₹899/mo",
    discount: "61% OFF",
    features: ["90+ languages", "Workflows", "Integration APIs", "Brand voice"],
  },
  {
    name: "Runway ML",
    desc: "AI video editing & generation platform",
    originalPrice: "₹3,499/mo",
    price: "₹1,299/mo",
    discount: "63% OFF",
    features: ["Text-to-video", "Motion tracking", "Green screen AI", "4K export"],
  },
];

const easeOut = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 48 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.15 + i * 0.06, ease: easeOut } }),
};

export default function ToolsPricing() {
  const { theme } = useTheme();
  const isIvory = theme === "ivory";
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="tools-pricing"
      ref={ref}
      style={{ background: "var(--belvo-bg)", position: "relative", overflow: "hidden" }}
    >
      <div style={{
        height: "1px",
        background: "linear-gradient(90deg, transparent, var(--belvo-border-divider), rgba(201,163,65,0.2), transparent)",
      }} />

      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: "80vw", height: "60vh", background: "radial-gradient(ellipse at center, rgba(90,20,160,0.22) 0%, transparent 65%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", bottom: 0, right: "10%", width: "40vw", height: "40vh", background: "radial-gradient(ellipse at center, rgba(201,163,65,0.08) 0%, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "100px 24px 120px", position: "relative", zIndex: 1 }}>

        <motion.div
          custom={0} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
          style={{ textAlign: "center", marginBottom: "20px" }}
        >
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "6px 18px",
            background: isIvory ? "rgba(123,47,190,0.08)" : "rgba(123,47,190,0.15)",
            border: "1px solid rgba(157,78,221,0.3)", borderRadius: "100px",
            fontFamily: "'Inter',sans-serif", fontSize: "0.68rem", fontWeight: 600,
            letterSpacing: "0.3em", textTransform: "uppercase", color: "#9D4EDD",
          }}>
            <Sparkles size={11} />
            Premium Tools
          </span>
        </motion.div>

        <motion.div
          custom={1} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
          style={{ textAlign: "center", marginBottom: "16px" }}
        >
          <h2 style={{
            fontFamily: "'Inter',sans-serif", fontWeight: 900,
            fontSize: "clamp(1.9rem,4.5vw,3.4rem)", lineHeight: 1.06,
            color: "var(--belvo-text-1)", margin: 0,
          }}>
            Top Tools at{" "}
            <span style={{ color: "#9D4EDD" }}>Unbeatable</span> Prices
          </h2>
        </motion.div>

        <motion.p
          custom={2} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
          style={{
            textAlign: "center", maxWidth: "560px", margin: "0 auto 48px",
            fontFamily: "'Inter',sans-serif", fontSize: "0.95rem", lineHeight: 1.7,
            color: "var(--belvo-text-6)", letterSpacing: "0.01em",
          }}
        >
          Get premium access to ChatGPT, Midjourney, Canva Pro and more at heavily discounted prices.
          Limited slots available.
        </motion.p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "24px",
        }}>
          {TOOLS.map((tool, i) => (
            <motion.div
              key={tool.name}
              custom={i + 3}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              style={{
                background: "var(--belvo-bg-card)",
                border: "1px solid var(--belvo-border-card)",
                borderRadius: "16px",
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden",
                transition: "border-color 0.3s, box-shadow 0.3s",
                boxShadow: isIvory ? "0 2px 12px rgba(0,0,0,0.04)" : "none",
              }}
              whileHover={{
                y: -4,
                borderColor: "rgba(157,78,221,0.4)",
                boxShadow: isIvory
                  ? "0 8px 32px rgba(100,20,180,0.10)"
                  : "0 8px 40px rgba(100,20,180,0.18)",
                transition: { duration: 0.25, ease: easeOut },
              }}
            >
              {/* Discount badge */}
              <div style={{
                position: "absolute", top: 12, right: 12,
                padding: "4px 10px",
                background: "linear-gradient(135deg, #7B2FBE, #9D4EDD)",
                borderRadius: "6px",
                fontFamily: "'Inter',sans-serif", fontSize: "0.6rem", fontWeight: 700,
                letterSpacing: "0.04em", color: "#ffffff",
              }}>
                {tool.discount}
              </div>

              <h3 style={{
                fontFamily: "'Inter',sans-serif", fontWeight: 700,
                fontSize: "1rem", color: "var(--belvo-text-1)", margin: "0 0 6px",
              }}>
                {tool.name}
              </h3>

              <p style={{
                fontFamily: "'Inter',sans-serif", fontSize: "0.78rem",
                lineHeight: 1.6, color: "var(--belvo-text-6)", margin: "0 0 16px",
                flexGrow: 1,
              }}>
                {tool.desc}
              </p>

              {/* Pricing */}
              <div style={{ marginBottom: "16px" }}>
                <span style={{
                  fontFamily: "'Inter',sans-serif", fontSize: "0.75rem",
                  color: "var(--belvo-text-4)", textDecoration: "line-through",
                  marginRight: "8px",
                }}>
                  {tool.originalPrice}
                </span>
                <span style={{
                  fontFamily: "'Inter',sans-serif", fontSize: "1.35rem",
                  fontWeight: 800, color: "#9D4EDD",
                }}>
                  {tool.price}
                </span>
              </div>

              {/* Features */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "20px" }}>
                {tool.features.map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Check size={12} color="#9D4EDD" strokeWidth={3} />
                    <span style={{
                      fontFamily: "'Inter',sans-serif", fontSize: "0.73rem",
                      color: "var(--belvo-text-3)",
                    }}>
                      {f}
                    </span>
                  </div>
                ))}
              </div>

              <button
                data-testid={`button-tool-${tool.name.toLowerCase().replace(/\s+/g, "-")}`}
                style={{
                  width: "100%",
                  padding: "10px 0",
                  background: "linear-gradient(135deg, #7B2FBE, #9D4EDD)",
                  border: "none", borderRadius: "8px",
                  color: "#ffffff",
                  fontFamily: "'Inter',sans-serif", fontWeight: 600,
                  fontSize: "0.78rem", letterSpacing: "0.16em",
                  textTransform: "uppercase", cursor: "pointer",
                  boxShadow: "0 0 24px rgba(130,40,200,0.3)",
                  transition: "box-shadow 0.3s, transform 0.2s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = "0 0 40px rgba(157,78,221,0.5)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = "0 0 24px rgba(130,40,200,0.3)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Get Access
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
