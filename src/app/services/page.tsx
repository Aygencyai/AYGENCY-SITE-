import type { Metadata } from "next";
import ServicesClient from "./ServicesClient";
import { OG_IMAGE } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI Agent Services for UK Businesses | Aygency",
  description:
    "AI agents for back-office operations, lead generation, customer support, content and more. Start with a command centre, then build out from there.",
  alternates: { canonical: "/services" },
  openGraph: {
    images: [OG_IMAGE],
    title: "AI Agent Services for UK Businesses | Aygency",
    description:
      "AI agents for back-office operations, lead generation, customer support, content and more. Start with a command centre, then build out from there.",
    url: "/services",
  },
  twitter: {
    images: [OG_IMAGE.url],
    card: "summary_large_image",
    title: "AI Agent Services for UK Businesses | Aygency",
    description:
      "AI agents for back-office operations, lead generation, customer support, content and more. Start with a command centre, then build out from there.",
  },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
