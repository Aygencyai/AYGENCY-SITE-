import type { Metadata } from "next";
import SystemClient from "./SystemClient";

const description =
  "The Aygency System: a CEO Agent and specialist AI agents designed around how your business works, run from one command centre where you approve what matters.";

export const metadata: Metadata = {
  title: "The Aygency System | Aygency",
  description,
  alternates: { canonical: "/system" },
  openGraph: {
    title: "The Aygency System | Aygency",
    description,
    url: "/system",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Aygency System | Aygency",
    description,
  },
};

export default function SystemPage() {
  return <SystemClient />;
}
