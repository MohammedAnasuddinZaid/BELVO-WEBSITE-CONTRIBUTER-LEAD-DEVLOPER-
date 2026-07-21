import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

const LETTERS = "BELVO".split("");

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
    const t2 = setTimeout(() => setPhase("exit"), 3500);
    const t3 = setTimeout(() => {
      setPhase("hidden");
      doneRef.current();
    }, 4600);

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
        initial={{ scale: 1.25, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "absolute",
          inset: -60,
          backgroundImage: `url(/splash-image.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(4,0,14,0.25) 0%, rgba(4,0,14,0.5) 35%, rgba(4,0,14,0.92) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(0deg, rgba(130,40,200,0.12) 0%, transparent 60%)",
        }}
      />

      {phase !== "enter" && (
        <div
          style={{
            position: "relative",
            zIndex: 1,
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
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
      )}
    </motion.div>
  );
}
