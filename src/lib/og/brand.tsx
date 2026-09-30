import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Shared pieces for link-preview images (the card WhatsApp, iMessage, Slack
 * and LinkedIn show when an aygency.ai link is pasted). Rendered with next/og,
 * which needs raw TTF font data, so the brand fonts live in src/assets/fonts.
 */

export const OG_SIZE = { width: 1200, height: 630 };

export const colours = {
  void: "#0A0A0F",
  voidLight: "#111118",
  surface: "#16161F",
  cyan: "#00E5FF",
  ghost: "#EAEAF0",
  ghostMuted: "#9B9BAE",
  ghostDim: "#5C5C72",
  white: "#F8F8FC",
};

const fontDir = join(process.cwd(), "src/assets/fonts");

export async function brandFonts() {
  const [grotesk500, grotesk700, dmSans] = await Promise.all([
    readFile(join(fontDir, "SpaceGrotesk-500.ttf")),
    readFile(join(fontDir, "SpaceGrotesk-700.ttf")),
    readFile(join(fontDir, "DMSans-400.ttf")),
  ]);
  return [
    { name: "Space Grotesk", data: grotesk500, weight: 500 as const, style: "normal" as const },
    { name: "Space Grotesk", data: grotesk700, weight: 700 as const, style: "normal" as const },
    { name: "DM Sans", data: dmSans, weight: 400 as const, style: "normal" as const },
  ];
}

/** The Aygency "A" mark, traced from public/aygency-logo.png. Width is 464/416 of height. */
export function Mark({ height, colour = colours.white }: { height: number; colour?: string }) {
  const width = (height * 464) / 416;
  return (
    <svg width={width} height={height} viewBox="0 0 464 416" fill={colour}>
      <path d="M0 416 L206 0 L322 0 L113 416 Z" />
      <path d="M276 263 L378 263 L464 416 L362 416 Z" />
    </svg>
  );
}
