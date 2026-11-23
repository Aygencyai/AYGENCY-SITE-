"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

interface TypewriterTextProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
  cursorColor?: string;
}

export default function TypewriterText({
  text,
  className,
  delay = 0,
  speed = 35,
  cursorColor = "text-cyan",
}: TypewriterTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px 0px" });
  const prefersReduced = useReducedMotion();
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [isDone, setIsDone] = useState(false);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    if (prefersReduced) {
      setDisplayText(text);
      setIsDone(true);
      hasAnimated.current = true;
      return;
    }

    hasAnimated.current = true;
    let index = 0;

    const delayTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        index++;
        setDisplayText(text.slice(0, index));
        if (index >= text.length) {
          clearInterval(interval);
          setIsDone(true);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(delayTimeout);
  }, [isInView, text, delay, speed, prefersReduced]);

  useEffect(() => {
    if (!isDone) return;
    const blinkInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(blinkInterval);
  }, [isDone]);

  return (
    <span ref={ref} className={`grid ${className ?? ""}`}>
      {/* Full text for search engines, AI crawlers and screen readers. It is
          laid out (but transparent) so the heading keeps its final height while
          typing, which stops the content below from shifting (CLS). */}
      <span className="col-start-1 row-start-1 text-transparent">
        {text}
        <span aria-hidden="true">|</span>
      </span>
      <span aria-hidden="true" className="col-start-1 row-start-1">
        {displayText}
        {/* Re-keyed per character: a newly inserted cursor is not counted as a layout shift. */}
        <span key={displayText.length} className={`${cursorColor} ${showCursor ? "opacity-100" : "opacity-0"} transition-opacity duration-100`}>
          |
        </span>
      </span>
    </span>
  );
}
