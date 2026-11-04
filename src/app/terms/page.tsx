import type { Metadata } from "next";
import LegalPending from "@/components/ui/LegalPending";

export const metadata: Metadata = {
  title: "Terms | Aygency",
  alternates: { canonical: "/terms" },
  robots: { index: false },
};

export default function TermsPage() {
  return <LegalPending title="Terms" />;
}
