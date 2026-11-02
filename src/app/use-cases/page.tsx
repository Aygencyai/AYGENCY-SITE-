import type { Metadata } from "next";
import UseCasesClient from "./UseCasesClient";

export const metadata: Metadata = {
  title: "Use Cases | Aygency",
  description:
    "System blueprints by sector. How we'd architect an agent system for an operation like yours.",
  alternates: { canonical: "/use-cases" },
  openGraph: {
    title: "Use Cases | Aygency",
    description:
      "System blueprints by sector. How we'd architect an agent system for an operation like yours.",
    url: "/use-cases",
  },
  twitter: {
    card: "summary_large_image",
    title: "Use Cases | Aygency",
    description:
      "System blueprints by sector. How we'd architect an agent system for an operation like yours.",
  },
};

export default function UseCasesPage() {
  return <UseCasesClient />;
}
