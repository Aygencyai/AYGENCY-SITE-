"use client";

import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useEffect } from "react";
import LetterBlocks from "./LetterBlocks";

// Mounts once everything above it in the scene has loaded.
function Ready({ onReady }: { onReady?: () => void }) {
  useEffect(() => onReady?.(), [onReady]);
  return null;
}

function Scene({ onReady }: { onReady?: () => void }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-3, 2, 4]} intensity={0.4} color="#00E5FF" />
      <pointLight position={[2, -3, -2]} intensity={0.15} color="#ffffff" />

      <Environment preset="city" />

      <LetterBlocks />
      <Ready onReady={onReady} />

      <EffectComposer>
        <Bloom luminanceThreshold={0.6} luminanceSmoothing={0.9} intensity={0.8} />
      </EffectComposer>
    </>
  );
}

// Desktop only. LetterSceneLoader shows a static poster everywhere else.
export default function LetterScene({ onReady }: { onReady?: () => void }) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 40 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
        style={{ background: "transparent" }}
      >
        <Scene onReady={onReady} />
      </Canvas>
    </div>
  );
}
