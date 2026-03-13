import type { Metadata } from "next";
import ContactClient from "./ContactClient";
import PageTransition from "@/components/ui/PageTransition";

export const metadata: Metadata = {
  title: "Book a Call — Aygency",
  description:
    "Book a free 30-minute call with Aygency. We'll look at your operation and show you where agent systems would make the biggest impact.",
  openGraph: {
    title: "Book a Call — Aygency",
    description:
      "Book a free 30-minute call with Aygency. We'll look at your operation and show you where agent systems would make the biggest impact.",
    url: "https://aygency.ai/contact",
  },
  twitter: {
    card: "summary_large_image",
    title: "Book a Call — Aygency",
    description:
      "Book a free 30-minute call with Aygency. We'll look at your operation and show you where agent systems would make the biggest impact.",
  },
};

export default function ContactPage() {
  return (
    <PageTransition>
      <ContactClient />
    </PageTransition>
  );
}
