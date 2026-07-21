import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { ScrollProgressRef } from "../types";

type TeaCoreProps = {
  scrollValue: ScrollProgressRef;
};

function clamp01(value: number) {
  return THREE.MathUtils.clamp(value, 0, 1);
}

function smoothRange(start: number, end: number, value: number) {
  const t = clamp01((value - start) / (end - start));

  return t * t * (3 - 2 * t);
}

function buildSeedPositions() {
  const seedCount = 19;

  return Array.from({ length: seedCount }, (_, index) => {
    const radius = Math.sqrt(index / seedCount) * 0.285;
    const angle = index * 2.399963229728653;

    return {
      position: new THREE.Vector3(Math.cos(angle) * radius, 0.145, Math.sin(angle) * radius),
      scale: 0.78 + (1 - radius / 0.285) * 0.34,
    };
  });
}

export function TeaCore({ scrollValue }: TeaCoreProps) {
  const groupRef = useRef<THREE.Group>(null);
  const podRef = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhysicalMaterial>>(null);
  const seedRefs = useRef<Array<THREE.Mesh | null>>([]);
  const auraRef = useRef<THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const podMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#c9bd55",
        emissive: "#716814",
        emissiveIntensity: 0.025,
        metalness: 0,
        opacity: 0,
        roughness: 0.74,
        sheen: 0.2,
        transparent: true,
      }),
    [],
  );
  const seedMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#625f2d",
        emissive: "#26240c",
        emissiveIntensity: 0.015,
        opacity: 0,
        roughness: 0.7,
        transparent: true,
      }),
    [],
  );

  const seeds = useMemo(() => buildSeedPositions(), []);
  const auraGeometry = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];
    const gold = new THREE.Color("#fff0b8");
    const amber = new THREE.Color("#d99024");

    for (let index = 0; index < 180; index += 1) {
      const radius = Math.sqrt(index / 180) * 0.48;
      const angle = index * 2.399963229728653;
      const height = Math.sin(index * 0.91) * 0.06;
      const color = gold.clone().lerp(amber, radius / 0.48);

      positions.push(Math.cos(angle) * radius, height, Math.sin(angle) * radius);
      colors.push(color.r, color.g, color.b);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    return geometry;
  }, []);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    const progress = scrollValue.current;
    const bloom = smoothRange(0.36, 0.62, progress);
    const wither = smoothRange(0.78, 1, progress);
    const presence = bloom * (1 - wither * 0.68);

    if (groupRef.current) {
      groupRef.current.rotation.y = elapsed * 0.16 + progress * 0.38;
      groupRef.current.position.set(0, 0.1 - wither * 0.05, 0.18);
      groupRef.current.scale.setScalar(0.5 + presence * 0.8);
      groupRef.current.visible = presence > 0.02;
    }

    if (podRef.current) {
      podRef.current.material.opacity = presence * 0.96;
      podRef.current.material.emissiveIntensity = 0.018 + presence * 0.045;
    }

    seedRefs.current.forEach((seed) => {
      if (!seed) return;

      const material = seed.material as THREE.MeshStandardMaterial;
      material.opacity = presence * 0.98;
      material.emissiveIntensity = 0.012 + presence * 0.035;
    });

    if (auraRef.current) {
      auraRef.current.material.opacity = presence * 0.5;
      auraRef.current.rotation.y = -elapsed * 0.12;
    }

    if (lightRef.current) {
      lightRef.current.intensity = presence * 4.5;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={podRef} material={podMaterial} receiveShadow position={[0, 0.035, 0]}>
        <cylinderGeometry args={[0.35, 0.26, 0.2, 48, 4]} />
      </mesh>
      <mesh material={podMaterial} position={[0, 0.14, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.33, 0.024, 10, 48]} />
      </mesh>
      {seeds.map((seed, index) => (
        <mesh
          key={index}
          ref={(node) => {
            seedRefs.current[index] = node;
          }}
          material={seedMaterial}
          position={seed.position}
          scale={[seed.scale, seed.scale * 0.42, seed.scale]}
        >
          <sphereGeometry args={[0.052, 14, 8]} />
        </mesh>
      ))}
      <points ref={auraRef} geometry={auraGeometry}>
        <pointsMaterial
          vertexColors
          transparent
          opacity={0}
          size={0.052}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      <pointLight ref={lightRef} color="#f8d36f" distance={4.2} intensity={0} />
    </group>
  );
}
