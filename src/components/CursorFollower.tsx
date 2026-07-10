import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CursorFollower() {
  const [visible, setVisible] = useState(false);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const springX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 20 });
  const isScrolling = useRef(false);
  const scrollTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (isScrolling.current) return;
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!visible) setVisible(true);
    };
    const leave = () => setVisible(false);
    const enter = () => setVisible(true);
    const onScroll = () => {
      isScrolling.current = true;
      setVisible(false);
      clearTimeout(scrollTimer.current);
      scrollTimer.current = setTimeout(() => {
        isScrolling.current = false;
        setVisible(true);
      }, 150);
    };

    window.addEventListener("mousemove", handle, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);
    return () => {
      window.removeEventListener("mousemove", handle);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
      clearTimeout(scrollTimer.current);
    };
  }, [mouseX, mouseY, visible]);

  return (
    <motion.div
      aria-hidden
      style={{
        position: "fixed",
        left: springX,
        top: springY,
        width: 200,
        height: 200,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(157,78,221,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 9998,
        transform: "translate(-50%, -50%)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s",
      }}
    />
  );
}
