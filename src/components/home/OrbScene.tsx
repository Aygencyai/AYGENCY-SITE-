"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function fibonacciSphere(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const goldenRatio = (1 + Math.sqrt(5)) / 2;

  for (let i = 0; i < count; i++) {
    const theta = (2 * Math.PI * i) / goldenRatio;
    const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
  }

  return positions;
}

function ParticleSphere() {
  const ref = useRef<THREE.Points>(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const count = isMobile ? 800 : 2000;

  const basePositions = useMemo(() => fibonacciSphere(count, 2.5), [count]);

  const colors = useMemo(() => {
    const col = new Float32Array(count * 3);
    const cyanColor = new THREE.Color("#00E5FF");
    for (let i = 0; i < count; i++) {
      const opacity = 0.4 + Math.random() * 0.6;
      col[i * 3] = cyanColor.r * opacity;
      col[i * 3 + 1] = cyanColor.g * opacity;
      col[i * 3 + 2] = cyanColor.b * opacity;
    }
    return col;
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.002;
    ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.3) * 0.1;

    const material = ref.current.material as THREE.PointsMaterial;
    material.opacity = 0.6 + Math.sin(clock.elapsedTime * 0.8) * 0.05;
  });

  return (
    <Points ref={ref} positions={basePositions} colors={colors} stride={3}>
      <PointMaterial
        vertexColors
        size={isMobile ? 0.03 : 0.025}
        transparent
        opacity={0.7}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function FloatingParticles() {
  const ref = useRef<THREE.Points>(null);
  const count = 300;

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const cyanColor = new THREE.Color("#00E5FF");

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.8 + Math.random() * 2.5;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const brightness = 0.2 + Math.random() * 0.5;
      col[i * 3] = cyanColor.r * brightness;
      col[i * 3 + 1] = cyanColor.g * brightness;
      col[i * 3 + 2] = cyanColor.b * brightness;
    }

    return { positions: pos, colors: col };
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const material = ref.current.material as THREE.PointsMaterial;
    material.opacity = 0.4 + Math.sin(clock.elapsedTime * 1.2) * 0.05;
    ref.current.rotation.y += 0.0008;
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3}>
      <PointMaterial
        vertexColors
        size={0.04}
        transparent
        opacity={0.5}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function GlowSphere() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!ref.current) return;
    const material = ref.current.material as THREE.MeshBasicMaterial;
    material.opacity = 0.03;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[3.2, 32, 32]} />
      <meshBasicMaterial
        color="#00E5FF"
        transparent
        opacity={0.04}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={0.4} color="#00E5FF" />
      <ParticleSphere />
      <FloatingParticles />
      <GlowSphere />
    </>
  );
}

export default function OrbScene() {
  return (
    <section className="relative bg-void overflow-hidden">
      <div className="relative h-[60vh] min-h-[400px] md:h-[70vh]">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 50 }}
          style={{ background: "transparent" }}
          gl={{ alpha: true, antialias: true }}
        >
          <Scene />
        </Canvas>
      </div>

      {/* Overlay text with glass treatment */}
      <div className="absolute bottom-6 left-6 right-6 md:right-auto md:bottom-12 md:left-12 max-w-sm z-10">
        <div className="glass rounded-lg p-4">
          <p className="font-sans text-sm leading-relaxed text-ghost-muted">
            Helping forward-looking companies thrive with custom AI agent systems
            and automated workflows.
          </p>
        </div>
      </div>
    </section>
  );
}
