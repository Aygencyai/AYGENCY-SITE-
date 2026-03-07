"use client";

import dynamic from "next/dynamic";

const OrbScene = dynamic(() => import("./OrbScene"), {
  ssr: false,
  loading: () => (
    <section className="relative bg-gradient-to-b from-ivory via-green to-near-black overflow-hidden">
      <div className="relative h-[60vh] min-h-[400px] md:h-[70vh]" />
      <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 max-w-sm z-10">
        <p className="font-sans text-sm leading-relaxed text-white">
          Helping forward-looking companies thrive with custom AI agent systems
          and automated workflows.
        </p>
      </div>
    </section>
  ),
});

export default function OrbSceneLoader() {
  return <OrbScene />;
}
