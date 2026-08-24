import type { Metadata } from "next";
import PageTransition from "@/components/ui/PageTransition";
import DesignYourEdenClient from "./DesignYourEdenClient";

export const metadata: Metadata = {
  title: "Design Your Eden — Aygency",
  description:
    "Shape the first AI agent system worth building for your operation. Complete the focused Design Your Eden questionnaire and receive your Eden Blueprint.",
  openGraph: {
    title: "Design Your Eden — Aygency",
    description:
      "Shape the first AI agent system worth building for your operation and receive your Eden Blueprint.",
    url: "https://aygency.ai/design-your-eden",
  },
  twitter: {
    card: "summary_large_image",
    title: "Design Your Eden — Aygency",
    description:
      "Shape the first AI agent system worth building for your operation and receive your Eden Blueprint.",
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
  return (
    <PageTransition>
      <DesignYourEdenClient discoveryUrl={discoveryUrl()} />
    </PageTransition>
  );
}
