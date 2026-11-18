import type { Metadata } from "next";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "AI Agent Services | Aygency",
  description:
    "AI agent systems that clear the back office first, then fill the pipeline. Back office, lead generation, business intelligence and full departments.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "AI Agent Services | Aygency",
    description:
      "AI agent systems that clear the back office first, then fill the pipeline. Back office, lead generation, business intelligence and full departments.",
    url: "/services",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Agent Services | Aygency",
    description:
      "AI agent systems that clear the back office first, then fill the pipeline. Back office, lead generation, business intelligence and full departments.",
  },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
