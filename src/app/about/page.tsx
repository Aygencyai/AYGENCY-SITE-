import type { Metadata } from "next";
import AboutClient from "./AboutClient";

const description =
  "Aygency designs, builds, deploys, and operates AI agent systems that run business operations and compound in value the longer they run. We build it, then we run it.";

export const metadata: Metadata = {
  title: "About | Aygency",
  description,
  openGraph: {
    title: "About | Aygency",
    description,
    url: "https://aygency.ai/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Aygency",
    description,
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
