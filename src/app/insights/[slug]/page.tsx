import BreadcrumbJsonLd from "@/components/ui/BreadcrumbJsonLd";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AUTHOR, insightPosts } from "@/lib/insights";
import InsightPostClient from "./InsightPostClient";
import PageTransition from "@/components/ui/PageTransition";
import { SITE_URL, OG_IMAGE } from "@/lib/site";

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
  const description = post.metaDescription ?? post.excerpt;
  return {
    title: `${post.title} | Aygency`,
    description,
    alternates: { canonical: `/insights/${slug}` },
    openGraph: {
      images: [OG_IMAGE],
      title: `${post.title} | Aygency`,
      description,
      url: `/insights/${slug}`,
    },
    twitter: {
      images: [OG_IMAGE.url],
      card: "summary_large_image" as const,
      title: `${post.title} | Aygency`,
      description,
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
    dateModified: new Date(`${post.updated ?? post.date} UTC`).toISOString(),
    url: `${SITE_URL}/insights/${slug}`,
    author: {
      "@type": "Person",
      ...AUTHOR,
      worksFor: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: "AYGENCY LTD" },
    },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: "Aygency", url: SITE_URL },
  };

  return (
    <PageTransition>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <BreadcrumbJsonLd trail={[["Insights", "/insights"], [post.title, `/insights/${slug}`]]} />
      <InsightPostClient post={post} />
    </PageTransition>
  );
}
