import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { services } from "@/lib/data";
import ServiceDetailClient from "./ServiceDetailClient";
import PageTransition from "@/components/ui/PageTransition";
import BreadcrumbJsonLd from "@/components/ui/BreadcrumbJsonLd";

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
      title: `${service.title} | Aygency`,
      description: service.longDescription,
      url: `/services/${slug}`,
    },
    twitter: {
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

  return (
    <PageTransition>
      <BreadcrumbJsonLd trail={[["Services", "/services"], [service.title, `/services/${service.slug}`]]} />
      <ServiceDetailClient service={service} />
    </PageTransition>
  );
}
