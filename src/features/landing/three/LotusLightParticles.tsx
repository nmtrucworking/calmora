import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { ScrollProgressRef } from "../types";

type LotusLightParticlesProps = {
  scrollValue: ScrollProgressRef;
};

const particleVertexShader = `
  uniform float uBloom;
  uniform float uTime;
  uniform float uWither;

  attribute vec3 aDirection;
  attribute float aDelay;
  attribute float aSize;

  varying float vAlpha;

  float ease(float value) {
    return value * value * (3.0 - 2.0 * value);
  }

  void main() {
    float bloom = clamp((uBloom - aDelay) / max(0.001, 1.0 - aDelay), 0.0, 1.0);
    bloom = ease(bloom);
    float drift = bloom * (1.15 + aDelay * 0.9);
    vec3 pos = position + aDirection * drift;
    pos.y += sin(uTime * 0.9 + aDelay * 18.0) * 0.035 + bloom * 0.18;
    pos.xz += normalize(aDirection.xz + vec2(0.001)) * sin(uTime * 0.55 + aDelay * 21.0) * 0.025;

    vAlpha = bloom * (1.0 - uWither * 0.72) * (1.0 - aDelay * 0.32);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (390.0 / -mvPosition.z) * (0.85 + bloom * 0.45);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const particleFragmentShader = `
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float dist = length(uv);

    if (dist > 0.5) discard;

    float core = smoothstep(0.25, 0.0, dist);
    float glow = smoothstep(0.5, 0.05, dist);
    vec3 color = mix(vec3(1.0, 0.7, 0.28), vec3(1.0, 0.96, 0.74), core);
    gl_FragColor = vec4(color, glow * vAlpha);
  }
`;

function smoothRange(start: number, end: number, value: number) {
  const t = THREE.MathUtils.clamp((value - start) / (end - start), 0, 1);

  return t * t * (3 - 2 * t);
}

function buildParticleGeometry() {
  const positions: number[] = [];
  const directions: number[] = [];
  const delays: number[] = [];
  const sizes: number[] = [];

  for (let index = 0; index < 180; index += 1) {
    const angle = index * 2.399963229728653;
    const radius = Math.sqrt(index / 180) * 0.28;
    const height = -0.34 + Math.sin(index * 1.27) * 0.08;
    const spread = 0.55 + (index % 17) / 17;
    const direction = new THREE.Vector3(
      Math.cos(angle) * spread,
      0.08 + ((index % 11) / 11) * 0.36,
      Math.sin(angle) * spread,
    ).normalize();

    positions.push(Math.cos(angle) * radius, height, Math.sin(angle) * radius);
    directions.push(direction.x, direction.y, direction.z);
    delays.push((index % 29) / 46);
    sizes.push(0.038 + ((index % 9) / 9) * 0.036);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("aDirection", new THREE.Float32BufferAttribute(directions, 3));
  geometry.setAttribute("aDelay", new THREE.Float32BufferAttribute(delays, 1));
  geometry.setAttribute("aSize", new THREE.Float32BufferAttribute(sizes, 1));

  return geometry;
}

function buildParticleMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uBloom: { value: 0 },
      uTime: { value: 0 },
      uWither: { value: 0 },
    },
    vertexShader: particleVertexShader,
    fragmentShader: particleFragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

export function LotusLightParticles({ scrollValue }: LotusLightParticlesProps) {
  const pointsRef = useRef<THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>>(null);
  const geometry = useMemo(() => buildParticleGeometry(), []);
  const material = useMemo(() => buildParticleMaterial(), []);

  useFrame(({ clock }) => {
    const progress = scrollValue.current;

    if (!pointsRef.current) return;

    pointsRef.current.material.uniforms.uTime.value = clock.getElapsedTime();
    pointsRef.current.material.uniforms.uBloom.value = smoothRange(0.26, 0.64, progress);
    pointsRef.current.material.uniforms.uWither.value = smoothRange(0.78, 1, progress);
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}
