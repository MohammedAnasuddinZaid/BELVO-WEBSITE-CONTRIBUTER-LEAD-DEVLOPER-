import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [visible, setVisible] = useState(true);
  const progress = useMotionValue(0);
  const smoothProgress = useSpring(progress, { stiffness: 50, damping: 15 });
  const width = useTransform(smoothProgress, [0, 100], ["0%", "100%"]);

  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const duration = 2600;

    function tick(now: number) {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 2);
      progress.set(eased * 100);

      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setVisible(false);
          onComplete();
        }, 500);
      }
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!visible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#04000e" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Dynamic ambient background layers */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: [0.25, 0.55, 0.25], scale: [1, 1.2, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background: "radial-gradient(ellipse at 50% 35%, rgba(130,40,200,0.12) 0%, transparent 60%)",
            transformOrigin: "center",
          }}
        />
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: [0.15, 0.4, 0.15], scale: [1.15, 1, 1.15] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          style={{
            background: "radial-gradient(ellipse at 50% 65%, rgba(100,25,180,0.08) 0%, transparent 55%)",
            transformOrigin: "center",
          }}
        />
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          style={{
            background: "radial-gradient(ellipse at 50% 50%, rgba(180,140,240,0.04) 0%, transparent 50%)",
          }}
        />
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: [0.2, 0.45, 0.2], scale: [1, 1.25, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          style={{
            background: "radial-gradient(ellipse at 30% 70%, rgba(80,15,150,0.06) 0%, transparent 50%)",
            transformOrigin: "center",
          }}
        />
      </div>

      <motion.div
        className="flex flex-col items-center"
        animate={{ y: [0, -5, 0], rotate: [0, 2.5, 0, -2.5, 0] }}
        transition={{
          y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 9, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <Droplet />

        <div className="mt-10 md:mt-12 w-32 sm:w-36 md:w-44">
          <div
            className="relative h-[2px] w-full overflow-hidden rounded-full"
            style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
          >
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{ width, background: "hsl(272, 65%, 52%)" }}
              animate={{
                boxShadow: [
                  "0 0 2px rgba(130,40,200,0.2)",
                  "0 0 8px rgba(130,40,200,0.4)",
                  "0 0 2px rgba(130,40,200,0.2)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Droplet() {
  return (
    <div className="w-[110px] h-[130px] sm:w-[130px] sm:h-[150px] md:w-[150px] md:h-[175px] lg:w-[160px] lg:h-[185px]">
      <svg
        viewBox="0 0 100 115"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient
            id="bodyGrad"
            x1="0.2"
            y1="0"
            x2="0.8"
            y2="1"
          >
            <stop offset="0%" stopColor="rgba(255,255,255,0.10)" />
            <stop offset="35%" stopColor="rgba(200,180,255,0.04)" />
            <stop offset="70%" stopColor="rgba(255,255,255,0.02)" />
            <stop offset="100%" stopColor="rgba(180,150,230,0.08)" />
          </linearGradient>

          <radialGradient id="specular" cx="0.4" cy="0.4" r="0.6">
            <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>

          <linearGradient id="leftReflect" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>

          <linearGradient id="caustic" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(200,180,255,0)" />
            <stop offset="50%" stopColor="rgba(200,180,255,0.06)" />
            <stop offset="100%" stopColor="rgba(200,180,255,0)" />
          </linearGradient>

          <linearGradient id="innerGlow" x1="0.3" y1="0" x2="0.7" y2="1">
            <stop offset="0%" stopColor="rgba(200,180,255,0.03)" />
            <stop offset="100%" stopColor="rgba(200,180,255,0)" />
          </linearGradient>

          <filter id="shadowGlow">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>

          <filter id="rimGlow">
            <feGaussianBlur stdDeviation="1" />
          </filter>
        </defs>

        {/* Ground shadow */}
        <ellipse
          cx="50"
          cy="109"
          rx="28"
          ry="3"
          fill="rgba(130,40,200,0.12)"
          filter="url(#shadowGlow)"
        />

        {/* Outer ambient glow */}
        <path
          d="M 50,0 C 70,12 92,42 88,72 C 85,92 72,105 50,108 C 28,105 15,92 12,72 C 8,42 30,12 50,0 Z"
          fill="rgba(130,40,200,0.05)"
          filter="url(#rimGlow)"
          transform="scale(1.03) translate(-1.5,-2)"
        />

        {/* Main droplet body */}
        <path
          d="M 50,0 C 70,12 92,42 88,72 C 85,92 72,105 50,108 C 28,105 15,92 12,72 C 8,42 30,12 50,0 Z"
          fill="url(#bodyGrad)"
          stroke="rgba(255,255,255,0.10)"
          strokeWidth="0.6"
        />

        {/* Inner volume glow */}
        <path
          d="M 50,4 C 67,14 86,42 83,70 C 80,88 68,102 50,104 C 32,102 20,88 17,70 C 14,42 33,14 50,4 Z"
          fill="url(#innerGlow)"
        />

        {/* Bottom refraction line */}
        <path
          d="M 12,72 C 15,92 28,105 50,108 C 72,105 85,92 88,72"
          stroke="rgba(200,180,255,0.04)"
          strokeWidth="1"
          fill="none"
        />

        {/* Left crescent highlight */}
        <path
          d="M 20,55 C 22,38 32,20 46,6 C 42,14 30,35 26,55 C 24,68 28,82 36,90 C 30,85 22,72 20,55 Z"
          fill="url(#leftReflect)"
        />

        {/* Specular highlight - upper right area */}
        <ellipse
          cx="40"
          cy="22"
          rx="4.5"
          ry="7"
          transform="rotate(-25, 40, 22)"
          fill="url(#specular)"
        />

        {/* Bright specular dot */}
        <ellipse
          cx="39"
          cy="19"
          rx="1.5"
          ry="2.5"
          transform="rotate(-25, 39, 19)"
          fill="rgba(255,255,255,0.35)"
        />

        {/* Bottom caustic light */}
        <path
          d="M 30,90 C 38,100 44,105 50,107 C 56,105 62,100 70,90 C 62,96 56,99 50,100 C 44,99 38,96 30,90 Z"
          fill="url(#caustic)"
        />

        {/* Right inner edge reflection */}
        <path
          d="M 82,45 C 84,60 80,80 68,95"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="1"
          fill="none"
        />
      </svg>
    </div>
  );
}
