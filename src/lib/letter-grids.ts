/**
 * Block positions for "A" and "Y" letters on a 5-column × 6-row grid.
 * Each block maps between its A-position and Y-position.
 * Blocks unique to one letter scale in/out during transitions.
 *
 * Grid: col 0–4 (x), row 1–6 (y), depth 0–1 (z)
 */

export interface BlockDef {
  id: number;
  posA: [number, number, number];
  posY: [number, number, number];
  inA: boolean;
  inY: boolean;
}

const SPACING = 1.15; // gap between block centers

function gridToWorld(col: number, row: number, z: number): [number, number, number] {
  // Center the grid: cols 0-4 → x from -2 to +2, rows 1-6 → y from -2.5 to +2.5
  return [
    (col - 2) * SPACING,
    (row - 3.5) * SPACING,
    (z - 0.5) * SPACING,
  ];
}

// Park position for blocks not in the current letter (behind the letter, invisible)
function parkPos(col: number, row: number): [number, number, number] {
  return [
    (col - 2) * SPACING,
    (row - 3.5) * SPACING,
    -2.5,
  ];
}

/**
 * Letter A layout (5×6):
 *
 * Row 6:      [2]           peak
 * Row 5:    [1] [3]         upper diagonals
 * Row 4:  [0]     [4]       mid diagonals
 * Row 3:  [0][1][2][3][4]   crossbar
 * Row 2:  [0]     [4]       legs
 * Row 1:  [0]     [4]       base
 */
const letterA: Array<[number, number]> = [
  // peak
  [2, 6],
  // upper diagonals
  [1, 5], [3, 5],
  // mid diagonals
  [0, 4], [4, 4],
  // crossbar
  [0, 3], [1, 3], [2, 3], [3, 3], [4, 3],
  // legs
  [0, 2], [4, 2],
  [0, 1], [4, 1],
];

/**
 * Letter Y layout (5×6):
 *
 * Row 6:  [0]     [4]       upper arms
 * Row 5:    [1] [3]         inner arms
 * Row 4:      [2]           junction
 * Row 3:      [2]           stem
 * Row 2:      [2]           stem
 * Row 1:      [2]           base
 */
const letterY: Array<[number, number]> = [
  // upper arms
  [0, 6], [4, 6],
  // inner arms
  [1, 5], [3, 5],
  // junction + stem
  [2, 4],
  [2, 3],
  [2, 2],
  [2, 1],
];

// Build a set of string keys for quick lookup
function toKey(col: number, row: number): string {
  return `${col},${row}`;
}

function buildBlockDefs(): BlockDef[] {
  const aSet = new Set(letterA.map(([c, r]) => toKey(c, r)));
  const ySet = new Set(letterY.map(([c, r]) => toKey(c, r)));

  // Collect all unique grid positions
  const allPositions = new Map<string, [number, number]>();
  for (const [c, r] of letterA) allPositions.set(toKey(c, r), [c, r]);
  for (const [c, r] of letterY) allPositions.set(toKey(c, r), [c, r]);

  const blocks: BlockDef[] = [];
  let id = 0;

  allPositions.forEach(([col, row], key) => {
    const inA = aSet.has(key);
    const inY = ySet.has(key);

    // For each depth layer
    for (let z = 0; z <= 1; z++) {
      blocks.push({
        id: id++,
        posA: inA ? gridToWorld(col, row, z) : parkPos(col, row),
        posY: inY ? gridToWorld(col, row, z) : parkPos(col, row),
        inA,
        inY,
      });
    }
  });

  return blocks;
}

export const BLOCK_DEFS = buildBlockDefs();
export const BLOCK_SIZE = 0.9;
export const BLOCK_RADIUS = 0.08;
