"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SectionContainer from "@/components/ui/SectionContainer";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import MagneticButton from "@/components/ui/MagneticButton";
import Faq from "@/components/ui/Faq";
import { AUTHOR, type InsightPost } from "@/lib/insights";

// Stable anchor ids for section headings, so the contents list can link to them.
function sectionIds(post: InsightPost): (string | undefined)[] {
  const seen = new Map<string, number>();
  return post.content.map((section) => {
    if (!section.heading) return undefined;
    const base =
      section.heading
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "section";
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}-${count + 1}`;
  });
}

export default function InsightPostClient({ post }: { post: InsightPost }) {
  const ids = sectionIds(post);
  const contents = post.content
    .map((section, i) => ({ heading: section.heading, id: ids[i] }))
    .filter((item): item is { heading: string; id: string } => Boolean(item.heading && item.id));

  return (
    <>
      {/* Hero */}
      <section className="bg-void pt-32 pb-12">
        <SectionContainer>
          <div className="max-w-3xl">
            <Reveal>
              <Link
                href="/insights"
                className="group inline-flex items-center gap-2 text-ghost-dim hover:text-cyan font-sans text-sm transition-colors mb-8"
              >
                <ArrowLeft
                  size={16}
                  className="transition-transform duration-300 group-hover:-translate-x-1"
                />
                <span>All insights</span>
              </Link>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="font-mono text-xs text-cyan tracking-wider uppercase">
                By {AUTHOR.name}, {AUTHOR.jobTitle} · {post.updated ? `Updated ${post.updated}` : post.date} · {post.readTime}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="font-heading text-ghost text-3xl md:text-4xl lg:text-5xl leading-tight uppercase font-semibold mt-4">
                {post.title}
              </h1>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="font-sans text-ghost-muted text-lg md:text-xl leading-relaxed mt-6">
                {post.excerpt}
              </p>
            </Reveal>
          </div>
        </SectionContainer>
      </section>

      {/* Body */}
      <section className="blend-void pb-24 md:pb-32">
        <SectionContainer>
          <article className="max-w-3xl space-y-10">
            {contents.length >= 3 && (
              <nav
                aria-label="On this page"
                className="border border-white/10 rounded-lg p-5 md:p-6"
              >
                <p className="font-mono text-xs text-cyan tracking-wider uppercase">
                  On this page
                </p>
                <ol className="mt-4 space-y-2 list-decimal list-inside font-sans text-ghost-muted">
                  {contents.map((item) => (
                    <li key={item.id}>
                      <a href={`#${item.id}`} className="hover:text-cyan transition-colors">
                        {item.heading}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
            {post.content.map((section, i) => (
              <Reveal key={i} delay={0.05}>
                <div className="space-y-5">
                  {section.heading && (
                    <h2
                      id={ids[i]}
                      className="font-heading text-xl md:text-2xl text-white font-semibold scroll-mt-28"
                    >
                      {section.heading}
                    </h2>
                  )}
                  {section.paragraphs.map((paragraph, j) => (
                    <p
                      key={j}
                      className="font-sans text-ghost-muted text-lg leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                  {section.links && (
                    <div className="flex flex-wrap gap-x-8 gap-y-3">
                      {section.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="group inline-flex items-center gap-2 text-cyan font-sans font-medium"
                        >
                          <span>{link.label}</span>
                          <ArrowRight
                            size={16}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </article>
        </SectionContainer>
      </section>

      <Faq items={post.faqs} />

      {/* CTA */}
      <section className="blend-surface section-padding">
        <SectionContainer>
          <div className="text-center max-w-2xl mx-auto">
            <Reveal>
              <h2 className="font-heading text-2xl md:text-3xl text-white uppercase font-semibold">
                See what we&rsquo;d build for you
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="font-sans text-ghost-muted text-lg mt-4">
                30 minutes. A straight answer on where agents would hit hardest in
                your operation.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <MagneticButton className="inline-block">
                  <Button variant="primary" size="lg" href="/contact">
                    Book a Call
                  </Button>
                </MagneticButton>
                <Link
                  href="/insights"
                  className="group inline-flex items-center gap-2 text-cyan font-sans font-medium text-sm"
                >
                  <span>More insights</span>
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </Reveal>
          </div>
        </SectionContainer>
      </section>
    </>
  );
}
