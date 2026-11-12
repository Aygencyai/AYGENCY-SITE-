import type { Metadata } from "next";
import UseCasesClient from "./UseCasesClient";
import { OG_IMAGE } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI Agent Use Cases | Aygency",
  description:
    "AI agent blueprints by sector: the bottlenecks holding each business back and the agents we would build to clear them.",
  alternates: { canonical: "/use-cases" },
  openGraph: {
    images: [OG_IMAGE],
    title: "AI Agent Use Cases | Aygency",
    description:
      "AI agent blueprints by sector: the bottlenecks holding each business back and the agents we would build to clear them.",
    url: "/use-cases",
  },
  twitter: {
    images: [OG_IMAGE.url],
    card: "summary_large_image",
    title: "AI Agent Use Cases | Aygency",
    description:
      "AI agent blueprints by sector: the bottlenecks holding each business back and the agents we would build to clear them.",
  },
};

export default function UseCasesPage() {
  return <UseCasesClient />;
}
