import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { insightPosts } from "@/lib/insights";
import InsightPostClient from "./InsightPostClient";
import PageTransition from "@/components/ui/PageTransition";
import { SITE_URL } from "@/lib/site";

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
    alternates: { canonical: `/insights/${slug}` },
    openGraph: {
      title: `${post.title} | Aygency`,
      description: post.excerpt,
      url: `/insights/${slug}`,
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

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: new Date(`${post.date} UTC`).toISOString(),
    url: `${SITE_URL}/insights/${slug}`,
    author: { "@type": "Organization", name: "Aygency", url: SITE_URL },
    publisher: { "@type": "Organization", name: "Aygency", url: SITE_URL },
  };

  return (
    <PageTransition>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <InsightPostClient post={post} />
    </PageTransition>
  );
}
