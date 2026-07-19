import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import './Preloader.css';

type Phase = 'entering' | 'loading' | 'exiting' | 'hidden';

export default function Preloader({ onFinish }: { onFinish: () => void }) {
  const [phase, setPhase] = useState<Phase>('entering');
  const [progress, setProgress] = useState(0);
  const [showRipple, setShowRipple] = useState(false);
  const rafRef = useRef<number>(0);
  const finishRef = useRef(onFinish);
  finishRef.current = onFinish;

  useEffect(() => {
    if (sessionStorage.getItem('belvo-preloader-played')) {
      setPhase('hidden');
      finishRef.current();
      return;
    }

    const entryTimer = setTimeout(() => {
      setShowRipple(true);
      setPhase('loading');

      const totalDuration = 2600;
      const start = performance.now();

      const tick = (now: number) => {
        const elapsed = now - start;
        const t = Math.min(elapsed / totalDuration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setProgress(Math.round(eased * 100));

        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setPhase('exiting');
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    }, 1000);

    return () => {
      clearTimeout(entryTimer);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (phase !== 'exiting') return;
    const exitTimer = setTimeout(() => {
      setPhase('hidden');
      sessionStorage.setItem('belvo-preloader-played', 'true');
      finishRef.current();
    }, 1200);
    return () => clearTimeout(exitTimer);
  }, [phase]);

  if (phase === 'hidden') return null;

  return (
    <motion.div
      className="preloader-overlay"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 'exiting' ? 0 : 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="preloader-glow" />

      <div className="preloader-particles">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="preloader-particle"
            style={{
              left: `${10 + (i * 13) % 80}%`,
              top: `${12 + (i * 9) % 76}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${5 + (i % 3) * 2}s`,
              '--drift': `${i % 2 === 0 ? '' : '-'}${22 + (i * 7) % 30}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {showRipple && (
        <div className={`preloader-ripple ${phase === 'exiting' ? 'preloader-ripple--exit' : ''}`}>
          <div className="preloader-ripple-ring" />
          <div className="preloader-ripple-ring" />
          <div className="preloader-ripple-ring" />
        </div>
      )}

      <motion.div
        className="preloader-droplet-wrapper"
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: phase === 'exiting' ? 0.2 : 1,
          opacity: phase === 'exiting' ? 0 : 1,
        }}
        transition={{
          scale: { type: 'spring', damping: 14, stiffness: 130, mass: 0.8, delay: 0.1 },
          opacity: { duration: 0.5, delay: 0.1 },
        }}
      >
        <div className="preloader-droplet">
          <div className="preloader-droplet-shine" />
          <div className="preloader-droplet-highlight" />
          <div className="preloader-droplet-inner" />
        </div>
      </motion.div>

      <div className="preloader-bar-area">
        <div className="preloader-bar">
          <div className="preloader-bar-track">
            <div className="preloader-bar-fill" style={{ width: `${progress}%` }}>
              <div className="preloader-bar-shimmer" />
            </div>
          </div>
        </div>
        <div className="preloader-percentage">{progress}%</div>
      </div>
    </motion.div>
  );
}
