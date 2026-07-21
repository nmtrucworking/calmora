import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { ScrollProgressRef } from "../types";

type LotusFlowerProps = {
  scrollValue: ScrollProgressRef;
};

type PetalConfig = {
  angle: number;
  bloomTilt: number;
  budTilt: number;
  fallDelay: number;
  layer: number;
  length: number;
  phase: number;
  rootRadius: number;
  sideCurl: number;
  width: number;
  witherTilt: number;
};

type FallingPetalConfig = {
  angle: number;
  delay: number;
  drift: number;
  layer: number;
  length: number;
  phase: number;
  radius: number;
  width: number;
};

const BUD_PANEL_COUNT = 10;
const PETAL_LAYERS = [
  { count: 6, length: 1.24, width: 0.34, radius: 0.1, bloomTilt: 0.38 },
  { count: 7, length: 1.52, width: 0.42, radius: 0.18, bloomTilt: 0.62 },
  { count: 7, length: 1.84, width: 0.52, radius: 0.27, bloomTilt: 0.9 },
  { count: 6, length: 2.12, width: 0.64, radius: 0.38, bloomTilt: 1.18 },
];

function clamp01(value: number) {
  return THREE.MathUtils.clamp(value, 0, 1);
}

function smoothRange(start: number, end: number, value: number) {
  const t = clamp01((value - start) / (end - start));

  return t * t * (3 - 2 * t);
}

function hash(value: number) {
  return THREE.MathUtils.euclideanModulo(Math.sin(value * 12.9898) * 43758.5453, 1);
}

function makeLayerPalettes() {
  return [
    { base: "#fffaf8", edge: "#f1a0b7" },
    { base: "#fff7f7", edge: "#e98ca9" },
    { base: "#fff3f5", edge: "#df7398" },
    { base: "#ffedf2", edge: "#d45d88" },
  ];
}

