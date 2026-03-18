"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

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
  parallaxStrength = 50,
}: GlowOrbProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [parallaxStrength, -parallaxStrength]);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={className}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(${color}, ${opacity}) 0%, rgba(${color}, ${opacity * 0.3}) 40%, transparent 70%)`,
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />
    </motion.div>
  );
}
