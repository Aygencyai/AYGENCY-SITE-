"use client";

import { useRef, useState } from "react";
import { Play } from "lucide-react";

// The walkthrough film. preload="none" keeps it from slowing the page: nothing but the poster
// loads until someone presses play. aspect-video holds the 16:9 space so the layout never jumps.
export default function HeroFilm() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-ghost/15 bg-void-light">
      <video
        ref={videoRef}
        controls={started}
        preload="none"
        playsInline
        poster="/videos/aygency-walkthrough-poster.jpg"
        aria-label="Aygency walkthrough film, 1 minute 54 seconds"
        className="absolute inset-0 h-full w-full"
        onPlay={() => setStarted(true)}
      >
        <source src="/videos/aygency-walkthrough.webm" type="video/webm" />
        <source src="/videos/aygency-walkthrough.mp4" type="video/mp4" />
      </video>
      {!started && (
        <button
          type="button"
          aria-label="Play the film, what we do, 1 minute 54 seconds"
          onClick={() => videoRef.current?.play()}
          className="group absolute inset-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan"
        >
          {/* Bottom-right, because the words on the poster fill the left of the frame. */}
          <span className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 flex items-center gap-2.5 rounded-full border border-ghost/20 bg-void/85 py-1 pl-1 pr-3.5 transition-colors duration-200 group-hover:border-cyan/60">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan text-void">
              <Play className="ml-0.5 h-3.5 w-3.5" fill="currentColor" strokeWidth={0} />
            </span>
            <span className="font-sans text-[13px] font-medium text-ghost">What we do</span>
            <span className="font-mono text-xs text-ghost-muted">1:54</span>
          </span>
        </button>
      )}
    </div>
  );
}
