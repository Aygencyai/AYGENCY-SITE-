"use client";

import { cn } from "@/lib/utils";
import TiltCard from "./TiltCard";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  tilt?: boolean;
  glow?: boolean;
  gradientBorder?: boolean;
  accentColor?: "cyan" | "error";
}

export default function GlassCard({
  children,
  className,
  tilt = true,
  glow = true,
  gradientBorder = true,
  accentColor = "cyan",
}: GlassCardProps) {
  const borderGradient =
    accentColor === "cyan"
      ? "before:bg-gradient-to-r before:from-transparent before:via-cyan/30 before:to-transparent"
      : "before:bg-gradient-to-r before:from-transparent before:via-error/30 before:to-transparent";

  const card = (
    <div
      className={cn(
        "relative rounded-xl bg-void-light/60 backdrop-blur-xl border border-ghost/[0.06] p-6 md:p-8",
        "transition-all duration-300",
        glow && "hover:shadow-card-hover hover:border-ghost/[0.12]",
        gradientBorder &&
          "before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:content-['']",
        gradientBorder && borderGradient,
        className
      )}
    >
      {children}
    </div>
  );

  if (tilt) {
    return <TiltCard glowOnTilt>{card}</TiltCard>;
  }

  return card;
}
