"use client";

/**
 * Renders the A or Y letter as a grid of rounded blocks — SVG version
 * of the 3D animation style. Use for logos, icons, favicons, etc.
 */

const BLOCK = 14;
const GAP = 3;
const STEP = BLOCK + GAP;
const RX = 2.5;

// 5 cols (0–4) × 6 rows (1–6)
const GRID_W = 5 * BLOCK + 4 * GAP; // 82
const GRID_H = 6 * BLOCK + 5 * GAP; // 99
const VIEWBOX = 100;
const X_OFF = (VIEWBOX - GRID_W) / 2; // 9
const Y_OFF = (VIEWBOX - GRID_H) / 2; // 0.5

// Grid positions — matches letter-grids.ts (rows 1–6)
const LETTER_A: Array<[number, number]> = [
  [2, 6],
  [1, 5], [3, 5],
  [0, 4], [4, 4],
  [0, 3], [1, 3], [2, 3], [3, 3], [4, 3],
  [0, 2], [4, 2],
  [0, 1], [4, 1],
];

const LETTER_Y: Array<[number, number]> = [
  [0, 6], [4, 6],
  [1, 5], [3, 5],
  [2, 4],
  [2, 3],
  [2, 2],
  [2, 1],
];

function toSvgCoords(col: number, row: number): { x: number; y: number } {
  return {
    x: X_OFF + col * STEP,
    y: Y_OFF + (6 - row) * STEP,
  };
}

interface BlockLetterProps {
  letter: "A" | "Y";
  color?: string;
  className?: string;
}

export default function BlockLetter({
  letter,
  color = "#1B3A2D",
  className,
}: BlockLetterProps) {
  const blocks = letter === "A" ? LETTER_A : LETTER_Y;

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={`Aygency ${letter} logo`}
      role="img"
    >
      {blocks.map(([col, row]) => {
        const { x, y } = toSvgCoords(col, row);
        return (
          <rect
            key={`${col}-${row}`}
            x={x}
            y={y}
            width={BLOCK}
            height={BLOCK}
            rx={RX}
            ry={RX}
            fill={color}
          />
        );
      })}
    </svg>
  );
}
