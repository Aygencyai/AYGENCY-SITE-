"use client";

import dynamic from "next/dynamic";

const LetterScene = dynamic(() => import("./LetterScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[350px] flex items-center justify-center">
      <div className="w-3 h-3 rounded-full bg-cyan/40 animate-pulse" />
    </div>
  ),
});

export default function LetterSceneLoader() {
  return <LetterScene />;
}