function buildPetalGeometry(layer: number, asSepal = false) {
  const widthSegments = 16;
  const lengthSegments = 34;
  const positions: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  const palette = makeLayerPalettes()[layer];
  const base = new THREE.Color(asSepal ? "#8fc478" : palette.base);
  const edge = new THREE.Color(asSepal ? "#2e945a" : palette.edge);
  const rootIvory = new THREE.Color("#fffdf9");

  for (let yIndex = 0; yIndex <= lengthSegments; yIndex += 1) {
    const u = yIndex / lengthSegments;
    const widthProfile = Math.pow(Math.sin(Math.PI * u), 0.58) * (1 - u * 0.12);
    const centerLift = Math.sin(u * Math.PI) * (0.11 + layer * 0.012);
    const tipCurl = Math.pow(u, 2.45) * (0.12 + layer * 0.02);

    for (let xIndex = 0; xIndex <= widthSegments; xIndex += 1) {
      const s = (xIndex / widthSegments) * 2 - 1;
      const edgeAmount = Math.abs(s);
      const x = s * widthProfile * (1 - smoothRange(0.86, 1, u) * 0.2);
      const y = u;
      const z =
        centerLift +
        tipCurl -
        edgeAmount * edgeAmount * Math.sin(Math.PI * u) * 0.045 +
        (1 - edgeAmount) * Math.sin(Math.PI * u) * 0.018;
      const rootFade = 1 - smoothRange(0.04, 0.46, u);
      const color = base
        .clone()
        .lerp(edge, Math.pow(edgeAmount, 1.55) * 0.34 + smoothRange(0.62, 1, u) * 0.42)
        .lerp(rootIvory, asSepal ? 0 : rootFade * 0.94);

      // Delicate vertical veins on the petals
      const veinWave = Math.sin(s * Math.PI * 8.0 + u * 2.0);
      const veinStrength = Math.pow(Math.max(0, veinWave), 3.0) * (0.045 + smoothRange(0.25, 0.9, u) * 0.1) * (1 - rootFade * 0.82);
      const petalVeinColor = edge.clone().lerp(new THREE.Color(asSepal ? "#1d6b48" : "#b84e75"), 0.16);
      color.lerp(petalVeinColor, veinStrength);

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

function buildBudGeometry() {
  const heightSegments = 46;
  const radialSegments = 96;
  const positions: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  const blush = new THREE.Color("#ff4f90");
  const rose = new THREE.Color("#bd0c5b");
  const pearl = new THREE.Color("#ff9fc2");
  const coolShadow = new THREE.Color("#664052");
  const sepalGreen = new THREE.Color("#1e8a58");
  const petalGreen = new THREE.Color("#59b145");

  for (let yIndex = 0; yIndex <= heightSegments; yIndex += 1) {
    const u = yIndex / heightSegments;
    const lowerBelly = Math.pow(smoothRange(0, 0.34, u), 0.42);
    const pointedTop = Math.pow(1 - smoothRange(0.42, 1, u), 0.75);
    const ovalBase = 0.16 * (1 - smoothRange(0.02, 0.2, u));
    const belly = 0.58 * lowerBelly * pointedTop;
    const radius = 0.01 + ovalBase + belly;
    const y = -0.74 + u * 2.16;

    for (let xIndex = 0; xIndex <= radialSegments; xIndex += 1) {
      const v = xIndex / radialSegments;
      const theta = v * Math.PI * 2;
      const panelWave = Math.cos(theta * BUD_PANEL_COUNT + u * 1.4);
      const seam = Math.pow(Math.max(0, panelWave), 2.5);
      const groove = Math.pow(Math.max(0, -panelWave), 4);
      const topFold = smoothRange(0.7, 1, u) * Math.sin(theta * BUD_PANEL_COUNT * 0.5) * 0.007;
      const shapedRadius = radius * (1 + seam * 0.032 - groove * 0.038) + topFold;
      const x = Math.sin(theta) * shapedRadius;
      const z = Math.cos(theta) * shapedRadius * (0.9 + smoothRange(0.3, 1, u) * 0.08);
      const edgeShadow = smoothRange(0.45, 1, groove);
      const pearlLift = smoothRange(0.18, 0.62, u) * (1 - smoothRange(0.8, 1, u)) * (0.2 + seam * 0.28);
      const greenPetalLayer =
        smoothRange(0.46, 0.08, u) * 0.56 +
        smoothRange(0.18, 0.5, u) * (1 - smoothRange(0.58, 0.82, u)) * groove * 0.18;
      
      const creamYellow = new THREE.Color("#f0d37a");
      const creamLift = smoothRange(0.1, 0.45, u) * (1 - smoothRange(0.45, 0.75, u)) * 0.42;

      const color = blush
        .clone()
        .lerp(rose, smoothRange(0.44, 1, u) * 0.42 + seam * 0.16)
        .lerp(pearl, pearlLift)
        .lerp(creamYellow, creamLift)
        .lerp(coolShadow, edgeShadow * 0.28)
        .lerp(petalGreen, greenPetalLayer)
        .lerp(sepalGreen, smoothRange(0.22, 0, u) * 0.62);

      // High-frequency vertical veins (striations)
      const veinFreq = 160;
      const veinWave = Math.sin(theta * veinFreq + u * 5.0);
      const veinStrength = Math.pow(Math.max(0, veinWave), 3.0) * (0.16 + smoothRange(0.2, 0.9, u) * 0.22) * (1 - smoothRange(0.9, 1, u) * 0.5);
      
      const isGreenArea = smoothRange(0.35, 0.05, u);
      const veinColor = isGreenArea > 0.5
        ? sepalGreen.clone().lerp(new THREE.Color("#0f4f35"), 0.5)
        : rose.clone().lerp(new THREE.Color("#710034"), 0.4);

      color.lerp(veinColor, veinStrength);

      positions.push(x, y, z);
      colors.push(color.r, color.g, color.b);
    }
  }

  for (let yIndex = 0; yIndex < heightSegments; yIndex += 1) {
    for (let xIndex = 0; xIndex < radialSegments; xIndex += 1) {
      const a = yIndex * (radialSegments + 1) + xIndex;
      const b = a + 1;
      const c = a + radialSegments + 1;
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

function buildPetalConfigs(): PetalConfig[] {
  return PETAL_LAYERS.flatMap((layerConfig, layer) =>
    Array.from({ length: layerConfig.count }, (_, index) => {
      const layerOffset = (layer % 2) * 0.5;
      const seed = layer * 37 + index * 11;
      const jitter = (hash(seed) - 0.5) * 0.06;
      const angle = ((index + layerOffset) / layerConfig.count) * Math.PI * 2 + jitter;
      const side = index % 2 === 0 ? 1 : -1;

      return {
        angle,
        bloomTilt: layerConfig.bloomTilt + (hash(seed + 2) - 0.5) * 0.08,
        budTilt: -0.2 + layer * 0.014 + hash(seed + 3) * 0.014,
        fallDelay: hash(seed + 4) * 0.055,
        layer,
        length: layerConfig.length * (0.94 + hash(seed + 5) * 0.1),
        phase: hash(seed + 6) * Math.PI * 2,
        rootRadius: layerConfig.radius * (0.92 + hash(seed + 7) * 0.18),
        sideCurl: side * (0.035 + hash(seed + 8) * 0.055),
        width: layerConfig.width * (0.88 + hash(seed + 9) * 0.16),
        witherTilt: 0.36 + layer * 0.15 + hash(seed + 10) * 0.16,
      };
    }),
  );
}

function buildFallingPetalConfigs(): FallingPetalConfig[] {
  const fallingPetalCount = 8;

  return Array.from({ length: fallingPetalCount }, (_, index) => {
    const seed = index * 19 + 5;
    const layer = 1 + (index % 3);

    return {
      angle: (index / fallingPetalCount) * Math.PI * 2 + (hash(seed) - 0.5) * 0.8,
      delay: index * 0.009 + hash(seed + 1) * 0.028,
      drift: 0.55 + hash(seed + 2) * 0.85,
      layer,
      length: 0.58 + hash(seed + 3) * 0.28,
      phase: hash(seed + 4) * Math.PI * 2,
      radius: 0.5 + hash(seed + 5) * 0.36,
      width: 0.16 + hash(seed + 6) * 0.08,
    };
  });
}

function makePetalMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: "#ffffff",
    emissive: "#8b5368",
    emissiveIntensity: 0.025,
    metalness: 0,
    opacity: 0.96,
    roughness: 0.62,
    sheen: 0.38,
    side: THREE.DoubleSide,
    transparent: true,
    vertexColors: true,
  });
}

export function LotusFlower({ scrollValue }: LotusFlowerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const budRef = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhysicalMaterial>>(null);
  const sepalRefs = useRef<Array<THREE.Mesh | null>>([]);
  const petalRefs = useRef<Array<THREE.Mesh | null>>([]);
  const fallingRefs = useRef<Array<THREE.Mesh | null>>([]);
  const budGeometry = useMemo(() => buildBudGeometry(), []);
  const sepalGeometry = useMemo(() => buildPetalGeometry(0, true), []);
  const budMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#ffffff",
        emissive: "#4a1028",
        emissiveIntensity: 0.05,
        metalness: 0,
        opacity: 1,
        roughness: 0.58,
        sheen: 0.48,
        side: THREE.DoubleSide,
        transparent: true,
        vertexColors: true,
      }),
    [],
  );
  const sepalMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#ffffff",
        emissive: "#123f2d",
        emissiveIntensity: 0.045,
        metalness: 0,
        opacity: 0.95,
        roughness: 0.68,
        side: THREE.DoubleSide,
        transparent: true,
        vertexColors: true,
      }),
    [],
  );
  const petalConfigs = useMemo(() => buildPetalConfigs(), []);
  const fallingPetals = useMemo(() => buildFallingPetalConfigs(), []);
  const petalGeometries = useMemo(() => PETAL_LAYERS.map((_, layer) => buildPetalGeometry(layer)), []);
  const petalMaterials = useMemo(() => PETAL_LAYERS.map(() => makePetalMaterial()), []);
  const fallingMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#f04d8d",
        emissive: "#5f1231",
        emissiveIntensity: 0.05,
        metalness: 0,
        opacity: 0,
        roughness: 0.74,
        sheen: 0.28,
        side: THREE.DoubleSide,
        transparent: true,
        vertexColors: true,
      }),
    [],
  );
  const whiteTint = useMemo(() => new THREE.Color("#ffffff"), []);
  const witherTint = useMemo(() => new THREE.Color("#b99591"), []);
  const bloomGlow = useMemo(() => new THREE.Color("#df7a9c"), []);
  const quietGlow = useMemo(() => new THREE.Color("#8b5368"), []);
  const dummy = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    const progress = scrollValue.current;
    const bloom = smoothRange(0.18, 0.55, progress);
    const fullBloom = smoothRange(0.5, 0.72, progress) * (1 - smoothRange(0.78, 0.94, progress) * 0.42);
    const wither = smoothRange(0.78, 1, progress);
    const petalPresence = smoothRange(0.2, 0.36, progress);
    const budPresence = 1 - smoothRange(0.18, 0.4, progress);

    if (groupRef.current) {
      groupRef.current.rotation.y = elapsed * 0.045 + progress * 0.34;
      groupRef.current.position.y = -0.18 - wither * 0.08 + fullBloom * 0.04;
      groupRef.current.scale.setScalar(1.02 + bloom * 0.08 - wither * 0.04);
    }

    if (budRef.current) {
      budRef.current.visible = budPresence > 0.02;
      budRef.current.material.opacity = budPresence;
      budRef.current.rotation.y = elapsed * 0.025 + progress * 0.2;
      budRef.current.scale.set(
        1 - smoothRange(0.16, 0.36, progress) * 0.1,
        1 - smoothRange(0.2, 0.4, progress) * 0.08,
        1 - smoothRange(0.16, 0.36, progress) * 0.1,
      );
    }

    sepalRefs.current.forEach((mesh, index) => {
      if (!mesh) return;

      const material = mesh.material as THREE.MeshPhysicalMaterial;
      const angle = (index / 6) * Math.PI * 2 + 0.18;
      const open = smoothRange(0.18, 0.42, progress);
      material.opacity = budPresence * 0.9;
      mesh.visible = budPresence > 0.02;
      mesh.position.set(Math.sin(angle) * 0.15, -0.74, Math.cos(angle) * 0.15);
      mesh.rotation.order = "YXZ";
      mesh.rotation.y = angle;
      mesh.rotation.x = 0.52 + open * 0.35;
      mesh.rotation.z = (index % 2 === 0 ? 1 : -1) * 0.12;
      mesh.scale.set(0.68, 1.15, 1.15);
    });

    petalMaterials.forEach((material, layer) => {
      const layerWarmth = layer / (PETAL_LAYERS.length - 1);
      material.color.copy(whiteTint).lerp(witherTint, wither * (0.68 + layerWarmth * 0.2));
      material.emissive.copy(quietGlow).lerp(bloomGlow, fullBloom * (0.3 + layerWarmth * 0.34));
      material.emissiveIntensity = 0.022 + fullBloom * 0.065 - wither * 0.012;
      material.opacity = (0.95 - wither * 0.18) * petalPresence;
    });

    petalConfigs.forEach((config, index) => {
      const mesh = petalRefs.current[index];

      if (!mesh) return;

      const layerOpen = smoothRange(0.16 + config.layer * 0.035, 0.44 + config.layer * 0.035, progress);
      const petalWither = smoothRange(0.78 + config.fallDelay, 1, progress);
      const breathing = Math.sin(elapsed * 0.72 + config.phase) * 0.012;
      const radius = config.rootRadius * (0.24 + layerOpen * 0.76) + petalWither * (0.04 + config.layer * 0.018);
      const angle = config.angle + breathing + petalWither * config.sideCurl * 1.7;
      const lift = -0.64 + config.layer * 0.035 - petalWither * (0.16 + config.layer * 0.04);
      const tilt = THREE.MathUtils.lerp(config.budTilt, config.bloomTilt, layerOpen) + petalWither * config.witherTilt;
      const narrowBud = 0.28 + layerOpen * 0.72;

      mesh.visible = true;
      mesh.position.set(Math.sin(angle) * radius, lift, Math.cos(angle) * radius);
      mesh.rotation.order = "YXZ";
      mesh.rotation.y = angle;
      mesh.rotation.x = tilt;
      mesh.rotation.z = config.sideCurl * layerOpen + petalWither * config.sideCurl * 2.9;
      mesh.scale.set(config.width * narrowBud, config.length * (0.94 + layerOpen * 0.08), config.length);
    });

    fallingPetals.forEach((config, index) => {
      const mesh = fallingRefs.current[index];

      if (!mesh) return;

      const fall = smoothRange(0.76 + config.delay, 1, progress);
      const material = mesh.material as THREE.MeshPhysicalMaterial;
      material.opacity = smoothRange(0.78, 0.92, progress) * (0.84 - wither * 0.08);
      mesh.visible = fall > 0.01;

      if (!mesh.visible) return;

      const swirl = config.angle + Math.sin(elapsed * 0.42 + config.phase) * 0.18 + fall * 0.75;
      const radius = config.radius + fall * (0.72 + config.drift);
      dummy.set(
        Math.sin(swirl) * radius,
        -0.08 + Math.sin(config.phase) * 0.18 - fall * (0.48 + config.drift * 0.28),
        Math.cos(swirl) * radius,
      );
      mesh.position.copy(dummy);
      mesh.rotation.order = "YXZ";
      mesh.rotation.y = swirl + fall * 1.2;
      mesh.rotation.x = 1.12 + fall * 1.1 + Math.sin(elapsed + config.phase) * 0.08;
      mesh.rotation.z = Math.sin(config.phase) * 0.6 + fall * 1.8;
      mesh.scale.set(config.width, config.length, config.length);
    });
  });

  return (
    <group ref={groupRef}>
      <mesh ref={budRef} castShadow geometry={budGeometry} material={budMaterial} receiveShadow />
      {Array.from({ length: 6 }, (_, index) => (
        <mesh
          key={`sepal-${index}`}
          ref={(node) => {
            sepalRefs.current[index] = node;
          }}
          geometry={sepalGeometry}
          material={sepalMaterial}
        />
      ))}
      {petalConfigs.map((config, index) => (
        <mesh
          key={`${config.layer}-${index}`}
          ref={(node) => {
            petalRefs.current[index] = node;
          }}
          castShadow
          geometry={petalGeometries[config.layer]}
          material={petalMaterials[config.layer]}
          receiveShadow
        />
      ))}
      {fallingPetals.map((config, index) => (
        <mesh
          key={`falling-${index}`}
          ref={(node) => {
            fallingRefs.current[index] = node;
          }}
          geometry={petalGeometries[config.layer]}
          material={fallingMaterial}
        />
      ))}
    </group>
  );
}
