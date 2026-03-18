"use client";

import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useEffect, useState } from "react";
import LetterBlocks from "./LetterBlocks";

function Scene({ isMobile }: { isMobile: boolean }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-3, 2, 4]} intensity={0.4} color="#00E5FF" />
      <pointLight position={[2, -3, -2]} intensity={0.15} color="#ffffff" />

      <Environment preset="city" />

      <LetterBlocks />

      {!isMobile && (
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.6}
            luminanceSmoothing={0.9}
            intensity={0.8}
          />
        </EffectComposer>
      )}
    </>
  );
}

export default function LetterScene() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return (
    <div className="w-full h-full min-h-[350px]">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 40 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        style={{ background: "transparent" }}
      >
        <Scene isMobile={isMobile} />
      </Canvas>
    </div>
  );
}
