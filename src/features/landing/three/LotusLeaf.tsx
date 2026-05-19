import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { ScrollProgressRef } from "../types";

type LotusLeafProps = {
  scrollValue: ScrollProgressRef;
};

export function LotusLeaf({ scrollValue }: LotusLeafProps) {
  const group = useRef<THREE.Group>(null);
  const veins = useMemo(() => Array.from({ length: 16 }, (_, index) => index), []);

  useFrame(({ clock }) => {
    if (!group.current) return;

    const elapsed = clock.getElapsedTime();
    const burst = scrollValue.current;

    group.current.rotation.y = elapsed * 0.08 + burst * 1.1;
    group.current.position.y = -0.42 - burst * 0.55;
    group.current.scale.setScalar(1 + burst * 0.24);
  });

  return (
    <group ref={group} rotation={[-Math.PI / 2.2, 0, 0]} position={[0, -0.48, 0]}>
      <mesh receiveShadow>
        <circleGeometry args={[1.85, 128]} />
        <meshPhysicalMaterial
          clearcoat={0.35}
          color="#2c7d5a"
          roughness={0.55}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0.18, 0.01, 0]}>
        <circleGeometry args={[0.34, 64, 0.25, Math.PI * 1.72]} />
        <meshBasicMaterial color="#0b1b18" transparent opacity={0.32} side={THREE.DoubleSide} />
      </mesh>
      {veins.map((vein) => {
        const angle = (vein / veins.length) * Math.PI * 2;

        return (
          <mesh key={vein} rotation={[0, 0, angle]} position={[0, 0.017, 0]}>
            <boxGeometry args={[1.58, 0.011, 0.011]} />
            <meshBasicMaterial color="#93e5bc" transparent opacity={0.33} />
          </mesh>
        );
      })}
    </group>
  );
}
