import { useThree } from "@react-three/fiber";
import { forwardRef, useImperativeHandle } from "react";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import type { ScrollProgressRef } from "../types";

export type ExportGLBOptions = {
  filename?: string;
  progress?: number;
};

export type LotusGLBExporterHandle = {
  exportGLB: (options?: ExportGLBOptions) => Promise<void>;
};

type LotusGLBExporterProps = {
  progressRef: ScrollProgressRef;
};

function waitNextFrame() {
  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => resolve());
  });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export const LotusGLBExporter = forwardRef<LotusGLBExporterHandle, LotusGLBExporterProps>(
  function LotusGLBExporter({ progressRef }, ref) {
    const { scene } = useThree();

    useImperativeHandle(
      ref,
      () => ({
        async exportGLB(options = {}) {
          const filename = options.filename ?? "senova-lotus.glb";
          const previousProgress = progressRef.current;
          const shouldSetProgress = typeof options.progress === "number";

          try {
            if (shouldSetProgress) {
              progressRef.current = THREE.MathUtils.clamp(options.progress ?? 0, 0, 1);
              await waitNextFrame();
              await waitNextFrame();
            }

            scene.updateMatrixWorld(true);

            const exporter = new GLTFExporter();
            const output = await exporter.parseAsync(scene, {
              binary: true,
              onlyVisible: true,
              truncateDrawRange: true,
            });

            if (output instanceof ArrayBuffer) {
              const blob = new Blob([output], { type: "model/gltf-binary" });
              const outputName = filename.endsWith(".glb") ? filename : `${filename}.glb`;

              downloadBlob(blob, outputName);
              return;
            }

            const blob = new Blob([JSON.stringify(output, null, 2)], { type: "model/gltf+json" });
            const fallbackName = filename.endsWith(".glb")
              ? filename.replace(/\.glb$/i, ".gltf")
              : `${filename}.gltf`;

            downloadBlob(blob, fallbackName);
          } finally {
            if (shouldSetProgress) {
              progressRef.current = previousProgress;
              await waitNextFrame();
            }
          }
        },
      }),
      [progressRef, scene],
    );

    return null;
  },
);
