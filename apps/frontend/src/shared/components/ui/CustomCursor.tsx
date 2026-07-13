import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import styles from "./CustomCursor.module.css";

interface Sparkle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
}

const desktopCursorMediaQuery = "(hover: hover) and (pointer: fine) and (min-width: 1025px)";

export function CustomCursor() {
  const [hovered, setHovered] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(desktopCursorMediaQuery).matches : false,
  );

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Outer ring spring configuration for lag effect
  const springConfig = { damping: 40, stiffness: 280, mass: 0.6 };
  const cursorRingX = useSpring(cursorX, springConfig);
  const cursorRingY = useSpring(cursorY, springConfig);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Sparkle[]>([]);
  const isLoopingRef = useRef(false);
  const moveTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia(desktopCursorMediaQuery);
    const updateCursorMode = () => setIsDesktop(mediaQuery.matches);

    updateCursorMode();
    mediaQuery.addEventListener("change", updateCursorMode);

    return () => mediaQuery.removeEventListener("change", updateCursorMode);
  }, []);

  useEffect(() => {
    const activeClass = "senova-custom-cursor-active";

    if (!isDesktop) {
      document.body.classList.remove(activeClass);
      return;
    }

    document.body.classList.add(activeClass);
    return () => document.body.classList.remove(activeClass);
  }, [isDesktop]);

  // Register event listeners and canvas setup only when isDesktop is true
  useEffect(() => {
    if (!isDesktop) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // Particle rendering loop
    const renderParticles = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Clear rect
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.035; // slight gravity
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Draw a simple, beautiful gold circle particle
        ctx.fillStyle = `rgba(248, 223, 147, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      if (particles.length > 0) {
        requestAnimationFrame(renderParticles);
      } else {
        isLoopingRef.current = false;
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    };

    const spawnSparkle = (x: number, y: number) => {
      const particles = particlesRef.current;
      if (particles.length > 95) return; // slightly increased cap for richer trail

      // Create a nice variation of big and small particles (1.2px to 4.8px)
      const size = 1.2 + Math.random() * 3.6;
      
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.15 + Math.random() * 1.0;
      
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.15,
        size,
        alpha: 0.85 + Math.random() * 0.15,
        decay: 0.012 + Math.random() * 0.016, // Fades smoothly
      });

      if (!isLoopingRef.current) {
        isLoopingRef.current = true;
        requestAnimationFrame(renderParticles);
      }
    };

    let lastX = 0;
    let lastY = 0;

    const moveCursor = (e: MouseEvent) => {
      const clientX = e.clientX;
      const clientY = e.clientY;

      cursorX.set(clientX);
      cursorY.set(clientY);

      // Set moving state
      setIsMoving(true);
      if (moveTimeoutRef.current) {
        window.clearTimeout(moveTimeoutRef.current);
      }
      moveTimeoutRef.current = window.setTimeout(() => {
        setIsMoving(false);
      }, 150);

      // Sparkle spawn logic based on distance
      const dx = clientX - lastX;
      const dy = clientY - lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 8) {
        spawnSparkle(clientX, clientY);
        if (dist > 25) {
          spawnSparkle(lastX + dx * 0.5, lastY + dy * 0.5);
        }
        lastX = clientX;
        lastY = clientY;
      }
    };

    window.addEventListener("mousemove", moveCursor);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[role='button']") ||
        target.closest("canvas");

      if (isInteractive) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", handleMouseOver);
      if (moveTimeoutRef.current) {
        window.clearTimeout(moveTimeoutRef.current);
      }
    };
  }, [cursorX, cursorY, isDesktop]);

  if (!isDesktop) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 9998,
        }}
      />
      <motion.div
        className={styles.cursorRing}
        style={{
          x: cursorRingX,
          y: cursorRingY,
        }}
        animate={{
          scale: hovered ? 1.6 : (isMoving ? 0 : 1),
          opacity: isMoving ? 0 : 1,
          borderColor: hovered ? "var(--accent)" : "rgba(248, 223, 147, 0.4)",
          backgroundColor: hovered ? "rgba(185, 86, 114, 0.15)" : "rgba(185, 86, 114, 0)",
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.3 }}
      />
      <motion.div
        className={styles.cursorDot}
        style={{
          x: cursorX,
          y: cursorY,
        }}
        animate={{
          scale: hovered ? 0.6 : 1,
        }}
        transition={{ type: "tween", duration: 0.15 }}
      />
    </>
  );
}
