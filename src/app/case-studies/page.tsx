import type { Metadata } from "next";
import CaseStudiesClient from "./CaseStudiesClient";

export const metadata: Metadata = {
  title: "Case Studies — Aygency",
  description:
    "See how we've built and deployed agent systems for hospitality, real estate, and marketing — with measurable results.",
  openGraph: {
    title: "Case Studies — Aygency",
    description:
      "See how we've built and deployed agent systems for hospitality, real estate, and marketing — with measurable results.",
    url: "https://aygency.ai/case-studies",
  },
  twitter: {
    card: "summary_large_image",
    title: "Case Studies — Aygency",
    description:
      "See how we've built and deployed agent systems for hospitality, real estate, and marketing — with measurable results.",
  },
};

export default function CaseStudiesPage() {
  return <CaseStudiesClient />;
}
