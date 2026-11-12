import type { Metadata } from "next";
import SystemClient from "./SystemClient";
import { OG_IMAGE } from "@/lib/site";

const description =
  "The Aygency System: a CEO Agent and specialist AI agents designed around how your business works, run from one command centre where you approve what matters.";

export const metadata: Metadata = {
  title: "The Aygency System | Aygency",
  description,
  alternates: { canonical: "/system" },
  openGraph: {
    images: [OG_IMAGE],
    title: "The Aygency System | Aygency",
    description,
    url: "/system",
  },
  twitter: {
    images: [OG_IMAGE.url],
    card: "summary_large_image",
    title: "The Aygency System | Aygency",
    description,
  },
};

export default function SystemPage() {
  return <SystemClient />;
}
