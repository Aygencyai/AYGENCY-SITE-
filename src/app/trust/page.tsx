import type { Metadata } from "next";
import TrustClient from "./TrustClient";

const description =
  "How Aygency operates agent systems safely: your data stays in your environment, high-impact actions route to a human, and every system is monitored, tuned, and reversible.";

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
