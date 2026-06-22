import { type ReactNode } from "react";
import { motion } from "framer-motion";

type BaseProps = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
};

// Zen ease token
const zenEase = [0.16, 1, 0.3, 1] as const;


export function FadeIn({ children, delay = 0, duration = 1.0, className }: BaseProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration, delay, ease: zenEase }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideUp({ children, delay = 0, duration = 1.1, className }: BaseProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration, delay, ease: zenEase }}
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
  staggerDelay = 0.18,
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
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 1.0,
            ease: zenEase,
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
            staggerChildren: 0.08,
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
              hidden: { y: "100%" },
              visible: {
                y: 0,
                transition: { duration: 0.8, ease: zenEase },
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
