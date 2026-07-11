import { type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  fadeVariants,
  motionViewport,
  revealVariants,
  staggerVariants,
  transition,
  wordRevealVariants,
} from "@shared/motion/animationSystem";

type BaseProps = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
};

export function FadeIn({ children, delay = 0, duration = 1.15, className }: BaseProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={motionViewport}
      variants={{
        ...fadeVariants,
        visible: {
          ...fadeVariants.visible,
          transition: { ...transition.reveal, duration, delay },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideUp({ children, delay = 0, duration = 1.2, className }: BaseProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={motionViewport}
      variants={{
        ...revealVariants,
        visible: {
          ...revealVariants.visible,
          transition: { ...transition.reveal, duration, delay },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

type StaggerContainerProps = {
  children: ReactNode;
  delay?: number;
  staggerDelay?: number;
  className?: string;
};

export function StaggerContainer({
  children,
  delay = 0,
  staggerDelay = 0.12,
  className,
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={motionViewport}
      variants={staggerVariants(delay, staggerDelay)}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={revealVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

type TextRevealProps = {
  text: string;
  delay?: number;
  className?: string;
};

export function TextReveal({ text, delay = 0, className }: TextRevealProps) {
  const words = text.split(" ");

  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={motionViewport}
      variants={staggerVariants(delay, 0.045)}
      className={className}
      style={{ display: "inline-block" }}
    >
      {words.map((word, idx) => (
        <span key={idx} style={{ display: "inline-block", overflow: "hidden", marginRight: "0.25em" }}>
          <motion.span
            variants={wordRevealVariants}
            style={{ display: "inline-block" }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
