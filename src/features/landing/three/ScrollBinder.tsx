import { useFrame } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import * as THREE from "three";
import type { ScrollProgressRef } from "../types";

type ScrollBinderProps = {
  scrollYProgress: MotionValue<number>;
  targetRef: ScrollProgressRef;
};

export function ScrollBinder({ scrollYProgress, targetRef }: ScrollBinderProps) {
  useFrame(() => {
    targetRef.current = THREE.MathUtils.lerp(targetRef.current, scrollYProgress.get(), 0.11);
  });

  return null;
}
