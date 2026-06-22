import type { Metadata } from "next";
import InsightsClient from "./InsightsClient";

const description =
  "Notes on building, operating, and getting value out of AI agent systems, from the team that runs them.";

export const metadata: Metadata = {
  title: "Insights | Aygency",
  description,
  openGraph: {
    title: "Insights | Aygency",
    description,
    url: "https://aygency.ai/insights",
  },
  twitter: {
    card: "summary_large_image",
    title: "Insights | Aygency",
    description,
  },
};

export default function InsightsPage() {
  return <InsightsClient />;
}
