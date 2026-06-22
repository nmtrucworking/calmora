import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import styles from "./CustomCursor.module.css";


export function CustomCursor() {
  const [hovered, setHovered] = useState(false);
  const [hidden, setHidden] = useState(true);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Outer ring spring configuration for lag effect
  const springConfig = { damping: 40, stiffness: 280, mass: 0.6 };
  const cursorRingX = useSpring(cursorX, springConfig);
  const cursorRingY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Detect touch device
    const isTouchDevice = window.matchMedia("(hover: none)").matches;
    if (isTouchDevice) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (hidden) setHidden(false);
    };

    const handleMouseLeave = () => setHidden(true);
    const handleMouseEnter = () => setHidden(false);

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    // Event listeners to handle hover state
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[role='button']") ||
        target.closest("canvas"); // 3D Canvas interacts with cursor

      if (isInteractive) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY, hidden]);

  if (hidden) return null;

  return (
    <>
      {/* Outer cursor ring */}
      <motion.div
        className={styles.cursorRing}
        style={{
          x: cursorRingX,
          y: cursorRingY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: hovered ? 1.6 : 1,
          borderColor: hovered ? "var(--accent)" : "rgba(248, 223, 147, 0.4)",
          backgroundColor: hovered ? "rgba(185, 86, 114, 0.15)" : "rgba(185, 86, 114, 0)",
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.3 }}
      />
      {/* Inner cursor dot */}
      <motion.div
        className={styles.cursorDot}
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: hovered ? 0.6 : 1,
        }}
        transition={{ type: "tween", duration: 0.15 }}
      />
    </>
  );
}
