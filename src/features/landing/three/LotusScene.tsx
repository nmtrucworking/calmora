import { Environment, Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { ScrollProgressRef } from "../types";
import { LotusBackdrop } from "./LotusBackdrop";
import { LotusFlower } from "./LotusFlower";
import { LotusLeaf } from "./LotusLeaf";
import { LotusLightParticles } from "./LotusLightParticles";
import { TeaCore } from "./TeaCore";

type LotusSceneProps = {
  scrollProgressRef: ScrollProgressRef;
};

function smoothRange(start: number, end: number, value: number) {
  const t = THREE.MathUtils.clamp((value - start) / (end - start), 0, 1);

  return t * t * (3 - 2 * t);
}

export function LotusScene({ scrollProgressRef }: LotusSceneProps) {
  const modelGroupRef = useRef<THREE.Group>(null);
  const keyLightRef = useRef<THREE.PointLight>(null);
  const rimLightRef = useRef<THREE.PointLight>(null);
  const topLightRef = useRef<THREE.SpotLight>(null);

  useFrame(({ camera, size }) => {
    const progress = scrollProgressRef.current;
    const bloom = smoothRange(0.18, 0.62, progress);
    const fullBloom = smoothRange(0.5, 0.72, progress);
    const wither = smoothRange(0.78, 1, progress);
    const isMobile = size.width < 640;

    camera.position.z = 5.25 + bloom * 0.48 + wither * 0.74 + (isMobile ? 0.55 : 0);
    camera.position.y = 1.08 + bloom * 0.28 - wither * 0.08;
    camera.lookAt(0, 0.08 - wither * 0.18, 0);

    if (modelGroupRef.current) {
      modelGroupRef.current.position.set(0, (isMobile ? -0.64 : 0.04) + wither * 0.58, 0);
      modelGroupRef.current.scale.setScalar(isMobile ? 0.86 : 1);
    }

    if (keyLightRef.current) {
      keyLightRef.current.intensity = 10 + fullBloom * 7 - wither * 2;
      keyLightRef.current.position.y = 2.6 + bloom * 0.6;
    }

    if (rimLightRef.current) {
      rimLightRef.current.intensity = 4 + bloom * 3.5 - wither;
    }

    if (topLightRef.current) {
      topLightRef.current.intensity = 6 + fullBloom * 6 - wither * 1.5;
    }
  });

  return (
    <>
      <color attach="background" args={["#F7F3E8"]} />
      <fog attach="fog" args={["#F7F3E8", 6.2, 13.5]} />
      <ambientLight intensity={0.88} />
      <pointLight ref={keyLightRef} position={[2.2, 2.8, 2.7]} color="#F1D7AD" intensity={10} distance={8} />
      <pointLight ref={rimLightRef} position={[-3.2, -0.4, -1.8]} color="#77927E" intensity={4} distance={9} />
      <spotLight ref={topLightRef} position={[0, 5.2, 2.2]} angle={0.42} penumbra={0.78} intensity={6} castShadow />
      <Float speed={0.55} rotationIntensity={0.08} floatIntensity={0.14}>
        <group ref={modelGroupRef} position={[0, 0.04, 0]}>
          <LotusBackdrop scrollValue={scrollProgressRef} />
          <LotusLeaf scrollValue={scrollProgressRef} />
          <LotusFlower scrollValue={scrollProgressRef} />
          <LotusLightParticles scrollValue={scrollProgressRef} />
          <TeaCore scrollValue={scrollProgressRef} />
        </group>
      </Float>
      <Environment preset="studio" />
    </>
  );
}
