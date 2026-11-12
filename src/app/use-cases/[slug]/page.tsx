import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { useCases } from "@/lib/data";
import UseCaseDetailClient from "./UseCaseDetailClient";
import PageTransition from "@/components/ui/PageTransition";
import BreadcrumbJsonLd from "@/components/ui/BreadcrumbJsonLd";

export function generateStaticParams() {
  return useCases.map((uc) => ({ slug: uc.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const useCase = useCases.find((uc) => uc.slug === slug);
  if (!useCase) return {};
  const title = useCase.seoTitle ?? `${useCase.title} | Aygency`;
  return {
    title,
    description: useCase.subtext,
    alternates: { canonical: `/use-cases/${slug}` },
    openGraph: {
      title,
      description: useCase.subtext,
      url: `/use-cases/${slug}`,
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description: useCase.subtext,
    },
  };
}

export default async function UseCaseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const useCaseIndex = useCases.findIndex((uc) => uc.slug === slug);
  if (useCaseIndex === -1) notFound();

  const useCase = useCases[useCaseIndex];
  const nextUseCase = useCases[(useCaseIndex + 1) % useCases.length];

  return (
    <PageTransition>
      <BreadcrumbJsonLd trail={[["Use cases", "/use-cases"], [useCase.title, `/use-cases/${useCase.slug}`]]} />
      <UseCaseDetailClient useCase={useCase} nextUseCase={nextUseCase} />
    </PageTransition>
  );
}
