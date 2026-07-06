import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { luxuryEase } from "@shared/styles/luxuryEffects";

type BaseProps = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
};

export function FadeIn({ children, delay = 0, duration = 1.15, className }: BaseProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration, delay, ease: luxuryEase }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideUp({ children, delay = 0, duration = 1.2, className }: BaseProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: "blur(3px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration, delay, ease: luxuryEase }}
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
      viewport={{ once: true, margin: "-10%" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16, filter: "blur(3px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: {
            duration: 0.95,
            ease: luxuryEase,
          },
        },
      }}
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
      viewport={{ once: true, margin: "-10%" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren: 0.045,
          },
        },
      }}
      className={className}
      style={{ display: "inline-block" }}
    >
      {words.map((word, idx) => (
        <span key={idx} style={{ display: "inline-block", overflow: "hidden", marginRight: "0.25em" }}>
          <motion.span
            variants={{
              hidden: { y: "88%", opacity: 0.01 },
              visible: {
                y: 0,
                opacity: 1,
                transition: { duration: 0.92, ease: luxuryEase },
              },
            }}
            style={{ display: "inline-block" }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
