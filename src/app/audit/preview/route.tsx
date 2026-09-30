import { ImageResponse } from "next/og";
import { lookupInvite } from "@/lib/growth-audit/ingest";
import { OG_SIZE, brandFonts } from "@/lib/og/brand";
import { AuditCard } from "@/lib/og/cards";

/** Link-preview image for /audit links: /audit/preview?c=<invite code>. */
export async function GET(request: Request) {
  const code = new URL(request.url).searchParams.get("c");
  const invite = code ? await lookupInvite(code) : null;
  return new ImageResponse(<AuditCard company={invite?.company ?? null} />, {
    ...OG_SIZE,
    fonts: await brandFonts(),
    headers: { "cache-control": "public, max-age=3600, s-maxage=86400" },
  });
}
