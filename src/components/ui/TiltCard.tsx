"use client";

import { useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  glowOnTilt?: boolean;
}

export default function TiltCard({ children, className, glowOnTilt = false }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = cardRef.current;
      if (!el) return;
      el.style.transition = "none";
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

      if (glowOnTilt) {
        const percentX = (x / rect.width) * 100;
        const percentY = (y / rect.height) * 100;
        el.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(0,229,255,0.06) 0%, transparent 50%)`;
      }
    },
    [glowOnTilt]
  );

  const handleMouseLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transition = "transform 0.4s ease-out, background 0.4s ease-out";
    el.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
    if (glowOnTilt) {
      el.style.background = "";
    }
  }, [glowOnTilt]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("will-change-transform", className)}
    >
      {children}
    </div>
  );
}
