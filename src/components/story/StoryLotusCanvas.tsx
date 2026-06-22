import { Html } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  LotusGLBExporter,
  type LotusGLBExporterHandle,
} from "../../features/landing/three/LotusGLBExporter";
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
  const exporterRef = useRef<LotusGLBExporterHandle>(null);
  const exportInProgressRef = useRef(false);
  const animRef = useRef({ frameId: 0, startTime: 0, duration: 14000 });
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    let mounted = true;
    const current = animRef.current;

    const start = () => {
      current.startTime = performance.now();

      let localFrameId = 0;

      const loop = () => {
        if (!mounted) return;

        if (exportInProgressRef.current) {
          localFrameId = window.requestAnimationFrame(loop);
          current.frameId = localFrameId;
          return;
        }

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

  const handleExportGLB = async () => {
    if (!exporterRef.current || exportInProgressRef.current) return;

    exportInProgressRef.current = true;
    setIsExporting(true);

    try {
      await exporterRef.current.exportGLB({
        filename: "senova-lotus-full-bloom.glb",
        progress: 0.72,
      });
    } catch (error) {
      console.error("Export GLB failed:", error);
      window.alert("Không thể xuất file GLB. Vui lòng kiểm tra console.");
    } finally {
      exportInProgressRef.current = false;
      setIsExporting(false);
    }
  };

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
          <LotusGLBExporter ref={exporterRef} progressRef={progressRef} />
        </Suspense>
      </Canvas>

      <button
        type="button"
        className={styles.exportButton}
        onClick={handleExportGLB}
        disabled={isExporting}
      >
        {isExporting ? "Đang xuất..." : "Tải GLB"}
      </button>
    </div>
  );
}
