import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { useCases } from "@/lib/data";
import UseCaseDetailClient from "./UseCaseDetailClient";
import PageTransition from "@/components/ui/PageTransition";

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
  return {
    title: `${useCase.title} — Aygency`,
    description: useCase.subtext,
    openGraph: {
      title: `${useCase.title} — Aygency`,
      description: useCase.subtext,
      url: `https://aygency.ai/use-cases/${slug}`,
    },
    twitter: {
      card: "summary_large_image" as const,
      title: `${useCase.title} — Aygency`,
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
      <UseCaseDetailClient useCase={useCase} nextUseCase={nextUseCase} />
    </PageTransition>
  );
}
