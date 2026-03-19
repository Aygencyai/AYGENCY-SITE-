"use client";

interface GlowOrbProps {
  size?: number;
  color?: string;
  opacity?: number;
  className?: string;
  parallaxStrength?: number;
}

export default function GlowOrb({
  size = 400,
  color = "0, 229, 255",
  opacity = 0.15,
  className,
}: GlowOrbProps) {
  return (
    <div className={className}>
      <div
        style={{
          width: size,
          height: size,
          maxWidth: "80vw",
          maxHeight: "80vw",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(${color}, ${opacity}) 0%, rgba(${color}, ${opacity * 0.3}) 40%, transparent 70%)`,
          filter: "blur(20px)",
          pointerEvents: "none",
          willChange: "transform",
        }}
      />
    </div>
  );
}
