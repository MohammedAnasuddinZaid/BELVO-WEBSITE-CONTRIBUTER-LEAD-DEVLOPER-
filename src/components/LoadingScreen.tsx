import { useEffect, useRef } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const portalRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(onComplete);
  doneRef.current = onComplete;

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      const el = portalRef.current;
      if (el) el.classList.add("done");
      doneRef.current();
    } else {
      setTimeout(() => {
        const el = portalRef.current;
        if (el) el.classList.add("exit");
        setTimeout(() => {
          const el2 = portalRef.current;
          if (el2) el2.classList.add("done");
          doneRef.current();
        }, 750);
      }, 1750);
    }
  }, []);

  return (
    <div id="portal" ref={portalRef} aria-hidden="true">
      <div className="portal-glow" />
      <div className="plane p1" />
      <div className="plane p2" />
      <div className="portal-word">BELVO</div>
    </div>
  );
}
