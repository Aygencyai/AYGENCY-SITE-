import type { Metadata } from "next";
import ServicesClient from "./ServicesClient";
import { OG_IMAGE } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI Agent Agency for UK Small Businesses | Aygency",
  description:
    "A UK AI agent agency for small businesses. We design, build and operate custom agents for back-office operations, lead generation, customer support and more.",
  alternates: { canonical: "/services" },
  openGraph: {
    images: [OG_IMAGE],
    title: "AI Agent Agency for UK Small Businesses | Aygency",
    description:
      "A UK AI agent agency for small businesses. We design, build and operate custom agents for back-office operations, lead generation, customer support and more.",
    url: "/services",
  },
  twitter: {
    images: [OG_IMAGE.url],
    card: "summary_large_image",
    title: "AI Agent Agency for UK Small Businesses | Aygency",
    description:
      "A UK AI agent agency for small businesses. We design, build and operate custom agents for back-office operations, lead generation, customer support and more.",
  },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
