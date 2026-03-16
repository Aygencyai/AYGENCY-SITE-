import type { Metadata } from "next";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "Our Services — Aygency",
  description:
    "Custom agent systems built around your problem. Cost reduction, revenue operations, intelligence, and full department systems.",
  openGraph: {
    title: "Our Services — Aygency",
    description:
      "Custom agent systems built around your problem. Cost reduction, revenue operations, intelligence, and full department systems.",
    url: "https://aygency.ai/services",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Services — Aygency",
    description:
      "Custom agent systems built around your problem. Cost reduction, revenue operations, intelligence, and full department systems.",
  },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
