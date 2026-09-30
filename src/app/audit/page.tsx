import type { Metadata } from "next";
import { randomUUID } from "node:crypto";
import { cache } from "react";
import PageTransition from "@/components/ui/PageTransition";
import { lookupInvite as lookupInviteUncached } from "@/lib/growth-audit/ingest";
import AuditClient from "./AuditClient";

export const dynamic = "force-dynamic";

// One invite lookup per request, shared by the metadata and the page.
const lookupInvite = cache(lookupInviteUncached);

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function inviteCode(params: Record<string, string | string[] | undefined>) {
  return typeof params.c === "string" ? params.c : null;
}

// Unlisted until we choose to run it as a public funnel. The link preview is
// personalised with the invited company (see ./preview/route.tsx).
export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const code = inviteCode(await searchParams);
  const invite = code ? await lookupInvite(code) : null;
  const title = invite ? `AI Growth Audit for ${invite.company} | Aygency` : "AI Growth Audit | Aygency";
  const description = "A few quick questions about where your team's time goes. About 5 minutes.";
  const image = {
    url: invite && code ? `/audit/preview?c=${encodeURIComponent(code)}` : "/audit/preview",
    width: 1200,
    height: 630,
    alt: title,
  };
  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: { title, description, type: "website", siteName: "Aygency", images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}

function discoveryUrl() {
  const configured = process.env.NEXT_PUBLIC_CAL_URL?.trim();
  if (!configured) return "/contact";
  try {
    const url = new URL(configured);
    return url.protocol === "https:" ? url.toString() : "/contact";
  } catch {
    return "/contact";
  }
}

export default async function AuditPage({ searchParams }: { searchParams: SearchParams }) {
  const code = inviteCode(await searchParams);
  const invite = code ? await lookupInvite(code) : null;

  return (
    <PageTransition>
      <AuditClient
        auditId={randomUUID()}
        inviteCode={invite ? code : null}
        invite={invite}
        discoveryUrl={discoveryUrl()}
      />
    </PageTransition>
  );
}
