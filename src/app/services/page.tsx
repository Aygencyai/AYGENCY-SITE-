import type { Metadata } from "next";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "AI Agent Services for UK Businesses | Aygency",
  description:
    "AI agents for back-office operations, lead generation, customer support, content and more. Start with a command centre, then build out from there.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "AI Agent Services for UK Businesses | Aygency",
    description:
      "AI agents for back-office operations, lead generation, customer support, content and more. Start with a command centre, then build out from there.",
    url: "/services",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Agent Services for UK Businesses | Aygency",
    description:
      "AI agents for back-office operations, lead generation, customer support, content and more. Start with a command centre, then build out from there.",
  },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
