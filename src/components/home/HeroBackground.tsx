"use client";

import { motion, useReducedMotion } from "framer-motion";

// Five organic closed contour paths — two shape states each (A → B)
// Positioned right-biased to overlap with heading area
const contours = [
  {
    a: "M620,180 C680,140 780,160 820,220 C860,280 840,380 780,420 C720,460 640,440 600,380 C560,320 560,220 620,180Z",
    b: "M640,170 C700,130 790,170 830,230 C870,290 830,390 770,430 C710,470 620,450 580,390 C540,330 580,210 640,170Z",
    strokeWidth: 1.5,
    opacity: 0.05,
    duration: 28,
  },
  {
    a: "M580,120 C660,70 800,100 860,180 C920,260 900,400 820,470 C740,540 620,520 560,440 C500,360 500,170 580,120Z",
    b: "M600,110 C680,60 810,110 870,190 C930,270 890,410 810,480 C730,550 600,530 540,450 C480,370 520,160 600,110Z",
    strokeWidth: 1,
    opacity: 0.045,
    duration: 32,
  },
  {
    a: "M660,240 C700,210 760,220 790,260 C820,300 810,360 770,390 C730,420 670,410 640,370 C610,330 620,270 660,240Z",
    b: "M670,230 C710,200 770,230 800,270 C830,310 800,370 760,400 C720,430 660,420 630,380 C600,340 630,260 670,230Z",
    strokeWidth: 0.75,
    opacity: 0.06,
    duration: 25,
  },
  {
    a: "M540,80 C640,20 820,50 900,150 C980,250 950,440 850,530 C750,620 590,590 510,490 C430,390 440,140 540,80Z",
    b: "M560,70 C660,10 830,60 910,160 C990,260 940,450 840,540 C740,630 570,600 490,500 C410,400 460,130 560,70Z",
    strokeWidth: 0.5,
    opacity: 0.04,
    duration: 35,
  },
  {
    a: "M700,300 C730,280 770,290 790,320 C810,350 800,390 770,410 C740,430 700,420 680,390 C660,360 670,320 700,300Z",
    b: "M710,290 C740,270 780,285 800,315 C820,345 805,395 775,415 C745,435 695,425 675,395 C655,365 680,310 710,290Z",
    strokeWidth: 1.25,
    opacity: 0.055,
    duration: 30,
  },
];

export default function HeroBackground() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <svg
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMaxYMid slice"
        className="absolute inset-0 h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {contours.map((c, i) => (
          <motion.path
            key={i}
            d={c.a}
            stroke="#1B3A2D"
            strokeWidth={c.strokeWidth}
            strokeOpacity={c.opacity}
            fill="none"
            animate={
              shouldReduceMotion
                ? undefined
                : { d: [c.a, c.b, c.a] }
            }
            transition={
              shouldReduceMotion
                ? undefined
                : {
                    duration: c.duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
          />
        ))}
      </svg>
    </div>
  );
}
