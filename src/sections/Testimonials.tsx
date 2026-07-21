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
  if (w <= 480) return 170;
  if (w <= 768) return 240;
  return 340;
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
        y: radius * 0.45 * Math.sin(angle) - 10,
        z: radius * Math.sin(angle),
      };
    }

    function updateCards(progress: number) {
      const p = Math.min(1, Math.max(0, progress));

      for (let i = 0; i < count; i++) {
        const card = cards[i];
        if (!card) continue;

        const ferris = getFerrisPos(i, p * Math.PI * 1.8);

        const stackY = 40 - i * 8;
        const stackZ = -i * 2;

        const blendStart = 0.55;
        const blend = p > blendStart ? (p - blendStart) / (1 - blendStart) : 0;
        const easeBlend = blend * blend * (3 - 2 * blend);

        const finalX = ferris.x * (1 - easeBlend);
        const finalY = ferris.y * (1 - easeBlend) + stackY * easeBlend;
        const finalZ = ferris.z * (1 - easeBlend) + stackZ * easeBlend;

        const baseOpacity = 0.4 + 0.6 * ((ferris.z / radius) + 1) / 2;
        const clampedOpacity = Math.min(1, Math.max(0.2, baseOpacity));
        const finalOpacity = clampedOpacity * (1 - easeBlend) + 0.95 * easeBlend;

        let transform = `translate3d(${finalX}px, ${finalY}px, ${finalZ}px)`;
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
          start: "top top",
          end: "bottom bottom",
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
          width: 360px !important;
          height: 340px !important;
          padding: 1.5rem 1.5rem 0.8rem !important;
          border-radius: 28px !important;
        }
        .testimonial-card .testimonial-text {
          font-size: 0.95rem !important;
          line-height: 1.6 !important;
        }
        .testimonial-card .quote-mark {
          font-size: 2rem !important;
        }
        .testimonial-card .author-name {
          font-size: 1.05rem !important;
        }
        .testimonial-card .author-title {
          font-size: 0.7rem !important;
        }
        .testimonial-card .avatar-img {
          width: 66px !important;
          height: 66px !important;
        }
        @media (max-width: 768px) {
          .testimonial-card {
            width: 280px !important;
            height: 280px !important;
            padding: 1rem 1rem 0.6rem !important;
            border-radius: 22px !important;
          }
          .testimonial-card .testimonial-text {
            font-size: 0.78rem !important;
          }
          .testimonial-card .quote-mark {
            font-size: 1.5rem !important;
          }
          .testimonial-card .author-name {
            font-size: 0.85rem !important;
          }
          .testimonial-card .author-title {
            font-size: 0.6rem !important;
          }
          .testimonial-card .avatar-img {
            width: 52px !important;
            height: 52px !important;
          }
        }
        @media (max-width: 480px) {
          .testimonial-card {
            width: 220px !important;
            height: 240px !important;
            padding: 0.8rem 0.8rem 0.4rem !important;
            border-radius: 18px !important;
          }
          .testimonial-card .testimonial-text {
            font-size: 0.68rem !important;
          }
          .testimonial-card .quote-mark {
            font-size: 1.2rem !important;
          }
          .testimonial-card .author-name {
            font-size: 0.75rem !important;
          }
          .testimonial-card .author-title {
            font-size: 0.55rem !important;
          }
          .testimonial-card .avatar-img {
            width: 44px !important;
            height: 44px !important;
          }
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
            width: "100vw",
            height: "100vh",
            overflow: "hidden",
            perspective: "1000px",
            perspectiveOrigin: "50% 50%",
            background: "#f6f1ee",
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
                style={{
                  position: "absolute",
                  backdropFilter: "blur(14px) saturate(180%)",
                  WebkitBackdropFilter: "blur(14px) saturate(180%)",
                  background: "rgba(255,255,255,0.85)",
                  border: "1px solid rgba(0,0,0,0.08)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  willChange: "transform, opacity",
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                  textAlign: "left",
                  overflowY: "auto",
                  color: "#1a1a2e",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "0.6rem", flexShrink: 0 }}>
                  <div className="avatar-img" style={{
                    borderRadius: "50%", overflow: "hidden", flexShrink: 0,
                    border: "2px solid rgba(157,78,221,0.25)",
                  }}>
                    <img
                      src={t.image}
                      alt={t.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  </div>
                  <div>
                    <div className="author-name" style={{
                      fontWeight: 700, color: "#1a1a2e",
                      letterSpacing: "0.01em",
                    }}>
                      {t.name}
                    </div>
                    <div className="author-title" style={{
                      opacity: 0.5, color: "rgba(26,26,46,0.6)",
                    }}>
                      {t.title}
                    </div>
                  </div>
                </div>
                <div className="quote-mark" style={{
                  lineHeight: 1.2, marginBottom: "0.2rem",
                  opacity: 0.25, fontFamily: "serif", color: "#9D4EDD", flexShrink: 0,
                }}>
                  &ldquo;
                </div>
                <div className="testimonial-text" style={{
                  lineHeight: 1.5, fontWeight: 400,
                  color: "rgba(26,26,46,0.75)", flex: 1,
                }}>
                  {t.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div ref={spacerRef} style={{ height: "400vh", pointerEvents: "none" }} />
      </section>
    </>
  );
}
