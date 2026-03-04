import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact — Aygency",
  description:
    "Book a free 30-minute discovery call with Aygency. We'll diagnose your highest-impact AI opportunity.",
};

export default function ContactPage() {
  return <ContactClient />;
}
