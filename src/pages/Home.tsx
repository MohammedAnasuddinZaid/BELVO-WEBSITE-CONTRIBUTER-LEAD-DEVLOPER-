import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Play, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import About from "@/sections/About";
import BookACall from "@/sections/BookACall";
import Footer from "@/sections/Footer";
import ServicesSection from "@/sections/ServicesSection";
import TeamSection from "@/sections/TeamSection";
import Testimonials from "@/sections/Testimonials";
import PortfolioSection from "@/sections/PortfolioSection";
import UpcomingEvents from "@/sections/UpcomingEvents";
import FAQ from "@/sections/FAQ";
import ExploreSection from "@/sections/ExploreSection";

function jumpToVideoShowcase() {
  const videoShowcase = document.getElementById("belvo-videos");
  if (!videoShowcase) return;

  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;
  const targetTop = window.scrollY + videoShowcase.getBoundingClientRect().top
    - Math.max(80, (window.innerHeight - videoShowcase.offsetHeight) / 2);

  root.style.scrollBehavior = "auto";
  window.scrollTo(0, Math.max(0, targetTop));
  window.requestAnimationFrame(() => {
    root.style.scrollBehavior = previousScrollBehavior;
  });
}

function MagneticButton({ children, className, style, onClick, as: Component = "button", ...props }: any) {
  const ref = useRef<HTMLElement>(null);

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const dist = Math.sqrt(x * x + y * y);
    const maxDist = 150;
    const strength = Math.max(0, 1 - dist / maxDist);
    el.style.transform = `translate(${x * 0.25 * strength}px, ${y * 0.25 * strength}px) scale(${1 + 0.03 * strength})`;
  };

  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0) scale(1)";
  };

  return (
    <Component
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      className={className}
      style={{ ...style, transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
      {...props}
    >
      {children}
    </Component>
  );
}

function AuroraWaves() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <filter id="glow-strong" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur2" />
          <feMerge><feMergeNode in="blur2" /><feMergeNode in="blur1" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow-soft" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="28" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow-ambient" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="55" />
        </filter>
        <filter id="particle-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
        </filter>
        <style>{`
          @keyframes wave1 {
            0%   { d: path("M-100 520 C 120 380, 340 600, 560 420 S 820 200, 1000 380 S 1250 560, 1540 400"); }
            25%  { d: path("M-100 490 C 140 360, 360 580, 540 400 S 840 180, 1020 360 S 1270 540, 1540 380"); }
            50%  { d: path("M-100 460 C 100 340, 380 560, 580 380 S 860 160, 1040 340 S 1280 520, 1540 360"); }
            75%  { d: path("M-100 500 C 130 370, 350 590, 550 410 S 830 190, 1010 370 S 1260 550, 1540 390"); }
            100% { d: path("M-100 520 C 120 380, 340 600, 560 420 S 820 200, 1000 380 S 1250 560, 1540 400"); }
          }
          @keyframes wave2 {
            0%   { d: path("M-100 560 C 150 420, 320 640, 540 460 S 800 240, 980 420 S 1220 600, 1540 440"); }
            25%  { d: path("M-100 530 C 170 400, 300 620, 520 440 S 820 220, 1000 400 S 1240 580, 1540 420"); }
            50%  { d: path("M-100 500 C 130 380, 360 600, 560 420 S 840 200, 1020 380 S 1260 560, 1540 400"); }
            75%  { d: path("M-100 540 C 160 410, 310 630, 530 450 S 810 230, 990 410 S 1230 590, 1540 430"); }
            100% { d: path("M-100 560 C 150 420, 320 640, 540 460 S 800 240, 980 420 S 1220 600, 1540 440"); }
          }
          @keyframes wave3 {
            0%   { d: path("M-100 440 C 200 300, 400 500, 620 340 S 880 120, 1060 300 S 1300 480, 1540 320"); }
            50%  { d: path("M-100 460 C 180 320, 420 520, 640 360 S 900 140, 1080 320 S 1320 500, 1540 340"); }
            100% { d: path("M-100 440 C 200 300, 400 500, 620 340 S 880 120, 1060 300 S 1300 480, 1540 320"); }
          }
          @keyframes float-particle {
            0% { transform: translate(0, 0) scale(1); opacity: 0; }
            20% { opacity: 1; }
            80% { opacity: 1; }
            100% { transform: translate(var(--dx), var(--dy)) scale(0); opacity: 0; }
          }
          @keyframes morphBlob {
            0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
            50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
            100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          }
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
          .wave-path-1 { animation: wave1 9s ease-in-out infinite; }
          .wave-path-2 { animation: wave2 11s ease-in-out infinite; }
          .wave-path-3 { animation: wave3 7s ease-in-out infinite; }
          .particle {
            animation: float-particle var(--dur) ease-in-out infinite;
            animation-delay: var(--del);
          }
          .morph-blob {
            animation: morphBlob 12s ease-in-out infinite;
          }
          .shimmer-text {
            background: linear-gradient(90deg, #9D4EDD 0%, #B06AE8 25%, #7B2FBE 50%, #B06AE8 75%, #9D4EDD 100%);
            background-size: 200% 100%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: shimmer 3s ease-in-out infinite;
          }
        `}</style>
      </defs>

      <ellipse cx="720" cy="450" rx="520" ry="300" fill="rgba(90,20,160,0.22)" filter="url(#glow-ambient)">
        <animate attributeName="rx" values="520;580;520" dur="8s" repeatCount="indefinite" />
        <animate attributeName="ry" values="300;340;300" dur="8s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="200" cy="550" rx="320" ry="200" fill="rgba(100,20,180,0.18)" filter="url(#glow-ambient)">
        <animate attributeName="rx" values="320;370;320" dur="10s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="1240" cy="350" rx="300" ry="180" fill="rgba(80,15,150,0.16)" filter="url(#glow-ambient)">
        <animate attributeName="rx" values="300;350;300" dur="7s" repeatCount="indefinite" />
        <animate attributeName="cy" values="350;330;350" dur="9s" repeatCount="indefinite" />
      </ellipse>

      <path className="wave-path-1" d="M-100 520 C 120 380, 340 600, 560 420 S 820 200, 1000 380 S 1250 560, 1540 400"
        stroke="rgba(120,30,210,0.18)" strokeWidth="120" fill="none" filter="url(#glow-ambient)" />
      <path className="wave-path-2" d="M-100 560 C 150 420, 320 640, 540 460 S 800 240, 980 420 S 1220 600, 1540 440"
        stroke="rgba(140,40,220,0.35)" strokeWidth="30" fill="none" filter="url(#glow-soft)" />
      <path className="wave-path-3" d="M-100 440 C 200 300, 400 500, 620 340 S 880 120, 1060 300 S 1300 480, 1540 320"
        stroke="rgba(160,60,240,0.55)" strokeWidth="3" fill="none" filter="url(#glow-strong)" />
      <path className="wave-path-1" d="M-100 520 C 120 380, 340 600, 560 420 S 820 200, 1000 380 S 1250 560, 1540 400"
        stroke="rgba(180,80,255,0.65)" strokeWidth="1.5" fill="none" filter="url(#glow-strong)" />
      <path className="wave-path-2" d="M-100 560 C 150 420, 320 640, 540 460 S 800 240, 980 420 S 1220 600, 1540 440"
        stroke="rgba(150,50,230,0.5)" strokeWidth="2" fill="none" filter="url(#glow-strong)" />

      {[
        [120, 160], [310, 80], [490, 220], [680, 100], [870, 250], [1050, 130], [1230, 200], [1380, 90],
        [200, 700], [450, 760], [700, 680], [950, 750], [1150, 700], [1340, 760],
        [80, 420], [1460, 380], [360, 500], [1100, 480],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={i % 3 === 0 ? 1.5 : 1}
          fill={i % 2 === 0 ? "rgba(200,140,255,0.7)" : "rgba(255,255,255,0.4)"}>
          <animate attributeName="opacity" values="0.4;1;0.4" dur={`${3 + i % 4}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {Array.from({ length: 30 }).map((_, i) => (
        <circle key={`float-${i}`} className="particle"
          cx={100 + Math.random() * 1240} cy={100 + Math.random() * 700}
          r={1 + Math.random() * 2.5}
          fill={i % 2 === 0 ? "rgba(200,140,255,0.8)" : "rgba(157,78,221,0.6)"}
          filter="url(#particle-glow)"
          style={{
            "--dx": `${(Math.random() - 0.5) * 300}px`,
            "--dy": `${-(60 + Math.random() * 200)}px`,
            "--dur": `${6 + Math.random() * 10}s`,
            "--del": `${Math.random() * 12}s`,
          } as React.CSSProperties}
        />
      ))}
    </svg>
  );
}

function FloatingOrbs() {
  return (
    <>
      {[
        { size: 60, x: "15%", y: "20%", dur: 7, color: "rgba(157,78,221,0.08)" },
        { size: 40, x: "80%", y: "30%", dur: 9, color: "rgba(201,163,65,0.06)" },
        { size: 80, x: "70%", y: "70%", dur: 11, color: "rgba(157,78,221,0.05)" },
        { size: 50, x: "25%", y: "75%", dur: 8, color: "rgba(201,163,65,0.04)" },
      ].map((orb, i) => (
        <motion.div
          key={i}
          className="morph-blob"
          style={{
            position: "absolute",
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: orb.color,
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
          animate={{
            y: [0, -30, 0, 20, 0],
            x: [0, 20, -15, 10, 0],
            scale: [1, 1.2, 0.9, 1.1, 1],
          }}
          transition={{
            duration: orb.dur,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
}

const itemUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.75, delay: i * 0.18, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function Home() {
  const [showNaivaidyaSoon, setShowNaivaidyaSoon] = useState(false);

  useEffect(() => {
    if (!showNaivaidyaSoon) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowNaivaidyaSoon(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [showNaivaidyaSoon]);

  return (
    <>
      {/* ── HERO ── */}
      <div
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden text-white"
        style={{ background: "var(--belvo-bg)" }}
      >
        <div className="absolute inset-0 z-0 pointer-events-none">
          <AuroraWaves />
          <FloatingOrbs />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 30%, var(--belvo-vignette-1) 100%)" }} />
          <div className="absolute inset-x-0 top-0 h-32" style={{ background: "linear-gradient(to bottom, var(--belvo-vignette-2), transparent)" }} />
          <div className="absolute inset-x-0 bottom-0 h-40" style={{ background: "linear-gradient(to top, var(--belvo-vignette-3), transparent)" }} />
          <div className="absolute inset-y-0 left-0 w-32" style={{ background: "linear-gradient(to right, var(--belvo-vignette-4), transparent)" }} />
          <div className="absolute inset-y-0 right-0 w-32" style={{ background: "linear-gradient(to left, var(--belvo-vignette-4), transparent)" }} />
        </div>

        <motion.div
          className="relative z-10 flex flex-col items-center text-center px-4 w-full max-w-4xl mx-auto pt-20"
        >
          <motion.div custom={0} variants={itemUp} initial="hidden" animate="visible" className="mb-3">
            <img
              src="/belvo-logo-transparent.png"
              alt="BELVO"
              className="w-auto object-contain"
              data-testid="img-hero-logo"
              style={{ height: "clamp(7rem, 14vw, 12rem)", clipPath: "inset(0 0 38% 0)", marginBottom: "-2rem", filter: "drop-shadow(0 0 20px rgba(157,78,221,0.3))" }}
            />
          </motion.div>

          <motion.div custom={1} variants={itemUp} initial="hidden" animate="visible" className="mb-1">
            <span className="font-semibold tracking-[0.35em] text-xl md:text-2xl"
              style={{ fontFamily: "'Inter', sans-serif", color: "var(--belvo-text-1)" }}>
              BELVO
            </span>
          </motion.div>

          <motion.div custom={2} variants={itemUp} initial="hidden" animate="visible" className="mb-10">
            <motion.span
              className="tracking-[0.4em] text-xs uppercase font-medium shimmer-text"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Growth Core
            </motion.span>
          </motion.div>

          <motion.h1
            custom={3} variants={itemUp} initial="hidden" animate="visible"
            className="leading-[1.05] font-black uppercase mb-5 w-full"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(2.2rem, 5.8vw, 5.8rem)", fontWeight: 900 }}
          >
            <span className="block" style={{ color: "var(--belvo-text-1)" }}>
              A Perfect Agency
            </span>
            <span className="block" style={{ color: "#5B1A8A" }}>
              For Your Brand.
            </span>
          </motion.h1>

          <motion.p
            custom={4} variants={itemUp} initial="hidden" animate="visible"
            className="max-w-lg text-sm md:text-base leading-relaxed mb-10"
            style={{ color: "var(--belvo-text-2)", fontWeight: 350, letterSpacing: "0.02em" }}
          >
            Belvo Builds your brand from scratch.<br />
            Helps ideas to come into reality.<br />
            Helps you to scale your business globally<br />
            and compete with your competitors.
          </motion.p>

          <motion.div
            custom={5} variants={itemUp} initial="hidden" animate="visible"
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <MagneticButton
              onClick={jumpToVideoShowcase}
              data-testid="button-hero-videos"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 font-semibold text-sm tracking-[0.12em] uppercase"
              style={{
                background: "linear-gradient(135deg, #7B2FBE, #9D4EDD)",
                borderRadius: "8px", color: "#ffffff",
                boxShadow: "0 0 32px rgba(130,40,200,0.4)", border: "none", cursor: "pointer",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 48px rgba(157,78,221,0.6)";
                (e.currentTarget as HTMLElement).style.background = "linear-gradient(135deg, #9D4EDD, #B06AE8)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 32px rgba(130,40,200,0.4)";
                (e.currentTarget as HTMLElement).style.background = "linear-gradient(135deg, #7B2FBE, #9D4EDD)";
              }}
            >
              Explore Videos
              <motion.span
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                style={{ display: "inline-flex" }}
              >
                <Play size={14} fill="currentColor" strokeWidth={0} />
              </motion.span>
            </MagneticButton>

            <MagneticButton
              onClick={() => setShowNaivaidyaSoon(true)}
              data-testid="button-hero-naivaidya"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 font-semibold text-sm tracking-[0.12em] uppercase"
              style={{
                background: "var(--belvo-bg-card)",
                border: "1px solid var(--belvo-border-card)",
                borderRadius: "8px", color: "var(--belvo-text-1)",
                cursor: "pointer", textDecoration: "none",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = "var(--belvo-bg-card-2)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(157,78,221,0.4)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = "var(--belvo-bg-card)";
                (e.currentTarget as HTMLElement).style.borderColor = "var(--belvo-border-card)";
              }}
            >
              <motion.span
                animate={{ x: [0, 2, 0], y: [0, -2, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                style={{ display: "inline-flex" }}
              >
                <ArrowUpRight size={15} strokeWidth={2.4} />
              </motion.span>
              Explore Naivaidya
            </MagneticButton>
          </motion.div>
        </motion.div>

      </div>

      {/* ── SECTIONS ── */}
      <About />
      <ServicesSection id="services" />
      <PortfolioSection id="portfolio" />
      <ExploreSection />
      <TeamSection />
      <Testimonials />

      <UpcomingEvents />
      <BookACall />
      <FAQ />
      <Footer />

      <AnimatePresence>
        {showNaivaidyaSoon && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="naivaidya-coming-soon-title"
            data-testid="naivaidya-coming-soon-dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setShowNaivaidyaSoon(false)}
            className="fixed inset-0 z-[100] grid place-items-center px-5 py-8"
            style={{
              background: "rgba(12, 5, 22, 0.68)",
              backdropFilter: "blur(14px)",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 22, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.98 }}
              transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
              onClick={(event) => event.stopPropagation()}
              className="relative w-full max-w-[520px] overflow-hidden p-8 sm:p-10"
              style={{
                borderRadius: "28px",
                border: "1px solid var(--belvo-border-card)",
                background: "var(--belvo-bg-card)",
                boxShadow: "0 30px 100px rgba(12, 5, 22, 0.38)",
              }}
            >
              <div
                aria-hidden="true"
                className="absolute -right-20 -top-24 h-64 w-64 rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(157,78,221,0.24), transparent 68%)",
                }}
              />

              <button
                type="button"
                aria-label="Close Naivaidya coming soon"
                data-testid="button-close-naivaidya-dialog"
                onClick={() => setShowNaivaidyaSoon(false)}
                className="absolute right-5 top-5 z-10 grid h-10 w-10 place-items-center rounded-full"
                style={{
                  border: "1px solid var(--belvo-border-card)",
                  background: "var(--belvo-bg-card-2)",
                  color: "var(--belvo-text-1)",
                  cursor: "pointer",
                }}
              >
                <X size={18} />
              </button>

              <div className="relative z-[1]">
                <div
                  className="mb-6 inline-flex items-center gap-2 rounded-full px-3 py-2 text-[0.68rem] font-bold uppercase tracking-[0.16em]"
                  style={{
                    color: "#9D4EDD",
                    background: "rgba(157,78,221,0.1)",
                    border: "1px solid rgba(157,78,221,0.22)",
                  }}
                >
                  In the works
                </div>

                <h2
                  id="naivaidya-coming-soon-title"
                  className="mb-4 pr-10 text-[2.35rem] font-bold leading-[0.98] sm:text-[3.2rem]"
                  style={{
                    color: "var(--belvo-text-1)",
                    fontFamily: "'Cormorant Garamond', serif",
                  }}
                >
                  Naivaidya is coming soon.
                </h2>
                <p
                  className="mb-7 max-w-md text-sm leading-7 sm:text-base"
                  style={{ color: "var(--belvo-text-2)" }}
                >
                  We&apos;re adding the final polish before the big reveal. The full experience will be ready to explore soon—and it&apos;ll be worth the wait.
                </p>
                <button
                  type="button"
                  onClick={() => setShowNaivaidyaSoon(false)}
                  className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white"
                  style={{
                    background: "linear-gradient(135deg, #7B2FBE, #9D4EDD)",
                    boxShadow: "0 12px 30px rgba(123,47,190,0.28)",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
