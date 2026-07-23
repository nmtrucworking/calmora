import { Html } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { LotusScene } from "@features/landing/three/LotusScene";
import type { ScrollProgressRef } from "@features/landing/types";
import { ScrollBinder } from "@features/landing/three/ScrollBinder";
import styles from "./StoryLotusCanvas.module.css";
import { useLanguage } from "@app/providers/LanguageContext";

type StoryLotusCanvasProps = {
  backgroundColor?: string | null;
  className?: string;
  fogColor?: string | null;
  scrollProgress?: MotionValue<number>;
  /**
   * Change this number to restart the lotus animation cycle. Bump a counter to trigger a replay.
   */
  restartSignal?: number;
  showBackdrop?: boolean;
};

export function StoryLotusCanvas({
  backgroundColor = null,
  className,
  fogColor = null,
  scrollProgress,
  restartSignal = 0,
  showBackdrop = false,
}: StoryLotusCanvasProps) {
  const { language } = useLanguage();
  const progressRef = useRef(0) as ScrollProgressRef;
  const animRef = useRef({ frameId: 0, startTime: 0, duration: 14000 });

  useEffect(() => {
    if (scrollProgress) return;

    let mounted = true;
    const current = animRef.current;

    const start = () => {
      current.startTime = performance.now();

      let localFrameId = 0;

      const loop = () => {
        if (!mounted) return;

        const elapsed = performance.now() - current.startTime;
        const rawProgress = Math.min(1, elapsed / current.duration);
        const easedProgress = THREE.MathUtils.smoothstep(rawProgress, 0, 1);

        progressRef.current = easedProgress;

        if (rawProgress < 1) {
          localFrameId = window.requestAnimationFrame(loop);
          current.frameId = localFrameId;
        }
      };

      // kick off loop
      localFrameId = window.requestAnimationFrame(loop);
      current.frameId = localFrameId;
    };

    // start on mount or when restartSignal changes
    start();

    return () => {
      mounted = false;
      const toCancel = current.frameId;
      if (toCancel) window.cancelAnimationFrame(toCancel);
    };
  }, [restartSignal, scrollProgress]);

  return (
    <div className={`${styles.canvasShell} ${className ?? ""}`.trim()}>
      <div className={styles.canvasViewport}>
      <Canvas
        shadows
        dpr={[1, 1.8]}
        camera={{ position: [0, 1.15, 5.7], fov: 48 }}
        gl={{ alpha: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        {scrollProgress ? (
          <ScrollBinder scrollYProgress={scrollProgress} targetRef={progressRef} />
        ) : null}
        <Suspense
          fallback={
            <Html center>
              <span className={styles.loadingText}>
                {language === "vi" ? "Đang dựng bông sen..." : "Rendering the lotus..."}
              </span>
            </Html>
          }
        >
          <LotusScene
            backgroundColor={backgroundColor}
            fogColor={fogColor}
            scrollProgressRef={progressRef}
            showBackdrop={showBackdrop}
          />
        </Suspense>
      </Canvas>
      </div>
    </div>
  );
}
