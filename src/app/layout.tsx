import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans, JetBrains_Mono } from "next/font/google";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import MotionProvider from "@/components/ui/MotionProvider";
import "./globals.css";

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-serif",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aygency.ai"),
  title: "Aygency — AI Agent Systems That Run Your Business Operations",
  description:
    "We design, build, and deploy autonomous agent systems that run business operations — 24/7, learning and improving over time.",
  openGraph: {
    title: "Aygency — AI Agent Systems That Run Your Business Operations",
    description:
      "We design, build, and deploy autonomous agent systems that run business operations — 24/7, learning and improving over time.",
    type: "website",
    url: "https://aygency.ai",
    siteName: "Aygency",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aygency — AI Agent Systems That Run Your Business Operations",
    description:
      "We design, build, and deploy autonomous agent systems that run business operations — 24/7, learning and improving over time.",
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSerifDisplay.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "Aygency",
              url: "https://aygency.ai",
              description:
                "Aygency designs, builds, and deploys autonomous AI agent systems that run business operations.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "London",
                addressCountry: "GB",
              },
            }),
          }}
        />
        <a
          href="#main-content"
          className="skip-to-content"
        >
          Skip to content
        </a>
        <MotionProvider>
          <Nav />
          <main id="main-content">{children}</main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
