import { Html } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { LotusScene } from "../../features/landing/three/LotusScene";
import type { ScrollProgressRef } from "../../features/landing/types";
import styles from "./StoryLotusCanvas.module.css";

type StoryLotusCanvasProps = {
  className?: string;
};

export function StoryLotusCanvas({ className }: StoryLotusCanvasProps) {
  const progressRef = useRef(0) as ScrollProgressRef;

  useEffect(() => {
    let frameId = 0;
    const startTime = performance.now();
    const duration = 14000;

    const animate = () => {
      const elapsed = performance.now() - startTime;
      const rawProgress = Math.min(1, elapsed / duration);
      const easedProgress = THREE.MathUtils.smoothstep(rawProgress, 0, 1);

      progressRef.current = easedProgress;

      if (rawProgress < 1) {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    frameId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

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
