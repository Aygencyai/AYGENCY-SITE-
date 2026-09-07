import type { Metadata } from "next";
import { EdenConnection } from "./EdenConnection";

export const metadata: Metadata = {
  title: "Connect your Eden | Aygency",
  description: "Start your private conversation with the Aygency Builder.",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function EdenConnectionPage() {
  return <EdenConnection />;
}
