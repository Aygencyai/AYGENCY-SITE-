import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans, JetBrains_Mono } from "next/font/google";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import MotionProvider from "@/components/ui/MotionProvider";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
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
  metadataBase: new URL(SITE_URL),
  title: "Aygency | Built Once, Compound Forever | AI Agent Systems for UK Businesses",
  description:
    "AI agent systems for UK businesses. Autonomous agents that work like your best employee, slot into how you already work and get better every month. Built once, compound forever.",
  openGraph: {
    title: "Aygency | Built Once, Compound Forever | AI Agent Systems for UK Businesses",
    description:
      "AI agent systems for UK businesses. Autonomous agents that work like your best employee, slot into how you already work and get better every month. Built once, compound forever.",
    type: "website",
    url: "/",
    siteName: "Aygency",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aygency | Built Once, Compound Forever | AI Agent Systems for UK Businesses",
    description:
      "AI agent systems for UK businesses. Autonomous agents that work like your best employee, slot into how you already work and get better every month. Built once, compound forever.",
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Aygency",
      legalName: "AYGENCY LTD",
      url: SITE_URL,
      logo: `${SITE_URL}/icon.png`,
      email: "build@aygency.ai",
      description:
        "Aygency designs, builds and operates AI agents that remove the bottlenecks stopping businesses from scaling, starting with the back office and then lead generation.",
      address: {
        "@type": "PostalAddress",
        streetAddress: "1st Floor, Spitalfields House, Stirling Way",
        addressLocality: "Borehamwood",
        addressRegion: "Herts",
        postalCode: "WD6 2FX",
        addressCountry: "GB",
      },
      founder: { "@type": "Person", name: "Louis Rosenberg" },
      foundingDate: "2026-04-07",
      identifier: {
        "@type": "PropertyValue",
        name: "Companies House number",
        value: "17139454",
        url: "https://find-and-update.company-information.service.gov.uk/company/17139454",
      },
      areaServed: { "@type": "Country", name: "GB" },
      knowsAbout: [
        "AI agents",
        "AI agent systems",
        "AI automation",
        "Business process automation",
        "Revenue operations",
        "Lead generation",
        "Customer support automation",
        "Business intelligence",
      ],
      // Companies House listing for AYGENCY LTD (17139454, Borehamwood).
      sameAs: [
        "https://find-and-update.company-information.service.gov.uk/company/17139454",
        "https://x.com/Aygencyai",
        "https://www.instagram.com/aygencyai/",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "Aygency",
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans antialiased bg-void text-ghost-muted">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
