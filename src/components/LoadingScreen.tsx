import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

const LETTERS = "BELVO".split("");

const SEED = {
  particles: Array.from({ length: 30 }, (_, i) => {
    const angle = Math.random() * Math.PI * 2;
    return {
      id: i,
      size: 1.5 + Math.random() * 5,
      startX: Math.random() * 100,
      startY: Math.random() * 100,
      driftX: Math.cos(angle) * (40 + Math.random() * 120),
      driftY: Math.sin(angle) * (40 + Math.random() * 120),
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 4,
      baseOpacity: 0.2 + Math.random() * 0.5,
      hue: 260 + Math.random() * 40,
    };
  }),
  orbs: Array.from({ length: 5 }, (_, i) => ({
    id: i,
    size: 120 + Math.random() * 200,
    startX: 10 + Math.random() * 80,
    startY: 10 + Math.random() * 80,
    driftX: (Math.random() - 0.5) * 200,
    driftY: (Math.random() - 0.5) * 200,
    duration: 7 + Math.random() * 5,
    delay: Math.random() * 3,
    color: i % 3 === 0
      ? "rgba(130,40,200,0.12)"
      : i % 3 === 1
        ? "rgba(200,160,255,0.08)"
        : "rgba(100,20,180,0.15)",
  })),
  lines: Array.from({ length: 4 }, (_, i) => ({
    id: i,
    width: 40 + Math.random() * 120,
    height: 1,
    startX: Math.random() * 100,
    startY: 10 + Math.random() * 80,
    driftX: (Math.random() - 0.5) * 100,
    rotation: Math.random() * 360,
    duration: 5 + Math.random() * 3,
    delay: Math.random() * 4,
  })),
};

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [phase, setPhase] = useState<"enter" | "text" | "exit" | "hidden">("enter");
  const doneRef = useRef(onComplete);
  doneRef.current = onComplete;

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      doneRef.current();
      return;
    }

    const t1 = setTimeout(() => setPhase("text"), 300);
    const t2 = setTimeout(() => setPhase("exit"), 3800);
    const t3 = setTimeout(() => {
      setPhase("hidden");
      doneRef.current();
    }, 5000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (phase === "hidden") return null;

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        overflow: "hidden",
        backgroundColor: "#04000e",
      }}
    >
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{
          scale: [1.1, 1.15, 1.12, 1.18, 1.14],
          opacity: 1,
        }}
        transition={{ duration: 5, ease: "easeInOut" }}
        style={{
          position: "absolute",
          inset: -100,
          backgroundImage: `url(/splash-image.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <motion.div
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{
          scale: [1.2, 1.28, 1.24, 1.3, 1.25],
          x: [0, 20, -15, 10, 0],
          opacity: [0, 0.25, 0.2, 0.3, 0.25],
        }}
        transition={{ duration: 5, ease: "easeInOut" }}
        style={{
          position: "absolute",
          inset: -120,
          backgroundImage: `url(/splash-image.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(8px) brightness(0.6)",
        }}
      />

      <motion.div
        animate={{
          background: [
            "radial-gradient(ellipse at 30% 20%, rgba(130,40,200,0.25) 0%, transparent 60%)",
            "radial-gradient(ellipse at 70% 40%, rgba(200,160,255,0.15) 0%, transparent 55%)",
            "radial-gradient(ellipse at 50% 60%, rgba(130,40,200,0.2) 0%, transparent 50%)",
            "radial-gradient(ellipse at 20% 70%, rgba(200,160,255,0.2) 0%, transparent 60%)",
            "radial-gradient(ellipse at 30% 20%, rgba(130,40,200,0.25) 0%, transparent 60%)",
          ],
        }}
        transition={{ duration: 5, ease: "easeInOut" }}
        style={{ position: "absolute", inset: 0 }}
      />

      <motion.div
        animate={{
          background: [
            "linear-gradient(180deg, rgba(4,0,14,0.3) 0%, rgba(4,0,14,0.4) 30%, rgba(4,0,14,0.7) 70%, rgba(4,0,14,0.95) 100%)",
            "linear-gradient(180deg, rgba(4,0,14,0.2) 0%, rgba(4,0,14,0.35) 30%, rgba(4,0,14,0.65) 70%, rgba(4,0,14,0.92) 100%)",
            "linear-gradient(180deg, rgba(4,0,14,0.3) 0%, rgba(4,0,14,0.4) 30%, rgba(4,0,14,0.7) 70%, rgba(4,0,14,0.95) 100%)",
          ],
        }}
        transition={{ duration: 5, ease: "easeInOut" }}
        style={{ position: "absolute", inset: 0 }}
      />

      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.2, 0.5, 0.3],
          rotate: [0, 90, 180, 270, 360],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          inset: -200,
          background:
            "conic-gradient(from 0deg, transparent, rgba(130,40,200,0.03), transparent, rgba(200,160,255,0.02), transparent)",
          pointerEvents: "none",
        }}
      />

      {SEED.orbs.map((orb) => (
        <motion.div
          key={`orb-${orb.id}`}
          initial={{ x: `${orb.startX}vw`, y: `${orb.startY}vh`, opacity: 0 }}
          animate={{
            x: [`${orb.startX}vw`, `${orb.startX + orb.driftX / 100}vw`],
            y: [`${orb.startY}vh`, `${orb.startY + orb.driftY / 100}vh`],
            opacity: [0, 0.8, 0.6, 1, 0],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            delay: orb.delay,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            width: orb.size,
            height: orb.size,
            borderRadius: "50%",
            background: orb.color,
            filter: "blur(60px)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      ))}

      {SEED.particles.map((p) => (
        <motion.div
          key={`p-${p.id}`}
          initial={{ x: `${p.startX}vw`, y: `${p.startY}vh`, opacity: 0, scale: 0 }}
          animate={{
            x: [`${p.startX}vw`, `${p.startX + p.driftX / 100}vw`],
            y: [`${p.startY}vh`, `${p.startY + p.driftY / 100}vh`],
            opacity: [0, p.baseOpacity, p.baseOpacity * 0.5, p.baseOpacity, 0],
            scale: [0, 1, 0.6, 1, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: `hsla(${p.hue}, 80%, 70%, 0.8)`,
            boxShadow: `0 0 ${p.size * 2}px hsla(${p.hue}, 80%, 70%, 0.3)`,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      ))}

      {SEED.lines.map((l) => (
        <motion.div
          key={`line-${l.id}`}
          initial={{
            x: `${l.startX}vw`,
            y: `${l.startY}vh`,
            opacity: 0,
            rotate: l.rotation,
            scaleX: 0,
          }}
          animate={{
            x: [`${l.startX}vw`, `${l.startX + l.driftX / 100}vw`],
            opacity: [0, 0.3, 0.1, 0.4, 0],
            scaleX: [0, 1, 0.5, 1, 0],
          }}
          transition={{
            duration: l.duration,
            repeat: Infinity,
            delay: l.delay,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            width: l.width,
            height: l.height,
            background:
              "linear-gradient(90deg, transparent, rgba(200,160,255,0.4), transparent)",
            pointerEvents: "none",
            zIndex: 1,
            transformOrigin: "center",
          }}
        />
      ))}

      <motion.div
        animate={{
          x: ["-50%", "150%"],
          rotate: [15, 15],
        }}
        transition={{ duration: 4, repeat: Infinity, delay: 1, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "30%",
          height: "100%",
          background:
            "linear-gradient(90deg, transparent, rgba(200,160,255,0.04), transparent)",
          transform: "skewX(-15deg)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {phase !== "enter" && (
        <div
          style={{
            position: "relative",
            zIndex: 2,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "2rem",
          }}
        >
          <div
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "clamp(3rem, 10vw, 7rem)",
              color: "#fff",
              letterSpacing: "0.08em",
              textShadow: "0 4px 40px rgba(0,0,0,0.6)",
              perspective: "800px",
            }}
          >
            {LETTERS.map((letter, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 50, rotateX: -40 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  duration: 0.55,
                  delay: 0.15 + i * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{ display: "inline-block" }}
              >
                {letter}
              </motion.span>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.9,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(1rem, 3vw, 1.8rem)",
              color: "rgba(255,255,255,0.72)",
              letterSpacing: "0.25em",
              marginTop: "1.5rem",
              textShadow: "0 2px 20px rgba(0,0,0,0.5)",
              fontWeight: 300,
              textTransform: "uppercase",
            }}
          >
            A Perfect Agency For Your Brand
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              duration: 0.8,
              delay: 1.6,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              height: 1,
              width: "clamp(80px, 15vw, 180px)",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
              marginTop: "2rem",
              transformOrigin: "center",
            }}
          />
        </div>
      )}

      {phase === "exit" && (
        <motion.div
          initial={{ clipPath: "circle(0% at 50% 50%)" }}
          animate={{ clipPath: "circle(100% at 50% 50%)" }}
          transition={{ duration: 1.1, ease: [0.45, 0, 0.55, 1] }}
          style={{
            position: "absolute",
            inset: 0,
            background: "#04000e",
            zIndex: 3,
            pointerEvents: "none",
          }}
        />
      )}
    </motion.div>
  );
}
