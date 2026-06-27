import { type Variants, type Transition } from "framer-motion";

export const easeOutExpo: Transition["ease"] = [0.16, 1, 0.3, 1];
export const easeInOut: Transition["ease"] = [0.76, 0, 0.24, 1];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.1, ease: easeOutExpo },
  }),
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: easeOutExpo },
  }),
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: easeOutExpo },
  }),
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: easeOutExpo },
  }),
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, delay: i * 0.1, ease: easeOutExpo },
  }),
};

export const scaleOut: Variants = {
  hidden: { opacity: 0, scale: 1.15 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, delay: i * 0.08, ease: easeOutExpo },
  }),
};

export const rotateIn: Variants = {
  hidden: { opacity: 0, rotate: -8, scale: 0.92 },
  visible: (i = 0) => ({
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: { duration: 0.7, delay: i * 0.1, ease: easeOutExpo },
  }),
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: (i = 0) => ({
    transition: { staggerChildren: 0.06, delayChildren: i * 0.08 },
  }),
};

export const cardHover = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -8,
    scale: 1.02,
    transition: { duration: 0.35, ease: easeOutExpo },
  },
};

export const revealClip: Variants = {
  hidden: { clipPath: "inset(0 100% 0 0)" },
  visible: (i = 0) => ({
    clipPath: "inset(0 0% 0 0)",
    transition: { duration: 0.9, delay: i * 0.12, ease: easeInOut },
  }),
};

export const letterReveal: Variants = {
  hidden: { opacity: 0, y: 40, rotateX: -40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.6, delay: i * 0.035, ease: easeOutExpo },
  }),
};

export const glowPulse = {
  initial: { opacity: 0.4 },
  animate: {
    opacity: [0.4, 1, 0.4],
    scale: [1, 1.05, 1],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
};

export const floatAnim = (yDistance = 20, duration = 4) => ({
  initial: { y: 0 },
  animate: {
    y: [0, -yDistance, 0],
    transition: { duration, repeat: Infinity, ease: "easeInOut" },
  },
});

export function useScrollReveal(threshold = 0.15, once = true) {
  return { once, margin: "-80px", amount: threshold as any };
}
