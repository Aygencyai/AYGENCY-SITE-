import type { Metadata } from "next";
import { Instrument_Sans, Inter } from "next/font/google";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aygency — AI Agents That Solve Real Business Problems",
  description:
    "Aygency designs, builds, and deploys custom AI agent systems for businesses. Operators, not consultants. Weeks, not months. ROI-obsessed.",
  openGraph: {
    title: "Aygency — AI Agents That Solve Real Business Problems",
    description:
      "Custom AI agent systems that deliver measurable business impact. Built and deployed in weeks, not months.",
    url: "https://aygency.ai",
    siteName: "Aygency",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aygency — AI Agents That Solve Real Business Problems",
    description:
      "Custom AI agent systems that deliver measurable business impact. Built and deployed in weeks, not months.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${instrumentSans.variable} ${inter.variable}`}>
      <body className="font-body">
        {/* <Nav /> */}
        {children}
        {/* <Footer /> */}
      </body>
    </html>
  );
}
