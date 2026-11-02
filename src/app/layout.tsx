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
  title: "Aygency | AI Agents That Clear the Way for Your Business to Scale",
  description:
    "We build AI agents that take on the back office and fill the pipeline, slot into how you already work, and keep improving, so your business can scale further.",
  openGraph: {
    title: "Aygency | AI Agents That Clear the Way for Your Business to Scale",
    description:
      "We build AI agents that take on the back office and fill the pipeline, slot into how you already work, and keep improving, so your business can scale further.",
    type: "website",
    url: "/",
    siteName: "Aygency",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aygency | AI Agents That Clear the Way for Your Business to Scale",
    description:
      "We build AI agents that take on the back office and fill the pipeline, slot into how you already work, and keep improving, so your business can scale further.",
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
        addressLocality: "Borehamwood",
        addressCountry: "GB",
      },
      founder: { "@type": "Person", name: "Louis Rosenberg" },
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
      sameAs: ["https://find-and-update.company-information.service.gov.uk/company/17139454"],
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
