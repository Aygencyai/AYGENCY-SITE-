import type { Metadata } from "next";
import InsightsClient from "./InsightsClient";
import { OG_IMAGE } from "@/lib/site";

const description =
  "Plain answers on AI agents for business: what they take on, how they fit how you work, staying in control, and how they help a business scale.";

export const metadata: Metadata = {
  title: "Insights | Aygency",
  description,
  alternates: { canonical: "/insights" },
  openGraph: {
    images: [OG_IMAGE],
    title: "Insights | Aygency",
    description,
    url: "/insights",
  },
  twitter: {
    images: [OG_IMAGE.url],
    card: "summary_large_image",
    title: "Insights | Aygency",
    description,
  },
};

export default function InsightsPage() {
  return <InsightsClient />;
}
