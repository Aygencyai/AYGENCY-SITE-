import type { Metadata } from "next";
import TrustClient from "./TrustClient";

const description =
  "How Aygency keeps AI agents safe: GDPR-aligned data handling with a DPA available, your approval on high-impact actions, and every system monitored and reversible.";

export const metadata: Metadata = {
  title: "Trust & Security | Aygency",
  description,
  alternates: { canonical: "/trust" },
  openGraph: {
    title: "Trust & Security | Aygency",
    description,
    url: "/trust",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trust & Security | Aygency",
    description,
  },
};

export default function TrustPage() {
  return <TrustClient />;
}
