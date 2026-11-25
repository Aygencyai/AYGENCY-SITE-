import type { Metadata } from "next";
import AboutClient from "./AboutClient";
import { OG_IMAGE, SITE_URL, AUTHOR } from "@/lib/site";

const description =
  "Aygency builds AI agents that remove the bottlenecks holding businesses back. Founded by Louis Rosenberg and Erik in Borehamwood. We learn how you work, build around it, and keep improving it.";

export const metadata: Metadata = {
  title: "About Aygency, the UK AI Agent Agency",
  description,
  alternates: { canonical: "/about" },
  openGraph: {
    images: [OG_IMAGE],
    title: "About Aygency, the UK AI Agent Agency",
    description,
    url: "/about",
  },
  twitter: {
    images: [OG_IMAGE.url],
    card: "summary_large_image",
    title: "About Aygency, the UK AI Agent Agency",
    description,
  },
};

// Author profile for the byline on every insight and answer page. Text matches the visible bio below.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": AUTHOR.id,
  name: AUTHOR.name,
  jobTitle: AUTHOR.jobTitle,
  url: AUTHOR.url,
  description:
    "Co-founder and CEO of Aygency. He leads strategy, client work and how each system is designed.",
  worksFor: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: "Aygency" },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <AboutClient />
    </>
  );
}
