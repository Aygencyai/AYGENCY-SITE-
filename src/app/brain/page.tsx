import type { Metadata } from "next";
import BrainClient from "./BrainClient";

const description =
  "Every system we build comes with a Brain: a private, always-current knowledge layer that holds how your business runs, searchable in plain language, and yours to keep forever.";

export const metadata: Metadata = {
  title: "The Brain | Aygency",
  description,
  openGraph: {
    title: "The Brain | Aygency",
    description,
    url: "https://aygency.ai/brain",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Brain | Aygency",
    description,
  },
};

export default function BrainPage() {
  return <BrainClient />;
}
