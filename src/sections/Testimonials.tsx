import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Quote } from "lucide-react";

// Resolve local images in src/Images via import.meta.url so Vite handles them correctly
const AVATAR_1 = new URL("../Images/testimonial_avatar_1.png", import.meta.url).href;
const AVATAR_2 = new URL("../Images/testimonial_avatar_2.png", import.meta.url).href;
const AVATAR_3 = new URL("../Images/testimonial_avatar_3.png", import.meta.url).href;
const AVATAR_4 = new URL("../Images/testimonial_avatar_4.png", import.meta.url).href;
const AVATAR_5 = new URL("../Images/WhatsApp Image 2026-06-27 at 6.40.55 PM.jpeg", import.meta.url).href;
const AVATAR_6 = new URL("../Images/WhatsApp Image 2026-06-27 at 6.42.56 PM.jpeg", import.meta.url).href;
const AVATAR_7 = new URL("../Images/WhatsApp Image 2026-06-27 at 6.44.30 PM.jpeg", import.meta.url).href;
const AVATAR_8 = new URL("../Images/WhatsApp Image 2026-06-27 at 6.46.15 PM.jpeg", import.meta.url).href;
const AVATAR_9 = new URL("../Images/ChatGPT Image Jun 27, 2026, 07_21_16 PM.png", import.meta.url).href;
const AVATAR_10 = new URL("../Images/ChatGPT Image Jun 27, 2026, 07_45_48 PM.png", import.meta.url).href;

const DEFAULT_TESTIMONIAL_IMAGE = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80";

const TESTIMONIALS = [
  {
    id: 1,
    image: AVATAR_1,
    name: "Sunny Jain",
    title: "Founder / Key Person",
    company: "Ghar Soaps",
    review:
      "BELVO understood exactly what we needed before we could even articulate it. Their team moved fast, asked the right questions, and delivered a product that genuinely reflected our brand. Couldn't have asked for a better partner.",
  },
  {
    id: 2,
    image: AVATAR_2,
    name: "Niharika Kunal Jhunjhunwala",
    title: "Founder / Key Person",
    company: "ClayCo Beauty",
    review:
      "We'd worked with three agencies before BELVO. The difference was immediate — structured thinking, clear timelines, and no fluff. They treated our product like it was their own, and it showed in the final output.",
  },
  {
    id: 3,
    image: AVATAR_3,
    name: "Prabhkiran Singh",
    title: "Founder / Key Person",
    company: "Bewakoof",
    review:
      "Our conversion rates improved within the first month of the redesign. BELVO didn't just make things look good — they made them work. The team was attentive, professional, and genuinely easy to collaborate with.",
  },
  {
    id: 4,
    image: AVATAR_4,
    name: "Manas Madhu",
    title: "Founder / Key Person",
    company: "Beyond Snacks",
    review:
      "I was skeptical going in, but BELVO changed my mind quickly. They pushed back when our ideas weren't quite right, offered smarter alternatives, and the end result was miles ahead of what we initially planned.",
  },
  {
    id: 5,
    image: AVATAR_5,
    name: "Mohammad Raafi Hossain",
    title: "Founder / Key Person",
    company: "Fasset",
    review:
      "Working with BELVO felt less like hiring a vendor and more like bringing on a team that actually cared. The attention to detail was impressive, and every touchpoint — from onboarding to delivery — was handled well.",
  },
  {
    id: 6,
    image: AVATAR_10,
    name: "karan desai",
    title: "Founder / Key Person",
    company: "KDAK",
    review:
      "We needed a full rebrand and a digital overhaul, and BELVO delivered both without missing a beat. They understood our audience, respected our timelines, and the final outcome has genuinely elevated how people perceive us.",
  },
  {
    id: 7,
    image: AVATAR_9,
    name: "Prathamesh Choudhari",
    title: "Founder / Key Person",
    company: "GatePay",
    review:
      "BELVO brought a level of craft to our UI that we hadn't seen from any other agency. Every screen felt intentional. They didn't just execute the brief — they elevated it. We've received more compliments on our product design since the launch than ever before.",
  },
  {
    id: 8,
    image: AVATAR_6,
    name: "Dr. Aman Dua",
    title: "Founder / Key Person",
    company: "AK Clinics",
    review:
      "From architecture to deployment, BELVO's engineering team was thorough and communicative. They flagged issues before they became problems, suggested better approaches, and delivered clean, maintainable code. Exactly what a technical team should be.",
  },
  {
    id: 9,
    image: AVATAR_7,
    name: "Dr. Devi Prasad Shetty",
    title: "Founder / Key Person",
    company: "Narayana One Health",
    review:
      "We came to BELVO with a fragmented brand identity and left with something cohesive, confident, and compelling. Their strategic thinking goes far beyond aesthetics — they helped us find our voice and actually use it.",
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
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setTilt({
      x: ((e.clientY - rect.top) / rect.height - 0.5) * -5,
      y: ((e.clientX - rect.left) / rect.width - 0.5) * 5,
    });
  };

  const handleLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{
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
          transformStyle: "preserve-3d",
          perspective: 600,
          rotateX: tilt.x,
          rotateY: tilt.y,
        }}
        whileHover={{
          borderColor: "rgba(157,78,221,0.38)",
          boxShadow: "0 8px 40px rgba(100,20,180,0.14)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px", paddingBottom: "18px", minHeight: "120px", flexShrink: 0 }}>
          <motion.div
            style={{
              width: "88px", height: "88px", borderRadius: "50%", overflow: "hidden",
              background: "linear-gradient(135deg, rgba(123,47,190,0.30), rgba(157,78,221,0.12))",
              border: "2px solid rgba(157,78,221,0.28)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}
            animate={{ boxShadow: ["0 0 0px rgba(157,78,221,0.2)", "0 0 20px rgba(157,78,221,0.4)", "0 0 0px rgba(157,78,221,0.2)"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
          >
            {testimonial.image ? (
              <img
                src={testimonial.image}
                alt={testimonial.name}
                width={88}
                height={88}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            ) : (
              <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "1.08rem", color: "#9D4EDD", letterSpacing: "0.04em" }}>
                {testimonial.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </span>
            )}
          </motion.div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "100%" }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--belvo-text-1)", margin: 0, letterSpacing: "0.01em" }}>{testimonial.name}</p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: "var(--belvo-text-3)", margin: "6px 0 0", letterSpacing: "0.04em" }}>{testimonial.title} · {testimonial.company}</p>
          </div>
        </div>

        <div style={{ height: "1px", background: "var(--belvo-border-bottom)", opacity: 0.5 }} />

        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.96rem", lineHeight: 1.8, color: "var(--belvo-text-6)", margin: 0, flex: 1, letterSpacing: "0.01em" }}>
          {testimonial.review}
        </p>

        <motion.div
          style={{
            width: "36px", height: "36px", borderRadius: "8px",
            background: "linear-gradient(135deg, rgba(123,47,190,0.18), rgba(157,78,221,0.08))",
            border: "1px solid rgba(157,78,221,0.22)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}
        >
          <Quote size={15} style={{ color: "#9D4EDD" }} />
        </motion.div>
      </motion.div>
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
