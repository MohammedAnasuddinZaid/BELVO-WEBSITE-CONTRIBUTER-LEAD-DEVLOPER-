import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const AVATAR_1 = new URL("../Images/testimonial_avatar_1.png", import.meta.url).href;
const AVATAR_2 = new URL("../Images/testimonial_avatar_2.png", import.meta.url).href;
const AVATAR_3 = new URL("../Images/testimonial_avatar_3.png", import.meta.url).href;
const AVATAR_4 = new URL("../Images/testimonial_avatar_4.png", import.meta.url).href;
const AVATAR_5 = new URL("../Images/WhatsApp Image 2026-06-27 at 10.18.03 PM.jpeg", import.meta.url).href;
const AVATAR_6 = new URL("../Images/WhatsApp Image 2026-06-27 at 6.42.56 PM.jpeg", import.meta.url).href;
const AVATAR_7 = new URL("../Images/WhatsApp Image 2026-06-27 at 6.44.30 PM.jpeg", import.meta.url).href;
const AVATAR_9 = new URL("../Images/ChatGPT Image Jun 27, 2026, 07_21_16 PM.png", import.meta.url).href;
const AVATAR_10 = new URL("../Images/ChatGPT Image Jun 27, 2026, 07_45_48 PM.png", import.meta.url).href;

const TESTIMONIALS = [
  {
    id: 1,
    image: AVATAR_1,
    name: "Sunny Jain",
    title: "Founder / Key Person · Ghar Soaps",
    text: "BELVO understood exactly what we needed before we could even articulate it. Their team moved fast, asked the right questions, and delivered a product that genuinely reflected our brand. Couldn't have asked for a better partner.",
  },
  {
    id: 2,
    image: AVATAR_2,
    name: "Niharika Kunal Jhunjhunwala",
    title: "Founder / Key Person · ClayCo Beauty",
    text: "We'd worked with three agencies before BELVO. The difference was immediate — structured thinking, clear timelines, and no fluff. They treated our product like it was their own, and it showed in the final output.",
  },
  {
    id: 3,
    image: AVATAR_3,
    name: "Prabhkiran Singh",
    title: "Founder / Key Person · Bewakoof",
    text: "Our conversion rates improved within the first month of the redesign. BELVO didn't just make things look good — they made them work. The team was attentive, professional, and genuinely easy to collaborate with.",
  },
  {
    id: 4,
    image: AVATAR_4,
    name: "Manas Madhu",
    title: "Founder / Key Person · Beyond Snacks",
    text: "I was skeptical going in, but BELVO changed my mind quickly. They pushed back when our ideas weren't quite right, offered smarter alternatives, and the end result was miles ahead of what we initially planned.",
  },
  {
    id: 5,
    image: AVATAR_5,
    name: "Mohammad Raafi Hossain",
    title: "Founder / Key Person · Fasset",
    text: "Working with BELVO felt less like hiring a vendor and more like bringing on a team that actually cared. The attention to detail was impressive, and every touchpoint — from onboarding to delivery — was handled well.",
  },
  {
    id: 6,
    image: AVATAR_10,
    name: "karan desai",
    title: "Founder / Key Person · KDAK",
    text: "We needed a full rebrand and a digital overhaul, and BELVO delivered both without missing a beat. They understood our audience, respected our timelines, and the final outcome has genuinely elevated how people perceive us.",
  },
  {
    id: 7,
    image: AVATAR_9,
    name: "Prathamesh Choudhari",
    title: "Founder / Key Person · GatePay",
    text: "BELVO brought a level of craft to our UI that we hadn't seen from any other agency. Every screen felt intentional. They didn't just execute the brief — they elevated it. We've received more compliments on our product design since the launch than ever before.",
  },
  {
    id: 8,
    image: AVATAR_6,
    name: "Dr. Aman Dua",
    title: "Founder / Key Person · AK Clinics",
    text: "From architecture to deployment, BELVO's engineering team was thorough and communicative. They flagged issues before they became problems, suggested better approaches, and delivered clean, maintainable code. Exactly what a technical team should be.",
  },
  {
    id: 9,
    image: AVATAR_7,
    name: "Dr. Devi Prasad Shetty",
    title: "Founder / Key Person · Narayana One Health",
    text: "We came to BELVO with a fragmented brand identity and left with something cohesive, confident, and compelling. Their strategic thinking goes far beyond aesthetics — they helped us find our voice and actually use it.",
  },
];

