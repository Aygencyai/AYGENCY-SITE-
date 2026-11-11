import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { services } from "@/lib/data";
import ServiceDetailClient from "./ServiceDetailClient";
import PageTransition from "@/components/ui/PageTransition";
import BreadcrumbJsonLd from "@/components/ui/BreadcrumbJsonLd";
import { SITE_URL, OG_IMAGE } from "@/lib/site";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return {};
  return {
    title: `${service.title} | Aygency`,
    description: service.longDescription,
    alternates: { canonical: `/services/${slug}` },
    openGraph: {
      images: [OG_IMAGE],
      title: `${service.title} | Aygency`,
      description: service.longDescription,
      url: `/services/${slug}`,
    },
    twitter: {
      images: [OG_IMAGE.url],
      card: "summary_large_image" as const,
      title: `${service.title} | Aygency`,
      description: service.longDescription,
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.longDescription,
    url: `${SITE_URL}/services/${service.slug}`,
    serviceType: "AI agent system",
    areaServed: { "@type": "Country", name: "GB" },
    provider: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: "Aygency", url: SITE_URL },
  };

  return (
    <PageTransition>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <BreadcrumbJsonLd trail={[["Services", "/services"], [service.title, `/services/${service.slug}`]]} />
      <ServiceDetailClient service={service} />
    </PageTransition>
  );
}
