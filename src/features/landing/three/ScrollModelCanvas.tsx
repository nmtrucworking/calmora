import { Html } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useScroll } from "framer-motion";
import { Suspense, useRef } from "react";
import styles from "../SenovaLandingPage.module.css";
import { LotusScene } from "./LotusScene";
import { ScrollBinder } from "./ScrollBinder";

export function ScrollModelCanvas() {
  const { scrollYProgress } = useScroll();
  const progressRef = useRef(0);

  return (
    <div className={styles.sceneLayer}>
      <Canvas shadows dpr={[1, 1.8]} camera={{ position: [0, 1.15, 5.7], fov: 43 }}>
        <ScrollBinder scrollYProgress={scrollYProgress} targetRef={progressRef} />
        <Suspense
          fallback={
            <Html center>
              <span className={styles.loadingText}>Đang tải mô hình...</span>
            </Html>
          }
        >
          <LotusScene scrollProgressRef={progressRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}
