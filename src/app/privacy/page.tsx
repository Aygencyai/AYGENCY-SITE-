import type { Metadata } from "next";
import LegalPending from "@/components/ui/LegalPending";

export const metadata: Metadata = {
  title: "Privacy Policy | Aygency",
  alternates: { canonical: "/privacy" },
  robots: { index: false },
};

export default function PrivacyPage() {
  return <LegalPending title="Privacy Policy" />;
}
