"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { BLOCK_DEFS, BLOCK_SIZE, BLOCK_RADIUS, type BlockDef } from "@/lib/letter-grids";

// Animation timing (seconds)
const HOLD = 3.0;
const MORPH = 1.2;
const CYCLE = (HOLD + MORPH) * 2;
const ENTRANCE_DURATION = 1.8;

// Stagger: blocks animate with a slight delay from each other
const STAGGER = 0.04;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

interface AnimatedBlockProps {
  block: BlockDef;
  index: number;
  totalBlocks: number;
}

const _posA = new THREE.Vector3();
const _posY = new THREE.Vector3();

function AnimatedBlock({ block, index, totalBlocks }: AnimatedBlockProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Random scatter position for entrance
  const scatter = useMemo(
    () =>
      new THREE.Vector3(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8 - 4,
      ),
    [],
  );

  // Per-block wobble phase
  const wobblePhase = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const elapsed = clock.elapsedTime;

    // ---- Entrance animation ----
    if (elapsed < ENTRANCE_DURATION) {
      const entranceStagger = (index / totalBlocks) * 0.6;
      const entranceT = clamp(
        (elapsed - entranceStagger) / (ENTRANCE_DURATION - entranceStagger),
        0,
        1,
      );
      const easedEntrance = easeInOutCubic(entranceT);

      _posA.set(...block.posA);
      mesh.position.lerpVectors(scatter, _posA, easedEntrance);
      // Y-only blocks stay invisible during entrance — only appear on first A→Y morph
      mesh.scale.setScalar(block.inA ? easedEntrance : 0);
      mesh.rotation.x = (1 - easedEntrance) * Math.PI * 2;
      mesh.rotation.y = (1 - easedEntrance) * Math.PI;
      return;
    }

    // ---- Main A↔Y cycle ----
    const cycleTime = (elapsed - ENTRANCE_DURATION) % CYCLE;

    let t: number; // 0 = A, 1 = Y
    if (cycleTime < HOLD) {
      // Holding A
      t = 0;
    } else if (cycleTime < HOLD + MORPH) {
      // Morphing A → Y
      const morphProgress = (cycleTime - HOLD) / MORPH;
      const staggerOffset = (index / totalBlocks) * STAGGER * totalBlocks;
      t = clamp((morphProgress * (MORPH + STAGGER * totalBlocks) - staggerOffset) / MORPH, 0, 1);
      t = easeInOutCubic(t);
    } else if (cycleTime < HOLD * 2 + MORPH) {
      // Holding Y
      t = 1;
    } else {
      // Morphing Y → A
      const morphProgress = (cycleTime - HOLD * 2 - MORPH) / MORPH;
      const staggerOffset = (index / totalBlocks) * STAGGER * totalBlocks;
      t = 1 - clamp((morphProgress * (MORPH + STAGGER * totalBlocks) - staggerOffset) / MORPH, 0, 1);
      t = 1 - easeInOutCubic(1 - t);
    }

    // Lerp position between A and Y
    _posA.set(...block.posA);
    _posY.set(...block.posY);
    mesh.position.lerpVectors(_posA, _posY, t);

    // Scale: blocks that don't exist in the target letter shrink
    let scale = 1;
    if (!block.inA && block.inY) {
      // Only in Y: scale from 0 → 1
      scale = t;
    } else if (block.inA && !block.inY) {
      // Only in A: scale from 1 → 0
      scale = 1 - t;
    }
    mesh.scale.setScalar(scale);

    // Subtle wobble
    const wobbleAmount = 0.02;
    mesh.rotation.x = Math.sin(elapsed * 0.8 + wobblePhase) * wobbleAmount;
    mesh.rotation.y = Math.cos(elapsed * 0.6 + wobblePhase) * wobbleAmount;
  });

  return (
    <RoundedBox
      ref={meshRef}
      args={[BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE]}
      radius={BLOCK_RADIUS}
      smoothness={2}
    >
      <meshStandardMaterial
        color="#2a2a2a"
        metalness={1}
        roughness={0.11}
      />
    </RoundedBox>
  );
}

export default function LetterBlocks() {
  const groupRef = useRef<THREE.Group>(null);

  // Gentle float + continuous Y rotation
  useFrame(({ clock }) => {
    const group = groupRef.current;
    if (!group) return;

    group.rotation.y += 0.003;
    group.position.y = Math.sin(clock.elapsedTime * 0.5) * 0.1;
  });

  return (
    <group ref={groupRef}>
      {BLOCK_DEFS.map((block, i) => (
        <AnimatedBlock
          key={block.id}
          block={block}
          index={i}
          totalBlocks={BLOCK_DEFS.length}
        />
      ))}
    </group>
  );
}
