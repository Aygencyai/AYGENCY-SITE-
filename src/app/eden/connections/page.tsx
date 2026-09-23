import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EdenOutlookConnection } from "./EdenOutlookConnection";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Connect an account to Eden | Aygency",
  description: "Connect the services you use to your personal Eden.",
  robots: { index: false, follow: false }, referrer: "no-referrer",
};

export default function EdenOutlookConnectionPage() {
  if (process.env.EDEN_CUSTOMER_CONNECTIONS_ENABLED !== "true") notFound();
  return <EdenOutlookConnection />;
}
