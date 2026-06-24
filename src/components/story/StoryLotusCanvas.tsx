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
  backgroundColor?: string | null;
  className?: string;
  fogColor?: string | null;
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
  restartSignal = 0,
  showBackdrop = false,
}: StoryLotusCanvasProps) {
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
        <Suspense
          fallback={
            <Html center>
              <span className={styles.loadingText}>Đang dựng bông sen...</span>
            </Html>
          }
        >
          <LotusScene
            backgroundColor={backgroundColor}
            fogColor={fogColor}
            scrollProgressRef={progressRef}
            showBackdrop={showBackdrop}
          />
          <LotusGLBExporter ref={exporterRef} progressRef={progressRef} />
        </Suspense>
      </Canvas>
      </div>

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