const CARD_COUNT = TESTIMONIALS.length;

function getRadius() {
  const w = window.innerWidth;
  if (w <= 480) return Math.round((w - 220) / 2);
  if (w <= 768) return Math.round((w - 280) / 2);
  return Math.min(340, Math.round((w - 360) / 2));
}

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const spacer = spacerRef.current;
    if (!wrapper || !spacer) return;

    const cards = Array.from(wrapper.children) as HTMLElement[];
    const count = cards.length;
    let radius = getRadius();
    const angleStep = (Math.PI * 2) / CARD_COUNT;

    function getFerrisPos(i: number, rotOffset: number) {
      const angle = i * angleStep + Math.PI * 0.5 + rotOffset;
      return {
        x: radius * Math.cos(angle),
        y: radius * 0.45 * Math.sin(angle) - radius * 0.15,
        z: radius * Math.sin(angle),
      };
    }

    function updateCards(progress: number) {
      const p = Math.min(1, Math.max(0, progress));

      for (let i = 0; i < count; i++) {
        const card = cards[i];
        if (!card) continue;

        const ferris = getFerrisPos(i, p * Math.PI * 1.8);

        const blendStart = 0.55;
        const blend = p > blendStart ? (p - blendStart) / (1 - blendStart) : 0;
        const easeBlend = blend * blend * (3 - 2 * blend);

        const baseOpacity = 0.4 + 0.6 * ((ferris.z / radius) + 1) / 2;
        const clampedOpacity = Math.min(1, Math.max(0.2, baseOpacity));
        const finalOpacity = clampedOpacity * (1 - easeBlend) + 0.95 * easeBlend;

        let transform = `translate3d(${ferris.x}px, ${ferris.y}px, ${ferris.z}px) scale(0.55)`;
        if (easeBlend < 0.8) {
          const rotX = 0.12 * Math.sin(i * angleStep + p * Math.PI * 1.8);
          const rotY = 0.06 * Math.cos(i * angleStep + p * Math.PI * 1.8);
          transform += ` rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        }

        card.style.transform = transform;
        card.style.opacity = String(finalOpacity);
        card.style.zIndex = String(i + 1);
      }
    }

    updateCards(0);

    const ctx = gsap.context(() => {
      const master = { progress: 0 };
      gsap.to(master, {
        progress: 1,
        duration: 1,
        ease: "none",
        scrollTrigger: {
          trigger: spacer,
          start: "top top+=90vh",
          end: "bottom top+=90vh",
          scrub: 1.2,
          invalidateOnRefresh: true,
          onRefresh: () => updateCards(master.progress),
        },
        onUpdate: () => updateCards(master.progress),
      });
    }, sectionRef.current);

    function refresh() {
      ScrollTrigger.refresh(true);
    }

    refresh();
    requestAnimationFrame(() => refresh());
    requestAnimationFrame(() => requestAnimationFrame(() => refresh()));

    window.addEventListener("load", refresh);
    window.addEventListener("resize", () => {
      radius = getRadius();
      refresh();
    });

    return () => {
      ctx.revert();
      window.removeEventListener("load", refresh);
    };
  }, []);

  return (
    <>
      <style>{`
        .testimonial-card {
          position: absolute;
          backdrop-filter: blur(14px) saturate(180%);
          -webkit-backdrop-filter: blur(14px) saturate(180%);
          background: var(--belvo-bg-card);
          border: 1px solid var(--belvo-border-card);
          box-shadow: 0 8px 32px rgba(0,0,0,0.08);
          display: flex;
          flex-direction: column;
          will-change: transform, opacity;
          transform-style: preserve-3d;
          backface-visibility: hidden;
          text-align: left;
          overflow-y: auto;
          color: var(--belvo-text-1);
          width: 360px;
          height: 340px;
          padding: 1.5rem 1.5rem 0.8rem;
          border-radius: 28px;
        }
        .testimonial-card .avatar-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 0.6rem;
          flex-shrink: 0;
        }
        .testimonial-card .avatar-img {
          width: 66px;
          height: 66px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          border: 2px solid rgba(157,78,221,0.25);
        }
        .testimonial-card .avatar-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .testimonial-card .author-name {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--belvo-text-1);
          letter-spacing: 0.01em;
        }
        .testimonial-card .author-title {
          font-size: 0.7rem;
          color: var(--belvo-text-3);
        }
        .testimonial-card .quote-mark {
          font-size: 2rem;
          line-height: 1.2;
          margin-bottom: 0.2rem;
          opacity: 0.25;
          font-family: serif;
          color: #9D4EDD;
          flex-shrink: 0;
        }
        .testimonial-card .testimonial-text {
          font-size: 0.95rem;
          line-height: 1.5;
          font-weight: 400;
          color: var(--belvo-text-2);
          flex: 1;
        }
        @media (max-width: 768px) {
          .testimonial-card {
            width: 280px;
            height: 280px;
            padding: 1rem 1rem 0.6rem;
            border-radius: 22px;
          }
          .testimonial-card .avatar-img { width: 52px; height: 52px; }
          .testimonial-card .author-name { font-size: 0.85rem; }
          .testimonial-card .author-title { font-size: 0.6rem; }
          .testimonial-card .quote-mark { font-size: 1.5rem; }
          .testimonial-card .testimonial-text { font-size: 0.78rem; }
        }
        @media (max-width: 480px) {
          .testimonial-card {
            width: 220px;
            height: 240px;
            padding: 0.8rem 0.8rem 0.4rem;
            border-radius: 18px;
          }
          .testimonial-card .avatar-img { width: 44px; height: 44px; }
          .testimonial-card .author-name { font-size: 0.75rem; }
          .testimonial-card .author-title { font-size: 0.55rem; }
          .testimonial-card .quote-mark { font-size: 1.2rem; }
          .testimonial-card .testimonial-text { font-size: 0.68rem; }
        }
      `}</style>
      <section
        id="testimonials"
        ref={sectionRef}
        style={{
          background: "var(--belvo-bg)",
          position: "relative",
          contentVisibility: "visible",
          contain: "none",
        }}
      >
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "1px", zIndex: 2,
          background: "linear-gradient(90deg, transparent, var(--belvo-border-divider), transparent)"
        }} />

        <div style={{
          position: "relative", zIndex: 2, maxWidth: "1100px", width: "100%",
          padding: "100px 24px 60px", textAlign: "center", margin: "0 auto",
        }}>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: "0.68rem",
            letterSpacing: "0.35em", textTransform: "uppercase",
            color: "rgba(157,78,221,0.6)", marginBottom: "14px",
          }}>
            Section 06
          </p>
          <h2 style={{
            fontFamily: "'Inter', sans-serif", fontWeight: 900,
            fontSize: "clamp(2rem, 5vw, 3.6rem)", lineHeight: 1.06,
            color: "var(--belvo-text-1)", margin: "0 0 18px",
            letterSpacing: "-0.01em", textTransform: "uppercase",
          }}>
            Client <span style={{ color: "#9D4EDD" }}>Testimonials</span>
          </h2>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: "0.97rem",
            lineHeight: 1.7, color: "var(--belvo-text-2)",
            maxWidth: "520px", margin: "0 auto",
          }}>
            Real words from the people we've worked with. No embellishments — just honest reflections from founders, operators, and teams who trusted us to deliver.
          </p>
        </div>

        <div
          style={{
            position: "sticky",
            top: 0,
            width: "100%",
            height: "100vh",
            overflow: "hidden",
            perspective: "1000px",
            perspectiveOrigin: "50% 50%",
            background: "var(--belvo-bg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            ref={wrapperRef}
            style={{
              position: "relative", width: "100%", height: "100%",
              display: "flex", alignItems: "center", justifyContent: "center",
              transformStyle: "preserve-3d", willChange: "transform",
            }}
          >
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.id}
                data-index={i}
                className="testimonial-card"
              >
                <div className="avatar-row">
                  <div className="avatar-img">
                    <img src={t.image} alt={t.name} />
                  </div>
                  <div>
                    <div className="author-name">{t.name}</div>
                    <div className="author-title">{t.title}</div>
                  </div>
                </div>
                <div className="quote-mark">&ldquo;</div>
                <div className="testimonial-text">{t.text}</div>
              </div>
            ))}
          </div>
        </div>

        <div ref={spacerRef} style={{ height: "200vh", pointerEvents: "none" }} />
      </section>
    </>
  );
}
