import type { Metadata } from "next";
import UseCasesClient from "./UseCasesClient";

export const metadata: Metadata = {
  title: "Use Cases | Aygency",
  description:
    "System blueprints by sector. How we'd architect an agent system for an operation like yours.",
  openGraph: {
    title: "Use Cases | Aygency",
    description:
      "System blueprints by sector. How we'd architect an agent system for an operation like yours.",
    url: "https://aygency.ai/use-cases",
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
