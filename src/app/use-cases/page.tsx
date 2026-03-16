import type { Metadata } from "next";
import UseCasesClient from "./UseCasesClient";

export const metadata: Metadata = {
  title: "Use Cases — Aygency",
  description:
    "Examples of the agent systems we architect — showing how we approach real operational challenges across different sectors.",
  openGraph: {
    title: "Use Cases — Aygency",
    description:
      "Examples of the agent systems we architect — showing how we approach real operational challenges across different sectors.",
    url: "https://aygency.ai/use-cases",
  },
  twitter: {
    card: "summary_large_image",
    title: "Use Cases — Aygency",
    description:
      "Examples of the agent systems we architect — showing how we approach real operational challenges across different sectors.",
  },
};

export default function UseCasesPage() {
  return <UseCasesClient />;
}
