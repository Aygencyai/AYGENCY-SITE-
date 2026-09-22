import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EdenOutlookConnection } from "./EdenOutlookConnection";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Connect Outlook to Eden | Aygency",
  description: "Connect your email and calendar to your personal Eden.",
  robots: { index: false, follow: false }, referrer: "no-referrer",
};

export default function EdenOutlookConnectionPage() {
  if (process.env.EDEN_CUSTOMER_CONNECTIONS_ENABLED !== "true") notFound();
  return <EdenOutlookConnection />;
}
