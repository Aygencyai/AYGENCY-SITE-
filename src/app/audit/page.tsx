import type { Metadata } from "next";
import { randomUUID } from "node:crypto";
import PageTransition from "@/components/ui/PageTransition";
import { lookupInvite } from "@/lib/growth-audit/ingest";
import AuditClient from "./AuditClient";

export const dynamic = "force-dynamic";

// Unlisted until we choose to run it as a public funnel.
export const metadata: Metadata = {
  title: "AI Growth Audit | Aygency",
  description: "A three-minute audit of where AI can help your business grow and what it can take off your team.",
  robots: { index: false, follow: false },
};

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

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const code = typeof params.c === "string" ? params.c : null;
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
