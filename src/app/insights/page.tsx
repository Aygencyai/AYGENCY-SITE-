import type { Metadata } from "next";
import InsightsClient from "./InsightsClient";
import { OG_IMAGE } from "@/lib/site";

const description =
  "Plain answers on AI agents for business: what they take on, how they fit how you work, staying in control, and how they help a business scale.";

export const metadata: Metadata = {
  title: "Answers on AI Agents for UK Businesses | Aygency",
  description,
  alternates: { canonical: "/insights" },
  openGraph: {
    images: [OG_IMAGE],
    title: "Answers on AI Agents for UK Businesses | Aygency",
    description,
    url: "/insights",
  },
  twitter: {
    images: [OG_IMAGE.url],
    card: "summary_large_image",
    title: "Answers on AI Agents for UK Businesses | Aygency",
    description,
  },
};

export default function InsightsPage() {
  return <InsightsClient />;
}
