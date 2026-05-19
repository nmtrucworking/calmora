import { Environment, Float, OrbitControls, Sparkles } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import type { ScrollProgressRef } from "../types";
import { LotusLeaf } from "./LotusLeaf";
import { Petal } from "./Petal";
import { TeaCore } from "./TeaCore";

type LotusSceneProps = {
  scrollProgressRef: ScrollProgressRef;
};

export function LotusScene({ scrollProgressRef }: LotusSceneProps) {
  const petals = useMemo(() => Array.from({ length: 34 }, (_, index) => index), []);

  useFrame(({ camera }) => {
    const burst = scrollProgressRef.current;

    camera.position.z = 5.7 + burst * 1.8;
    camera.position.y = 1.15 + burst * 0.65;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <color attach="background" args={["#07110f"]} />
      <fog attach="fog" args={["#07110f", 5.5, 13]} />
      <ambientLight intensity={0.55} />
      <pointLight position={[2.7, 2.9, 2.4]} color="#ffd3e5" intensity={22} distance={8} />
      <pointLight position={[-3.4, -1.1, -1.2]} color="#82f7c8" intensity={12} distance={8} />
      <spotLight position={[0, 5, 3]} angle={0.44} penumbra={0.7} intensity={18} castShadow />
      <Sparkles count={120} scale={[7, 5, 7]} size={2.1} speed={0.45} opacity={0.58} color="#fff4c7" />
      <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.35}>
        <group position={[0, 0.03, 0]}>
          <LotusLeaf scrollValue={scrollProgressRef} />
          {petals.map((petal) => (
            <Petal key={petal} index={petal} total={petals.length} scrollValue={scrollProgressRef} />
          ))}
          <TeaCore scrollValue={scrollProgressRef} />
        </group>
      </Float>
      <Environment preset="night" />
      <OrbitControls
        autoRotate
        autoRotateSpeed={0.25}
        enablePan={false}
        enableZoom={false}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 3}
      />
    </>
  );
}
