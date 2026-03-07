"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function WireframeOrb() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[2.5, 3]} />
      <meshBasicMaterial color="#2D5E45" wireframe />
    </mesh>
  );
}

function OrbitRing() {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * 3.5, 0, Math.sin(angle) * 3.5));
    }
    return pts;
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [points]);

  return (
    <line>
      <bufferGeometry attach="geometry" {...geometry} />
      <lineBasicMaterial color="#2D5E45" transparent opacity={0.15} />
    </line>
  );
}

function FloatingParticles() {
  const ref = useRef<THREE.Points>(null);
  const count = 120;

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const blueColor = new THREE.Color("#5BA4C9");
    const goldColor = new THREE.Color("#4A7A62");

    for (let i = 0; i < count; i++) {
      // Distribute particles in a sphere shell around the orb
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.2 + Math.random() * 2.0;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      // 85% blue, 15% gold
      const color = Math.random() > 0.15 ? blueColor : goldColor;
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;

    }

    return { positions: pos, colors: col };
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const material = ref.current.material as THREE.PointsMaterial;
    // Global gentle pulse
    material.opacity = 0.5 + Math.sin(clock.elapsedTime * 1.2) * 0.3;
    ref.current.rotation.y += 0.001;
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3}>
      <PointMaterial
        vertexColors
        size={0.06}
        transparent
        opacity={0.7}
        depthWrite={false}
        sizeAttenuation
      />
    </Points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.6} color="#5BA4C9" />
      <WireframeOrb />
      <OrbitRing />
      <FloatingParticles />
    </>
  );
}

export default function OrbScene() {
  return (
    <section className="relative bg-gradient-to-b from-ivory via-green to-near-black overflow-hidden">
      <div className="relative h-[60vh] min-h-[400px] md:h-[70vh]">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 50 }}
          style={{ background: "transparent" }}
          gl={{ alpha: true, antialias: true }}
        >
          <Scene />
        </Canvas>
      </div>

      {/* Overlay text */}
      <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 max-w-sm z-10">
        <p className="font-sans text-sm leading-relaxed text-white">
          Helping forward-looking companies thrive with custom AI agent systems
          and automated workflows.
        </p>
      </div>
    </section>
  );
}
