import { motion } from "framer-motion";
import { ArrowUpRight, Play } from "lucide-react";
import BookACall from "@/sections/BookACall";
import Footer from "@/sections/Footer";
import ServicesSection from "@/sections/ServicesSection";
import TeamSection from "@/sections/TeamSection";
import About from "@/sections/About";
import Testimonials from "@/sections/Testimonials";
import PortfolioSection from "@/sections/PortfolioSection";
import UpcomingEvents from "@/sections/UpcomingEvents";

function AuroraWaves() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
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
        <style>{`
          @keyframes wave1 {
            0%   { d: path("M-100 520 C 120 380, 340 600, 560 420 S 820 200, 1000 380 S 1250 560, 1540 400"); }
            50%  { d: path("M-100 480 C 100 340, 380 560, 580 380 S 860 160, 1040 340 S 1280 520, 1540 360"); }
            100% { d: path("M-100 520 C 120 380, 340 600, 560 420 S 820 200, 1000 380 S 1250 560, 1540 400"); }
          }
          @keyframes wave2 {
            0%   { d: path("M-100 560 C 150 420, 320 640, 540 460 S 800 240, 980 420 S 1220 600, 1540 440"); }
            50%  { d: path("M-100 520 C 130 380, 360 600, 560 420 S 840 200, 1020 380 S 1260 560, 1540 400"); }
            100% { d: path("M-100 560 C 150 420, 320 640, 540 460 S 800 240, 980 420 S 1220 600, 1540 440"); }
          }
          @keyframes wave3 {
            0%   { d: path("M-100 440 C 200 300, 400 500, 620 340 S 880 120, 1060 300 S 1300 480, 1540 320"); }
            50%  { d: path("M-100 460 C 180 320, 420 520, 640 360 S 900 140, 1080 320 S 1320 500, 1540 340"); }
            100% { d: path("M-100 440 C 200 300, 400 500, 620 340 S 880 120, 1060 300 S 1300 480, 1540 320"); }
          }
          .wave-path-1 { animation: wave1 9s ease-in-out infinite; }
          .wave-path-2 { animation: wave2 11s ease-in-out infinite; }
          .wave-path-3 { animation: wave3 7s ease-in-out infinite; }
        `}</style>
      </defs>

      <ellipse cx="720" cy="450" rx="520" ry="300" fill="rgba(90,20,160,0.22)" filter="url(#glow-ambient)" />
      <ellipse cx="200" cy="550" rx="320" ry="200" fill="rgba(100,20,180,0.18)" filter="url(#glow-ambient)" />
      <ellipse cx="1240" cy="350" rx="300" ry="180" fill="rgba(80,15,150,0.16)" filter="url(#glow-ambient)" />

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
          fill={i % 2 === 0 ? "rgba(200,140,255,0.7)" : "rgba(255,255,255,0.4)"} />
      ))}
    </svg>
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
  return (
    <>
      <div
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden text-white"
        style={{ background: "var(--belvo-bg)" }}
      >
        <div className="absolute inset-0 z-0 pointer-events-none">
          <AuroraWaves />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 30%, var(--belvo-vignette-1) 100%)" }} />
          <div className="absolute inset-x-0 top-0 h-32" style={{ background: "linear-gradient(to bottom, var(--belvo-vignette-2), transparent)" }} />
          <div className="absolute inset-x-0 bottom-0 h-40" style={{ background: "linear-gradient(to top, var(--belvo-vignette-3), transparent)" }} />
          <div className="absolute inset-y-0 left-0 w-32" style={{ background: "linear-gradient(to right, var(--belvo-vignette-4), transparent)" }} />
          <div className="absolute inset-y-0 right-0 w-32" style={{ background: "linear-gradient(to left, var(--belvo-vignette-4), transparent)" }} />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-4 w-full max-w-4xl mx-auto pt-20">
          <motion.div custom={0} variants={itemUp} initial="hidden" animate="visible" className="mb-3">
            <img
              src="/belvo-logo-transparent.png"
              alt="BELVO"
              className="w-auto object-contain"
              data-testid="img-hero-logo"
              style={{ height: "clamp(7rem, 14vw, 12rem)", clipPath: "inset(0 0 38% 0)", marginBottom: "-2rem" }}
            />
          </motion.div>

          <motion.div custom={1} variants={itemUp} initial="hidden" animate="visible" className="mb-1">
            <span className="font-semibold tracking-[0.35em] text-xl md:text-2xl" style={{ fontFamily: "'Inter', sans-serif", color: "var(--belvo-text-1)" }}>
              BELVO
            </span>
          </motion.div>

          <motion.div custom={2} variants={itemUp} initial="hidden" animate="visible" className="mb-10">
            <span className="tracking-[0.4em] text-xs uppercase font-medium" style={{ color: "#9D4EDD", fontFamily: "'Inter', sans-serif" }}>
              Growth Core
            </span>
          </motion.div>

          <motion.h1
            custom={3} variants={itemUp} initial="hidden" animate="visible"
            className="leading-[1.05] font-black uppercase mb-5 w-full"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(2.2rem, 5.8vw, 5.8rem)", fontWeight: 900 }}
          >
            <span className="block" style={{ color: "var(--belvo-text-1)" }}>A Perfect Agency</span>
            <span className="block" style={{ color: "#9D4EDD" }}>For Your Brand.</span>
          </motion.h1>

          <motion.p
            custom={4} variants={itemUp} initial="hidden" animate="visible"
            className="max-w-lg text-sm md:text-base leading-relaxed mb-10"
            style={{ color: "var(--belvo-text-3)", fontWeight: 300, letterSpacing: "0.01em" }}
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
            <button
              onClick={() => document.getElementById("book-a-call")?.scrollIntoView({ behavior: "smooth" })}
              data-testid="button-hero-cta"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 font-semibold text-sm tracking-[0.12em] uppercase"
              style={{
                background: "linear-gradient(135deg, #7B2FBE, #9D4EDD)",
                borderRadius: "8px", color: "#ffffff",
                boxShadow: "0 0 32px rgba(130,40,200,0.4)", border: "none", cursor: "pointer",
                transition: "box-shadow 0.3s, background 0.3s",
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
              Book A Free Call
              <ArrowUpRight size={15} strokeWidth={2.5} />
            </button>

            <button
              onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
              data-testid="button-hero-services"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 font-semibold text-sm tracking-[0.12em] uppercase"
              style={{
                background: "var(--belvo-bg-card)",
                border: "1px solid var(--belvo-border-card)",
                borderRadius: "8px", color: "var(--belvo-text-1)",
                cursor: "pointer",
                transition: "background 0.3s, border-color 0.3s",
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
              <Play size={13} fill="currentColor" strokeWidth={0} />
              View Services
            </button>
          </motion.div>
        </div>
      </div>

      <About />
      <ServicesSection id="services" />
      <PortfolioSection id="portfolio" />
      <UpcomingEvents />
      <Testimonials />
      <TeamSection />
      <BookACall />
      <Footer />
    </>
  );
}
