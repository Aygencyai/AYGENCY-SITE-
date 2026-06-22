"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageTransition from "@/components/ui/PageTransition";
import SectionContainer from "@/components/ui/SectionContainer";
import Reveal from "@/components/ui/Reveal";
import TypewriterText from "@/components/effects/TypewriterText";
import { insightPosts } from "@/lib/insights";

export default function InsightsClient() {
  return (
    <PageTransition>
      {/* Hero */}
      <section className="bg-void pt-32 pb-10">
        <SectionContainer>
          <Reveal>
            <p className="text-cyan font-mono text-xs tracking-[0.2em] uppercase mb-4">
              {`// insights`}
            </p>
          </Reveal>
          <h1 className="font-heading text-ghost text-4xl md:text-5xl lg:text-6xl uppercase font-semibold leading-tight mb-6">
            <TypewriterText text={"Insights"} delay={300} speed={60} />
          </h1>
          <Reveal delay={0.1}>
            <p className="text-ghost-muted text-lg md:text-xl max-w-2xl leading-relaxed font-sans">
              Notes on building, operating, and getting value out of AI agent
              systems, from the team that runs them.
            </p>
          </Reveal>
        </SectionContainer>
      </section>

      {/* Post list */}
      <section className="bg-void pt-12 pb-24 md:pt-16 md:pb-32">
        <SectionContainer>
          <div className="flex flex-col gap-6">
            {insightPosts.map((post, i) => (
              <Reveal key={post.slug} delay={i * 0.1}>
                <Link
                  href={`/insights/${post.slug}`}
                  className="group block rounded-xl bg-void-light/60 backdrop-blur-xl border border-ghost/[0.06] p-8 hover:shadow-card-hover hover:border-ghost/[0.12] transition-all duration-300"
                >
                  <p className="font-mono text-xs text-ghost-dim tracking-wider uppercase">
                    {post.date} · {post.readTime}
                  </p>
                  <h2 className="font-heading text-xl sm:text-2xl font-semibold text-white mt-3 max-w-3xl">
                    {post.title}
                  </h2>
                  <p className="font-sans text-ghost-muted mt-3 leading-relaxed max-w-2xl">
                    {post.excerpt}
                  </p>
                  <div className="inline-flex items-center gap-2 mt-6 text-cyan font-sans font-medium text-sm">
                    <span>Read</span>
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </SectionContainer>
      </section>
    </PageTransition>
  );
}
