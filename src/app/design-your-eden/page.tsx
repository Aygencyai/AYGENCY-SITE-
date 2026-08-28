import type { Metadata } from "next";
import { randomUUID } from "node:crypto";
import PageTransition from "@/components/ui/PageTransition";
import DesignYourEdenClient from "./DesignYourEdenClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Eden: Your AI Personal Assistant | Aygency",
  description:
    "Meet Eden, your personal interface to Aygency's specialist-agent system. She coordinates work, prepares decisions, and keeps your operation connected.",
  openGraph: {
    title: "Meet Eden: Your AI Personal Assistant | Aygency",
    description:
      "Meet the AI personal assistant that coordinates the right specialist agents and adapts to how your operation runs.",
    url: "https://aygency.ai/design-your-eden",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meet Eden: Your AI Personal Assistant | Aygency",
    description:
      "Meet the AI personal assistant that coordinates the right specialist agents and adapts to how your operation runs.",
  },
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

function turnstileSiteKey() {
  const configured = process.env.EDEN_APPLICATION_TURNSTILE_SITE_KEY?.trim() ?? "";
  return /^[A-Za-z0-9_-]{3,128}$/.test(configured) ? configured : "";
}

export default function DesignYourEdenPage() {
  const siteKey = turnstileSiteKey();
  const localPreview = process.env.NODE_ENV !== "production" && !siteKey;

  return (
    <PageTransition>
      <DesignYourEdenClient
        applicationId={randomUUID()}
        captureEventId={randomUUID()}
        discoveryUrl={discoveryUrl()}
        eventId={randomUUID()}
        localPreview={localPreview}
        turnstileSiteKey={siteKey}
      />
    </PageTransition>
  );
}
