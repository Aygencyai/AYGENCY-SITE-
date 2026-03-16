"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { useCases } from "@/lib/data";

export default function CaseStudies() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) return;
    setProgress(el.scrollLeft / maxScroll);
  }, []);

  return (
    <section id="use-cases" className="bg-secondary section-padding">
      <SectionContainer>
        <SectionHeading
          eyebrow="Use Cases"
          heading="Systems we design"
          align="left"
        />

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide mt-16 -mx-6 px-6 md:-mx-8 md:px-8"
        >
          {useCases.map((useCase, i) => (
            <Reveal key={useCase.slug} delay={i * 0.1} direction="right">
              <Link
                href={`/use-cases/${useCase.slug}`}
                className="group block min-w-[340px] md:min-w-[420px] max-w-[480px] flex-shrink-0 snap-start bg-primary border border-border rounded-2xl p-8 hover:shadow-card-hover transition-all duration-300"
              >
                <div className="flex flex-wrap gap-2">
                  <span className="inline-block bg-accent-light text-accent text-xs font-medium px-3 py-1 rounded-full">
                    {useCase.sector}
                  </span>
                  <span className="inline-block bg-accent-light text-accent text-xs font-medium px-3 py-1 rounded-full">
                    {useCase.systemType}
                  </span>
                </div>

                <h3 className="font-heading font-semibold text-2xl text-text-primary mt-4">
                  {useCase.title}
                </h3>

                <p className="font-body text-text-secondary mt-4">
                  {useCase.subtext}
                </p>

                <div className="border-t border-border my-6" />

                <p className="font-body text-sm font-medium text-text-primary">
                  {useCase.estimatedImpact}
                </p>

                <div className="flex items-center gap-2 mt-6 text-accent font-heading font-medium text-sm">
                  <span>View use case</span>
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* Scroll progress bar */}
        <div className="w-full h-0.5 bg-border rounded-full mt-6">
          <div
            className="h-full bg-accent rounded-full transition-all duration-100"
            style={{ width: `${Math.max(progress * 100, 2)}%` }}
          />
        </div>
      </SectionContainer>
    </section>
  );
}
