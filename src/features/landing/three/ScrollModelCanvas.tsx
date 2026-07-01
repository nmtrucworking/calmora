import { Html } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useScroll } from "framer-motion";
import { Suspense, useRef } from "react";
import { cx } from "../../../utils/classNames";
import { LotusScene } from "./LotusScene";
import { ScrollBinder } from "./ScrollBinder";

type ScrollModelCanvasProps = {
  backgroundColor?: string | null;
  className?: string;
  fogColor?: string | null;
  showBackdrop?: boolean;
};

export function ScrollModelCanvas({
  backgroundColor = null,
  className,
  fogColor = null,
  showBackdrop = false,
}: ScrollModelCanvasProps) {
  const { scrollYProgress } = useScroll();
  const progressRef = useRef(0);

  return (
    <div className={cx("fixed inset-0 z-0", className)}>
      <Canvas
        shadows
        dpr={[1, 1.8]}
        camera={{ position: [0, 1.15, 5.7], fov: 43 }}
        gl={{ alpha: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <ScrollBinder scrollYProgress={scrollYProgress} targetRef={progressRef} />
        <Suspense
          fallback={
            <Html center>
              <span className="text-sm text-text-muted">Đang tải mô hình...</span>
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
  );
}
