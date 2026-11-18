import type { Metadata } from "next";
import ContactClient from "./ContactClient";
import PageTransition from "@/components/ui/PageTransition";

export const metadata: Metadata = {
  title: "Contact | Aygency",
  description:
    "Talk to Aygency. Tell us what is slowing your business down and we will show you the AI agents that would clear the way to scale.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | Aygency",
    description:
      "Talk to Aygency. Tell us what is slowing your business down and we will show you the AI agents that would clear the way to scale.",
    url: "/contact",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | Aygency",
    description:
      "Talk to Aygency. Tell us what is slowing your business down and we will show you the AI agents that would clear the way to scale.",
  },
};

export default function ContactPage() {
  return (
    <PageTransition>
      <ContactClient />
    </PageTransition>
  );
}
