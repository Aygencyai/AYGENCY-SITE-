import { SITE_URL } from "@/lib/site";

// BreadcrumbList structured data. Pass the trail after Home as [name, path] pairs.
export default function BreadcrumbJsonLd({ trail }: { trail: [string, string][] }) {
  const items = [["Home", ""], ...trail].map(([name, path], i) => ({
    "@type": "ListItem",
    position: i + 1,
    name,
    item: `${SITE_URL}${path}`,
  }));
  const jsonLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}
