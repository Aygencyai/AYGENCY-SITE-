"use client";

import AnimatedGrid from "@/components/effects/AnimatedGrid";
import GlowOrb from "@/components/effects/GlowOrb";

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <AnimatedGrid />
      {/* Large cyan glow — top right */}
      <GlowOrb
        size={600}
        opacity={0.12}
        className="absolute -top-40 -right-40"
        parallaxStrength={30}
      />
      {/* Smaller glow — bottom left */}
      <GlowOrb
        size={350}
        opacity={0.08}
        className="absolute -bottom-20 -left-20"
        parallaxStrength={20}
      />
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />
    </div>
  );
}
