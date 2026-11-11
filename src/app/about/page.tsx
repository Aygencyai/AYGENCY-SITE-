import type { Metadata } from "next";
import AboutClient from "./AboutClient";
import { OG_IMAGE } from "@/lib/site";

const description =
  "Aygency builds AI agents that remove the bottlenecks holding businesses back. Founded by Louis Rosenberg and Erik in Borehamwood. We learn how you work, build around it, and keep improving it.";

export const metadata: Metadata = {
  title: "About | Aygency",
  description,
  alternates: { canonical: "/about" },
  openGraph: {
    images: [OG_IMAGE],
    title: "About | Aygency",
    description,
    url: "/about",
  },
  twitter: {
    images: [OG_IMAGE.url],
    card: "summary_large_image",
    title: "About | Aygency",
    description,
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
