import type { Metadata } from "next";
import AboutClient from "./AboutClient";

const description =
  "Aygency builds AI agents that remove the bottlenecks holding businesses back. Founded by Louis Rosenberg and Erik in Borehamwood. We learn how you work, build around it, and keep improving it.";

export const metadata: Metadata = {
  title: "About | Aygency",
  description,
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About | Aygency",
    description,
    url: "/about",
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
