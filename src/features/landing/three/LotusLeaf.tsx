import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { ScrollProgressRef } from "../types";

type LotusLeafProps = {
  scrollValue: ScrollProgressRef;
};

export function LotusLeaf({ scrollValue }: LotusLeafProps) {
  const groupRef = useRef<THREE.Group>(null);
  const surfaceRef = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhysicalMaterial>>(null);
  const pointsRef = useRef<THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>>(null);
  const surfaceGeometry = useMemo(() => buildLeafSurfaceGeometry(), []);
  const surfaceMaterial = useMemo(() => buildLeafSurfaceMaterial(), []);
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
      pointsRef.current.material.uniforms.uPresence.value = 0.82 - wither * 0.16;
    }

    if (surfaceRef.current) {
      surfaceRef.current.material.opacity = 0.84 - wither * 0.1;
      surfaceRef.current.material.roughness = 0.72 + wither * 0.12;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={surfaceRef} geometry={surfaceGeometry} material={surfaceMaterial} receiveShadow />
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
    vec3 dryColor = vec3(0.42, 0.38, 0.25);
    vColor = mix(aColor, dryColor, uWither * 0.34);

    vec3 pos = position;
    float radial = length(pos.xz);
    float wave = sin(uTime * 1.1 + radial * 4.0) * 0.012;

    pos.y += wave + uBurst * (aVein * 0.02 - 0.018) - uWither * 0.035;
    pos.xz *= 1.0 + uBurst * 0.025;

    vAlpha = mix(0.36, 0.72, aVein) * uPresence;

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

function buildLeafSurfaceGeometry() {
  const radialSegments = 160;
  const rings = 26;
  const positions: number[] = [0, -0.09, 0];
  const colors: number[] = [];
  const indices: number[] = [];
  const leaf = new THREE.Color("#32b862");
  const deepLeaf = new THREE.Color("#064f37");
  const vein = new THREE.Color("#d0f0a6");
  const gold = new THREE.Color("#b49a31");
  const radius = 1.92;

  colors.push(gold.r, gold.g, gold.b);

  for (let ring = 1; ring <= rings; ring += 1) {
    const t = ring / rings;

    for (let index = 0; index < radialSegments; index += 1) {
      const theta = (index / radialSegments) * Math.PI * 2;
      const rimRipple = 1 + Math.sin(theta * 8) * 0.024 + Math.sin(theta * 13 + 0.8) * 0.014;
      const notch = 1 - smoothRange(0.82, 1, Math.max(0, Math.cos(theta + Math.PI * 0.5))) * 0.1 * t;
      const r = radius * t * rimRipple * notch;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r * 0.9;
      const radialVein = Math.pow(Math.max(0, Math.cos(theta * 18)), 18) * (0.18 + t * 0.28);
      const centerGold = smoothRange(0, 0.18, 1 - t) * 0.2;
      const y =
        -0.095 +
        Math.pow(t, 0.82) * 0.09 +
        Math.sin(theta * 9) * Math.pow(t, 1.7) * 0.012 -
        smoothRange(0.72, 1, Math.max(0, Math.cos(theta + Math.PI * 0.5))) * 0.025;
      const color = deepLeaf
        .clone()
        .lerp(leaf, 0.55 + (1 - t) * 0.26)
        .lerp(vein, radialVein * 1.12)
        .lerp(gold, centerGold * 1.18);

      positions.push(x, y, z);
      colors.push(color.r, color.g, color.b);
    }
  }

  for (let index = 0; index < radialSegments; index += 1) {
    indices.push(0, 1 + ((index + 1) % radialSegments), 1 + index);
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

      indices.push(a, b, c, b, d, c);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(indices);
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();

  return geometry;
}

function buildLeafGeometry() {
  const positions: number[] = [];
  const colors: number[] = [];
  const sizes: number[] = [];
  const veins: number[] = [];
  const leaf = new THREE.Color("#2faa63");
  const deepLeaf = new THREE.Color("#064730");
  const vein = new THREE.Color("#c8efb0");
  const gold = new THREE.Color("#b49b38");
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
    const color = deepLeaf.clone().lerp(leaf, 0.42 + (1 - t) * 0.44).lerp(gold, smoothRange(0, 0.16, 1 - t) * 0.1);

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

function buildLeafSurfaceMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: "#ffffff",
    metalness: 0,
    opacity: 0.84,
    roughness: 0.72,
    sheen: 0.28,
    side: THREE.DoubleSide,
    transparent: true,
    vertexColors: true,
  });
}

function buildLeafMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uBurst: { value: 0 },
      uPresence: { value: 0.82 },
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
