"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const LetterScene = dynamic(() => import("./LetterScene"), { ssr: false });

// Shows a static poster first. The 3D scene only loads on desktop, without
// reduced motion, once the hero is in view and the browser is idle.
export default function LetterSceneLoader() {
  const ref = useRef<HTMLDivElement>(null);
  const [load3d, setLoad3d] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    if (!desktop.matches || !ref.current) return;

    let timer: number | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = () => setLoad3d(true);
      timer = window.requestIdleCallback
        ? window.requestIdleCallback(start, { timeout: 2500 })
        : window.setTimeout(start, 1500);
    });
    observer.observe(ref.current);

    return () => {
      observer.disconnect();
      if (timer === undefined) return;
      if (window.cancelIdleCallback) window.cancelIdleCallback(timer);
      else window.clearTimeout(timer);
    };
  }, []);

  return (
    <div ref={ref} className="relative w-full h-full">
      <Image
        src="/hero-poster.webp"
        alt=""
        fill
        sizes="(min-width: 1024px) 45vw, 100vw"
        className={`object-contain transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}
      />
      {load3d && (
        <div className="absolute inset-0">
          <LetterScene onReady={() => setReady(true)} />
        </div>
      )}
    </div>
  );
}
