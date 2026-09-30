import { ImageResponse } from "next/og";
import { OG_SIZE, brandFonts } from "@/lib/og/brand";
import { SiteCard } from "@/lib/og/cards";

export const alt = "Aygency: AI agent systems. Built once, compounding forever.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(<SiteCard />, { ...OG_SIZE, fonts: await brandFonts() });
}
