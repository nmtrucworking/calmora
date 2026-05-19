import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { ScrollProgressRef } from "../types";

type PetalProps = {
  index: number;
  total: number;
  scrollValue: ScrollProgressRef;
};

export function Petal({ index, total, scrollValue }: PetalProps) {
  const mesh = useRef<THREE.Mesh>(null);
  const angle = (index / total) * Math.PI * 2;
  const baseRadius = 0.68 + (index % 3) * 0.08;
  const layer = Math.floor((index / total) * 3);
  const color = useMemo(
    () => new THREE.Color().setHSL(0.9, 0.58, 0.58 + layer * 0.05),
    [layer],
  );

  useFrame(({ clock }) => {
    if (!mesh.current) return;

    const elapsed = clock.getElapsedTime();
    const burst = scrollValue.current;
    const outward = baseRadius + burst * (2.4 + layer * 0.7);

    mesh.current.position.x = Math.cos(angle) * outward;
    mesh.current.position.z = Math.sin(angle) * outward;
    mesh.current.position.y =
      Math.sin(elapsed * 0.8 + index) * 0.05 + layer * 0.11 + burst * (Math.sin(angle * 3) * 0.9);
    mesh.current.rotation.y = -angle + Math.PI / 2 + burst * Math.sin(index) * 1.1;
    mesh.current.rotation.x = 0.82 + burst * 0.85;
    mesh.current.rotation.z = Math.sin(elapsed * 0.55 + index) * 0.08 + burst * Math.cos(angle) * 0.5;
    mesh.current.scale.setScalar(1 - burst * 0.18);
  });

  return (
    <mesh ref={mesh} castShadow receiveShadow>
      <sphereGeometry args={[0.33, 28, 16]} />
      <meshPhysicalMaterial
        clearcoat={0.45}
        color={color}
        metalness={0.03}
        opacity={0.88}
        roughness={0.32}
        thickness={0.8}
        transmission={0.15}
        transparent
      />
      <mesh scale={[0.72, 0.08, 1.55]} position={[0, 0.09, 0]}>
        <sphereGeometry args={[0.42, 28, 16]} />
        <meshBasicMaterial color="#fff1f6" transparent opacity={0.08} />
      </mesh>
    </mesh>
  );
}
