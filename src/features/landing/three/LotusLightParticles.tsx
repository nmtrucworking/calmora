import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { ScrollProgressRef } from "../types";

type LotusLightParticlesProps = {
  scrollValue: ScrollProgressRef;
};

const particleVertexShader = `
  uniform float uBloom;
  uniform float uPrelude;
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
    float bloom = clamp((uBloom - aDelay * 0.78) / max(0.001, 1.0 - aDelay * 0.78), 0.0, 1.0);
    bloom = ease(bloom);
    float prelude = ease(uPrelude);
    float drift = bloom * (1.35 + aDelay * 1.25) + prelude * 0.28;
    vec3 pos = position + aDirection * drift;
    pos.y += sin(uTime * 1.18 + aDelay * 18.0) * (0.028 + prelude * 0.045) + bloom * 0.22 + prelude * 0.08;
    pos.xz += normalize(aDirection.xz + vec2(0.001)) * sin(uTime * 0.72 + aDelay * 21.0) * (0.025 + bloom * 0.026);

    vAlpha = (prelude * 0.42 + bloom * 1.08) * (1.0 - uWither * 0.64) * (1.0 - aDelay * 0.2);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (430.0 / -mvPosition.z) * (1.05 + bloom * 0.62 + prelude * 0.28);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const particleFragmentShader = `
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float dist = length(uv);

    if (dist > 0.5) discard;

    float core = smoothstep(0.18, 0.0, dist);
    float glow = smoothstep(0.5, 0.0, dist);
    vec3 color = mix(vec3(1.0, 0.58, 0.04), vec3(1.0, 0.82, 0.18), core);
    gl_FragColor = vec4(color, glow * vAlpha * 1.42);
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

  for (let index = 0; index < 520; index += 1) {
    const angle = index * 2.399963229728653;
    const radius = Math.sqrt((index % 260) / 260) * 0.36;
    const height = -0.38 + Math.sin(index * 1.27) * 0.12;
    const spread = 0.62 + (index % 31) / 24;
    const direction = new THREE.Vector3(
      Math.cos(angle) * spread,
      0.08 + ((index % 11) / 11) * 0.36,
      Math.sin(angle) * spread,
    ).normalize();

    positions.push(Math.cos(angle) * radius, height, Math.sin(angle) * radius);
    directions.push(direction.x, direction.y, direction.z);
    delays.push((index % 47) / 58);
    sizes.push(0.044 + ((index % 13) / 13) * 0.054);
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
      uPrelude: { value: 0 },
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
    pointsRef.current.material.uniforms.uPrelude.value = smoothRange(0.1, 0.24, progress) * (1 - smoothRange(0.48, 0.7, progress) * 0.2);
    pointsRef.current.material.uniforms.uBloom.value = smoothRange(0.18, 0.56, progress);
    pointsRef.current.material.uniforms.uWither.value = smoothRange(0.78, 1, progress);
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}
