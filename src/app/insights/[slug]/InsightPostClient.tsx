"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SectionContainer from "@/components/ui/SectionContainer";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import MagneticButton from "@/components/ui/MagneticButton";
import type { InsightPost } from "@/lib/insights";

export default function InsightPostClient({ post }: { post: InsightPost }) {
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
                {post.date} · {post.readTime}
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
      <section className="bg-void pb-24 md:pb-32">
        <SectionContainer>
          <article className="max-w-3xl space-y-10">
            {post.content.map((section, i) => (
              <Reveal key={i} delay={0.05}>
                <div className="space-y-5">
                  {section.heading && (
                    <h2 className="font-heading text-xl md:text-2xl text-white font-semibold">
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
                </div>
              </Reveal>
            ))}
          </article>
        </SectionContainer>
      </section>

      {/* CTA */}
      <section className="bg-surface section-padding">
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
