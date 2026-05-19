import { Html } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { LotusScene } from "../../features/landing/three/LotusScene";
import type { ScrollProgressRef } from "../../features/landing/types";
import styles from "./StoryLotusCanvas.module.css";

type StoryLotusCanvasProps = {
  className?: string;
  /**
   * Change this number to restart the lotus animation cycle. Bump a counter to trigger a replay.
   */
  restartSignal?: number;
};

export function StoryLotusCanvas({ className, restartSignal = 0 }: StoryLotusCanvasProps) {
  const progressRef = useRef(0) as ScrollProgressRef;
  const animRef = useRef({ frameId: 0, startTime: 0, duration: 14000 });

  useEffect(() => {
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
  }, [restartSignal]);

  return (
    <div className={`${styles.canvasShell} ${className ?? ""}`.trim()}>
      <Canvas shadows dpr={[1, 1.8]} camera={{ position: [0, 1.15, 5.7], fov: 43 }}>
        <Suspense
          fallback={
            <Html center>
              <span className={styles.loadingText}>Đang dựng bông sen...</span>
            </Html>
          }
        >
          <LotusScene scrollProgressRef={progressRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}
