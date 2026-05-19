import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { ScrollProgressRef } from "../types";

type LotusBackdropProps = {
  scrollValue: ScrollProgressRef;
};

function buildBackdropLeafGeometry() {
  const radialSegments = 96;
  const rings = 18;
  const positions: number[] = [0, -0.05, 0];
  const colors: number[] = [];
  const indices: number[] = [];
  const deep = new THREE.Color("#12372d");
  const leaf = new THREE.Color("#4f9f65");
  const vein = new THREE.Color("#91c88f");

  colors.push(vein.r, vein.g, vein.b);

  for (let ring = 1; ring <= rings; ring += 1) {
    const t = ring / rings;

    for (let index = 0; index < radialSegments; index += 1) {
      const theta = (index / radialSegments) * Math.PI * 2;
      const edge = 1 + Math.sin(theta * 7) * 0.025 + Math.sin(theta * 13 + 1.4) * 0.012;
      const radius = t * edge;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius * 0.9;
      const y = -0.05 + Math.pow(t, 0.75) * 0.12 + Math.sin(theta * 8) * Math.pow(t, 1.7) * 0.018;
      const veinMix = Math.pow(Math.max(0, Math.cos(theta * 18)), 16) * 0.28;
      const color = deep.clone().lerp(leaf, 0.3 + (1 - t) * 0.28).lerp(vein, veinMix);

      positions.push(x, y, z);
      colors.push(color.r, color.g, color.b);
    }
  }

  for (let index = 0; index < radialSegments; index += 1) {
    const next = (index + 1) % radialSegments;

    indices.push(0, 1 + index, 1 + next);
  }

  for (let ring = 1; ring < rings; ring += 1) {
    const currentStart = 1 + (ring - 1) * radialSegments;
    const nextStart = 1 + ring * radialSegments;

    for (let index = 0; index < radialSegments; index += 1) {
      const next = (index + 1) % radialSegments;
      const a = currentStart + index;
      const b = currentStart + next;
      const c = nextStart + index;
      const d = nextStart + next;

      indices.push(a, c, b, b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(indices);
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();

  return geometry;
}

export function LotusBackdrop({ scrollValue }: LotusBackdropProps) {
  const groupRef = useRef<THREE.Group>(null);
  const leafGeometry = useMemo(() => buildBackdropLeafGeometry(), []);
  const leafMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ffffff",
        opacity: 0.24,
        roughness: 0.86,
        side: THREE.DoubleSide,
        transparent: true,
        vertexColors: true,
      }),
    [],
  );
  const stemMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#2a6d45",
        opacity: 0.34,
        roughness: 0.82,
        transparent: true,
      }),
    [],
  );
  const leaves = useMemo(
    () => [
      { position: [-2.25, -1.42, -1.15] as [number, number, number], rotation: [0.18, -0.55, -0.1] as [number, number, number], scale: [1.2, 1.2, 1.2] as [number, number, number] },
      { position: [2.15, -1.36, -1.05] as [number, number, number], rotation: [0.12, 0.5, 0.08] as [number, number, number], scale: [1.05, 1.05, 1.05] as [number, number, number] },
      { position: [0.35, -1.72, -1.9] as [number, number, number], rotation: [0.24, 0.08, 0.02] as [number, number, number], scale: [1.45, 1.45, 1.45] as [number, number, number] },
    ],
    [],
  );
  const stems = useMemo(
    () => [
      { position: [-1.2, -1.12, -1.35] as [number, number, number], rotationZ: -0.16, height: 1.55 },
      { position: [1.45, -1.1, -1.25] as [number, number, number], rotationZ: 0.18, height: 1.45 },
      { position: [0.15, -1.16, -2.05] as [number, number, number], rotationZ: 0.04, height: 1.25 },
    ],
    [],
  );

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    const progress = scrollValue.current;
    const elapsed = clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(elapsed * 0.18) * 0.018 + progress * 0.08;
    groupRef.current.position.y = progress > 0.76 ? 0.18 : 0;
  });

  return (
    <group ref={groupRef}>
      {leaves.map((leaf, index) => (
        <mesh
          key={`backdrop-leaf-${index}`}
          geometry={leafGeometry}
          material={leafMaterial}
          position={leaf.position}
          rotation={leaf.rotation}
          scale={leaf.scale}
        />
      ))}
      {stems.map((stem, index) => (
        <mesh key={`backdrop-stem-${index}`} material={stemMaterial} position={stem.position} rotation={[0, 0, stem.rotationZ]}>
          <cylinderGeometry args={[0.025, 0.04, stem.height, 12]} />
        </mesh>
      ))}
    </group>
  );
}
