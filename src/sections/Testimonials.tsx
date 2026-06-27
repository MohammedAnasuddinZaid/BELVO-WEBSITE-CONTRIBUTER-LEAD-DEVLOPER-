import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Riya Nambiar",
    title: "Co-Founder & CEO",
    company: "SaaS Startup",
    review:
      "BELVO understood exactly what we needed before we could even articulate it. Their team moved fast, asked the right questions, and delivered a product that genuinely reflected our brand. Couldn't have asked for a better partner.",
  },
  {
    id: 2,
    name: "Arjun Mehta",
    title: "Head of Product",
    company: "D2C Brand",
    review:
      "We'd worked with three agencies before BELVO. The difference was immediate — structured thinking, clear timelines, and no fluff. They treated our product like it was their own, and it showed in the final output.",
  },
  {
    id: 3,
    name: "Priya Subramaniam",
    title: "Marketing Lead",
    company: "E-commerce Company",
    review:
      "Our conversion rates improved within the first month of the redesign. BELVO didn't just make things look good — they made them work. The team was attentive, professional, and genuinely easy to collaborate with.",
  },
  {
    id: 4,
    name: "Karan Oberoi",
    title: "Founder",
    company: "Fintech Startup",
    review:
      "I was skeptical going in, but BELVO changed my mind quickly. They pushed back when our ideas weren't quite right, offered smarter alternatives, and the end result was miles ahead of what we initially planned.",
  },
  {
    id: 5,
    name: "Sneha Pillai",
    title: "Growth Manager",
    company: "Health & Wellness Brand",
    review:
      "Working with BELVO felt less like hiring a vendor and more like bringing on a team that actually cared. The attention to detail was impressive, and every touchpoint — from onboarding to delivery — was handled well.",
  },
  {
    id: 6,
    name: "Dev Malhotra",
    title: "Business Owner",
    company: "Hospitality Group",
    review:
      "We needed a full rebrand and a digital overhaul, and BELVO delivered both without missing a beat. They understood our audience, respected our timelines, and the final outcome has genuinely elevated how people perceive us.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

function TestimonialCard({ testimonial, index }: { testimonial: typeof TESTIMONIALS[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      style={{
        background: "var(--belvo-bg-card)",
        border: "1px solid var(--belvo-border-card)",
        borderRadius: "16px",
        padding: "clamp(24px, 3.5vw, 36px)",
        backdropFilter: "blur(14px)",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        position: "relative",
        overflow: "hidden",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
      }}
      whileHover={{
        borderColor: "rgba(157,78,221,0.38)",
        boxShadow: "0 8px 40px rgba(100,20,180,0.14)",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: "clamp(24px,3.5vw,36px)", right: "clamp(24px,3.5vw,36px)", height: "1px", background: "linear-gradient(90deg, rgba(157,78,221,0.6), transparent)" }} />

      <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "linear-gradient(135deg, rgba(123,47,190,0.18), rgba(157,78,221,0.08))", border: "1px solid rgba(157,78,221,0.22)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Quote size={15} style={{ color: "#9D4EDD" }} />
      </div>

      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.92rem", lineHeight: 1.8, color: "var(--belvo-text-6)", margin: 0, flex: 1, letterSpacing: "0.01em" }}>
        {testimonial.review}
      </p>

      <div style={{ height: "1px", background: "var(--belvo-border-bottom)" }} />

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, rgba(123,47,190,0.30), rgba(157,78,221,0.12))", border: "1px solid rgba(157,78,221,0.28)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "0.72rem", color: "#9D4EDD", letterSpacing: "0.04em", flexShrink: 0 }}>
          {testimonial.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
        </div>
        <div>
          <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "var(--belvo-text-1)", margin: 0, letterSpacing: "0.01em" }}>{testimonial.name}</p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: "var(--belvo-text-3)", margin: "2px 0 0", letterSpacing: "0.04em" }}>{testimonial.title} · {testimonial.company}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="testimonials" ref={ref} style={{ background: "var(--belvo-bg)", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", padding: "100px 24px" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, var(--belvo-border-divider), transparent)" }} />
      <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)", width: "55vw", height: "55vw", maxWidth: "700px", maxHeight: "700px", background: "radial-gradient(ellipse at center, var(--belvo-glow-blob) 0%, transparent 65%)", filter: "blur(70px)", pointerEvents: "none" }} />

      <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : { opacity: 0 }} transition={{ duration: 1.2, delay: 0.1 }} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "clamp(8rem, 22vw, 20rem)", fontFamily: "'Inter', sans-serif", fontWeight: 900, color: "var(--belvo-ghost-num)", letterSpacing: "-0.06em", userSelect: "none", pointerEvents: "none", lineHeight: 1, whiteSpace: "nowrap" }}>
        06
      </motion.div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1100px", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "clamp(40px, 6vw, 64px)" }}>
          <motion.p custom={0} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(157,78,221,0.6)", marginBottom: "14px" }}>
            Section 06
          </motion.p>
          <motion.h2 custom={1} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: "clamp(2rem, 5vw, 3.6rem)", lineHeight: 1.06, color: "var(--belvo-text-1)", margin: "0 0 18px", letterSpacing: "-0.01em", textTransform: "uppercase" }}>
            Client <span style={{ color: "#9D4EDD" }}>Testimonials</span>
          </motion.h2>
          <motion.p custom={2} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.97rem", lineHeight: 1.7, color: "var(--belvo-text-2)", maxWidth: "520px", margin: "0 auto" }}>
            Real words from the people we've worked with. No embellishments — just honest reflections from founders, operators, and teams who trusted us to deliver.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((testimonial, index) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index + 3} />
          ))}
        </div>
      </div>
    </section>
  );
}