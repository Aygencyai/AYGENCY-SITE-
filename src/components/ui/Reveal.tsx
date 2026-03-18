"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type RevealVariant = "fade-up" | "blur" | "slide" | "fade";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  variant?: RevealVariant;
  className?: string;
}

const directionOffset = {
  up: { x: 0, y: 50 },
  down: { x: 0, y: -50 },
  left: { x: 50, y: 0 },
  right: { x: -50, y: 0 },
};

export default function Reveal({
  children,
  delay = 0,
  direction = "up",
  variant = "fade-up",
  className,
}: RevealProps) {
  const offset = directionOffset[direction];

  const variants = {
    "fade-up": {
      initial: { opacity: 0, x: offset.x, y: offset.y },
      animate: { opacity: 1, x: 0, y: 0 },
    },
    blur: {
      initial: { opacity: 0, filter: "blur(10px)" },
      animate: { opacity: 1, filter: "blur(0px)" },
    },
    slide: {
      initial: { opacity: 0, x: offset.x, y: offset.y, scale: 0.97 },
      animate: { opacity: 1, x: 0, y: 0, scale: 1 },
    },
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    },
  };

  const { initial, animate } = variants[variant];

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
