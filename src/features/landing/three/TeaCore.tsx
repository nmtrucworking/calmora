import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { ScrollProgressRef } from "../types";

type TeaCoreProps = {
  scrollValue: ScrollProgressRef;
};

export function TeaCore({ scrollValue }: TeaCoreProps) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!mesh.current) return;

    const elapsed = clock.getElapsedTime();
    const burst = scrollValue.current;

    mesh.current.rotation.y = elapsed * 0.35;
    mesh.current.position.y = 0.22 + Math.sin(elapsed * 1.2) * 0.04 + burst * 0.2;
    mesh.current.scale.setScalar(0.75 + Math.sin(elapsed * 2) * 0.025 + burst * 0.18);
  });

  return (
    <mesh ref={mesh} castShadow>
      <icosahedronGeometry args={[0.48, 3]} />
      <meshPhysicalMaterial
        clearcoat={0.5}
        color="#f6d37a"
        emissive="#8f5b1a"
        emissiveIntensity={0.38}
        metalness={0.05}
        roughness={0.22}
      />
    </mesh>
  );
}
