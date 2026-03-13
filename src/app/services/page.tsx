import type { Metadata } from "next";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "What We Build — Aygency",
  description:
    "Custom AI agent systems for marketing, operations, and business automation. Designed around your workflows, deployed in weeks.",
  openGraph: {
    title: "What We Build — Aygency",
    description:
      "Custom AI agent systems for marketing, operations, and business automation. Designed around your workflows, deployed in weeks.",
    url: "https://aygency.ai/services",
  },
  twitter: {
    card: "summary_large_image",
    title: "What We Build — Aygency",
    description:
      "Custom AI agent systems for marketing, operations, and business automation. Designed around your workflows, deployed in weeks.",
  },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
