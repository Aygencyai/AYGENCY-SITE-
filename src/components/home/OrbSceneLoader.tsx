"use client";

import dynamic from "next/dynamic";

const OrbScene = dynamic(() => import("./OrbScene"), {
  ssr: false,
  loading: () => (
    <section className="relative bg-void overflow-hidden">
      <div className="relative h-[60vh] min-h-[400px] md:h-[70vh] flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-cyan/40 animate-pulse" />
      </div>
    </section>
  ),
});

export default function OrbSceneLoader() {
  return <OrbScene />;
}
