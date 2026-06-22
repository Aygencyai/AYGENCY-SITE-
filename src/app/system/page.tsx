import type { Metadata } from "next";
import SystemClient from "./SystemClient";

const description =
  "The Aygency System: a CEO Agent and a core of specialist agents that run your operation. We prescribe the system, tailor it to your business, and operate it for you.";

export const metadata: Metadata = {
  title: "The Aygency System | Aygency",
  description,
  openGraph: {
    title: "The Aygency System | Aygency",
    description,
    url: "https://aygency.ai/system",
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
