import type { Metadata } from "next";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "Services — Aygency",
  description:
    "Custom AI agent systems for marketing, operations, and business automation. Designed around your workflows, deployed in weeks.",
  openGraph: {
    title: "Services — Aygency",
    description:
      "Custom AI agent systems for marketing, operations, and business automation. Designed around your workflows, deployed in weeks.",
    url: "https://aygency.ai/services",
  },
  twitter: {
    card: "summary_large_image",
    title: "Services — Aygency",
    description:
      "Custom AI agent systems for marketing, operations, and business automation. Designed around your workflows, deployed in weeks.",
  },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
