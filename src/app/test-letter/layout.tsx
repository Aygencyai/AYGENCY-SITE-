import type { Metadata } from "next";

// Internal sandbox page: keep it out of search.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function TestLetterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
