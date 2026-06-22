import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { insightPosts } from "@/lib/insights";
import InsightPostClient from "./InsightPostClient";
import PageTransition from "@/components/ui/PageTransition";

export function generateStaticParams() {
  return insightPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = insightPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: `${post.title} | Aygency`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | Aygency`,
      description: post.excerpt,
      url: `https://aygency.ai/insights/${slug}`,
    },
    twitter: {
      card: "summary_large_image" as const,
      title: `${post.title} | Aygency`,
      description: post.excerpt,
    },
  };
}

export default async function InsightPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = insightPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <PageTransition>
      <InsightPostClient post={post} />
    </PageTransition>
  );
}
