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

function buildTeaLeafGeometry() {
  const widthSegments = 12;
  const lengthSegments = 34;
  const positions: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  const deep = new THREE.Color("#214f35");
  const leaf = new THREE.Color("#6ab46a");
  const vein = new THREE.Color("#c2e4aa");

  for (let yIndex = 0; yIndex <= lengthSegments; yIndex += 1) {
    const u = yIndex / lengthSegments;
    const widthProfile = Math.pow(Math.sin(Math.PI * u), 0.62) * (1 - u * 0.08);
    const serration = 1 + Math.sin(u * Math.PI * 30) * 0.045 * Math.sin(Math.PI * u);

    for (let xIndex = 0; xIndex <= widthSegments; xIndex += 1) {
      const s = (xIndex / widthSegments) * 2 - 1;
      const edge = Math.abs(s);
      const x = s * widthProfile * 0.22 * serration;
      const y = (u - 0.5) * 1.18;
      const z = Math.sin(Math.PI * u) * (0.035 - edge * 0.026) + (1 - edge) * 0.016;
      const veinMix = Math.max(0, 1 - edge * 10) * 0.55;
      const color = deep
        .clone()
        .lerp(leaf, 0.48 + Math.sin(Math.PI * u) * 0.26)
        .lerp(vein, veinMix + Math.pow(edge, 2.2) * 0.08);

      positions.push(x, y, z);
      colors.push(color.r, color.g, color.b);
    }
  }

  for (let yIndex = 0; yIndex < lengthSegments; yIndex += 1) {
    for (let xIndex = 0; xIndex < widthSegments; xIndex += 1) {
      const a = yIndex * (widthSegments + 1) + xIndex;
      const b = a + 1;
      const c = a + widthSegments + 1;
      const d = c + 1;

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
  const teaLeafGeometry = useMemo(() => buildTeaLeafGeometry(), []);
  const leafMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ffffff",
        opacity: 0.32,
        roughness: 0.86,
        side: THREE.DoubleSide,
        transparent: true,
        vertexColors: true,
      }),
    [],
  );
  const teaLeafMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#ffffff",
        metalness: 0,
        opacity: 0.62,
        roughness: 0.66,
        sheen: 0.48,
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
        opacity: 0.42,
        roughness: 0.82,
        transparent: true,
      }),
    [],
  );
  const budMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#b95672",
        emissive: "#2c1119",
        emissiveIntensity: 0.03,
        opacity: 0.38,
        roughness: 0.72,
        sheen: 0.18,
        transparent: true,
      }),
    [],
  );
  const sepalMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#3f7a59",
        opacity: 0.48,
        roughness: 0.86,
        transparent: true,
      }),
    [],
  );
  const leaves = useMemo(
    () => [
      { position: [-2.25, -1.42, -1.15] as [number, number, number], rotation: [0.18, -0.55, -0.1] as [number, number, number], scale: [1.28, 1.28, 1.28] as [number, number, number] },
      { position: [2.15, -1.36, -1.05] as [number, number, number], rotation: [0.12, 0.5, 0.08] as [number, number, number], scale: [1.14, 1.14, 1.14] as [number, number, number] },
      { position: [0.35, -1.72, -1.9] as [number, number, number], rotation: [0.24, 0.08, 0.02] as [number, number, number], scale: [1.55, 1.55, 1.55] as [number, number, number] },
      { position: [-3.05, -1.18, -2.4] as [number, number, number], rotation: [0.34, -0.88, -0.04] as [number, number, number], scale: [1.0, 1.0, 1.0] as [number, number, number] },
      { position: [3.1, -1.24, -2.35] as [number, number, number], rotation: [0.26, 0.8, 0.08] as [number, number, number], scale: [0.96, 0.96, 0.96] as [number, number, number] },
    ],
    [],
  );
  const stems = useMemo(
    () => [
      { position: [-1.2, -1.12, -1.35] as [number, number, number], rotationZ: -0.16, height: 1.55 },
      { position: [1.45, -1.1, -1.25] as [number, number, number], rotationZ: 0.18, height: 1.45 },
      { position: [0.15, -1.16, -2.05] as [number, number, number], rotationZ: 0.04, height: 1.25 },
      { position: [-2.72, -0.96, -1.55] as [number, number, number], rotationZ: -0.26, height: 1.8 },
      { position: [2.68, -0.98, -1.48] as [number, number, number], rotationZ: 0.22, height: 1.66 },
    ],
    [],
  );
  const sideBuds = useMemo(
    () => [
      { position: [-2.9, -0.34, -1.5] as [number, number, number], rotation: [0.08, -0.18, -0.25] as [number, number, number], scale: [0.32, 0.68, 0.32] as [number, number, number] },
      { position: [2.78, -0.42, -1.44] as [number, number, number], rotation: [0.05, 0.22, 0.22] as [number, number, number], scale: [0.28, 0.56, 0.28] as [number, number, number] },
    ],
    [],
  );
  const teaLeaves = useMemo(
    () => [
      {
        position: [-1.45, -0.82, 0.18] as [number, number, number],
        rotation: [0.42, 0.16, 0.78] as [number, number, number],
        scale: [0.58, 0.58, 0.58] as [number, number, number],
      },
      {
        position: [-1.18, -0.88, 0.26] as [number, number, number],
        rotation: [0.34, 0.22, 1.18] as [number, number, number],
        scale: [0.48, 0.48, 0.48] as [number, number, number],
      },
      {
        position: [1.42, -0.84, 0.16] as [number, number, number],
        rotation: [0.38, -0.18, -0.86] as [number, number, number],
        scale: [0.56, 0.56, 0.56] as [number, number, number],
      },
      {
        position: [1.12, -0.92, 0.22] as [number, number, number],
        rotation: [0.32, -0.24, -1.22] as [number, number, number],
        scale: [0.46, 0.46, 0.46] as [number, number, number],
      },
      {
        position: [0.32, -0.98, 0.32] as [number, number, number],
        rotation: [0.46, 0.04, 0.12] as [number, number, number],
        scale: [0.42, 0.42, 0.42] as [number, number, number],
      },
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
      {teaLeaves.map((leaf, index) => (
        <mesh
          key={`tea-leaf-${index}`}
          geometry={teaLeafGeometry}
          material={teaLeafMaterial}
          position={leaf.position}
          rotation={leaf.rotation}
          scale={leaf.scale}
        />
      ))}
      {sideBuds.map((bud, index) => (
        <group key={`side-bud-${index}`} position={bud.position} rotation={bud.rotation}>
          <mesh material={budMaterial} scale={bud.scale}>
            <sphereGeometry args={[1, 28, 18]} />
          </mesh>
          {Array.from({ length: 4 }, (_, sepalIndex) => {
            const angle = (sepalIndex / 4) * Math.PI * 2;

            return (
              <mesh
                key={`side-sepal-${sepalIndex}`}
                material={sepalMaterial}
                position={[Math.sin(angle) * 0.08, -0.34, Math.cos(angle) * 0.08]}
                rotation={[0.36, angle, 0]}
                scale={[0.045, 0.24, 0.12]}
              >
                <sphereGeometry args={[1, 12, 8]} />
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
}
