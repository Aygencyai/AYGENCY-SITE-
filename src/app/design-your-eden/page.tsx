import type { Metadata } from "next";
import { randomUUID } from "node:crypto";
import PageTransition from "@/components/ui/PageTransition";
import DesignYourEdenClient from "./DesignYourEdenClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Eden: Your AI Personal Assistant | Aygency",
  description:
    "Meet Eden, your dedicated AI personal assistant. She handles recurring work, prepares decisions, and keeps your working life connected.",
  openGraph: {
    title: "Meet Eden: Your AI Personal Assistant | Aygency",
    description:
      "Meet the dedicated AI personal assistant that handles recurring work and adapts to how you operate.",
    url: "https://aygency.ai/design-your-eden",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meet Eden: Your AI Personal Assistant | Aygency",
    description:
      "Meet the dedicated AI personal assistant that handles recurring work and adapts to how you operate.",
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

export default function DesignYourEdenPage() {
  const localPreview = process.env.NODE_ENV !== "production";

  return (
    <PageTransition>
      <DesignYourEdenClient
        applicationId={randomUUID()}
        captureEventId={randomUUID()}
        discoveryUrl={discoveryUrl()}
        eventId={randomUUID()}
        localPreview={localPreview}
      />
    </PageTransition>
  );
}
