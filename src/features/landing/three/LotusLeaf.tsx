import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { ScrollProgressRef } from "../types";

type LotusLeafProps = {
  scrollValue: ScrollProgressRef;
};

export function LotusLeaf({ scrollValue }: LotusLeafProps) {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>>(null);
  const geometry = useMemo(() => buildLeafGeometry(), []);
  const material = useMemo(() => buildLeafMaterial(), []);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    const burst = scrollValue.current;
    const bloom = smoothRange(0.18, 0.58, burst);
    const wither = smoothRange(0.78, 1, burst);

    if (groupRef.current) {
      groupRef.current.rotation.y = elapsed * 0.035 + burst * 0.55;
      groupRef.current.position.y = -1.08 - wither * 0.12;
      groupRef.current.scale.setScalar(0.86 + bloom * 0.1);
    }

    if (pointsRef.current) {
      pointsRef.current.material.uniforms.uTime.value = elapsed;
      pointsRef.current.material.uniforms.uBurst.value = burst;
      pointsRef.current.material.uniforms.uWither.value = wither;
      pointsRef.current.material.uniforms.uPresence.value = 0.7 - wither * 0.16;
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef} geometry={geometry} material={material} />
    </group>
  );
}

const leafVertexShader = `
  uniform float uTime;
  uniform float uBurst;
  uniform float uPresence;
  uniform float uWither;

  attribute vec3 aColor;
  attribute float aSize;
  attribute float aVein;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec3 dryColor = vec3(0.47, 0.42, 0.31);
    vColor = mix(aColor, dryColor, uWither * 0.42);

    vec3 pos = position;
    float radial = length(pos.xz);
    float wave = sin(uTime * 1.1 + radial * 4.0) * 0.012;

    pos.y += wave + uBurst * (aVein * 0.02 - 0.018) - uWither * 0.035;
    pos.xz *= 1.0 + uBurst * 0.025;

    vAlpha = mix(0.28, 0.58, aVein) * uPresence;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (360.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const leafFragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float dist = length(uv);

    if (dist > 0.5) discard;

    float alpha = smoothstep(0.5, 0.05, dist) * vAlpha;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

function buildLeafGeometry() {
  const positions: number[] = [];
  const colors: number[] = [];
  const sizes: number[] = [];
  const veins: number[] = [];
  const leaf = new THREE.Color("#4d9f73");
  const deepLeaf = new THREE.Color("#103d32");
  const vein = new THREE.Color("#b7dcc5");
  const gold = new THREE.Color("#9a8a5a");
  const radius = 1.9;

  for (let index = 0; index < 4200; index += 1) {
    const theta = Math.random() * Math.PI * 2;
    const edgeWave = 1 + Math.sin(theta * 8) * 0.02 + Math.sin(theta * 13 + 0.8) * 0.012;
    const maxRadius = radius * edgeWave;
    const r = Math.sqrt(Math.random()) * maxRadius;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r * 0.9;
    const t = r / radius;
    const y =
      -0.075 +
      Math.pow(t, 0.85) * 0.08 +
      Math.sin(theta * 9) * Math.pow(t, 1.8) * 0.012 +
      (Math.random() - 0.5) * 0.012;
    const color = deepLeaf.clone().lerp(leaf, 0.32 + (1 - t) * 0.38).lerp(gold, smoothRange(0, 0.16, 1 - t) * 0.08);

    positions.push(x, y, z);
    colors.push(color.r, color.g, color.b);
    sizes.push(0.028 + Math.random() * 0.018);
    veins.push(0);
  }

  for (let index = 0; index < 720; index += 1) {
    const theta = (index / 720) * Math.PI * 2;
    const edgeWave = 1 + Math.sin(theta * 8) * 0.02 + Math.sin(theta * 13 + 0.8) * 0.012;
    const r = radius * edgeWave;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r * 0.9;

    positions.push(x, -0.01, z);
    colors.push(vein.r, vein.g, vein.b);
    sizes.push(0.052);
    veins.push(1);
  }

  for (let line = 0; line < 18; line += 1) {
    const theta = (line / 18) * Math.PI * 2;

    for (let step = 0; step < 95; step += 1) {
      const t = step / 94;
      const edgeWave = 1 + Math.sin(theta * 8) * 0.02 + Math.sin(theta * 13 + 0.8) * 0.012;
      const r = radius * edgeWave * t;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r * 0.9;

      positions.push(x, 0.025, z);
      colors.push(vein.r, vein.g, vein.b);
      sizes.push(0.035 + (1 - t) * 0.018);
      veins.push(1);
    }

    const forkA = theta + 0.055;
    const forkB = theta - 0.055;

    for (const forkTheta of [forkA, forkB]) {
      for (let step = 0; step < 28; step += 1) {
        const t = 0.68 + (step / 27) * 0.28;
        const edgeWave = 1 + Math.sin(forkTheta * 8) * 0.02 + Math.sin(forkTheta * 13 + 0.8) * 0.012;
        const r = radius * edgeWave * t;
        const x = Math.cos(forkTheta) * r;
        const z = Math.sin(forkTheta) * r * 0.9;

        positions.push(x, 0.02, z);
        colors.push(vein.r, vein.g, vein.b);
        sizes.push(0.02 + (1 - t) * 0.018);
        veins.push(1);
      }
    }
  }

  for (let index = 0; index < 180; index += 1) {
    const theta = index * 2.399963229728653;
    const r = Math.sqrt(index / 180) * 0.16;

    positions.push(Math.cos(theta) * r, 0.028, Math.sin(theta) * r * 0.9);
    colors.push(gold.r, gold.g, gold.b);
    sizes.push(0.036);
    veins.push(1);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("aColor", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setAttribute("aSize", new THREE.Float32BufferAttribute(sizes, 1));
  geometry.setAttribute("aVein", new THREE.Float32BufferAttribute(veins, 1));

  return geometry;
}

function buildLeafMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uBurst: { value: 0 },
      uPresence: { value: 0.7 },
      uWither: { value: 0 },
    },
    vertexShader: leafVertexShader,
    fragmentShader: leafFragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
  });
}

function smoothRange(start: number, end: number, value: number) {
  const t = THREE.MathUtils.clamp((value - start) / (end - start), 0, 1);

  return t * t * (3 - 2 * t);
}
