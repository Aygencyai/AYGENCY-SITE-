"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

interface TextScrambleProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
  cycles?: number;
}

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

export default function TextScramble({
  text,
  className,
  delay = 0,
  speed = 25,
  cycles = 2,
}: TextScrambleProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReduced = useReducedMotion();
  const [displayText, setDisplayText] = useState(text);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    if (prefersReduced) {
      setDisplayText(text);
      hasAnimated.current = true;
      return;
    }

    hasAnimated.current = true;
    let frame: number;
    const totalChars = text.length;
    let currentIndex = 0;
    let cycleCount = 0;

    const delayTimeout = setTimeout(() => {
      const animate = () => {
        cycleCount++;

        if (cycleCount >= cycles) {
          currentIndex++;
          cycleCount = 0;
        }

        if (currentIndex > totalChars) {
          setDisplayText(text);
          return;
        }

        const settled = text.slice(0, currentIndex);
        const scrambled = text
          .slice(currentIndex)
          .split("")
          .map((ch) => (ch === " " ? " " : chars[Math.floor(Math.random() * chars.length)]))
          .join("");

        setDisplayText(settled + scrambled);
        frame = window.setTimeout(animate, speed);
      };

      animate();
    }, delay);

    return () => {
      clearTimeout(delayTimeout);
      clearTimeout(frame);
    };
  }, [isInView, text, delay, speed, cycles, prefersReduced]);

  return (
    <span ref={ref} className={className}>
      {displayText}
    </span>
  );
}
