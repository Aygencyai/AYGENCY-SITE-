"use client";

import Link from "next/link";
import { DollarSign, TrendingUp, Eye, Building2, ArrowRight } from "lucide-react";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const iconMap = {
  "cost-reduction": DollarSign,
  "revenue-operations": TrendingUp,
  intelligence: Eye,
  "full-department": Building2,
} as const;

const serviceCards = [
  {
    slug: "cost-reduction",
    number: "01",
    title: "Cost Reduction Systems",
    description:
      "Agent systems that replace the expensive manual processes bleeding your operation.",
  },
  {
    slug: "revenue-operations",
    number: "02",
    title: "Revenue Operations Systems",
    description:
      "Agent systems that actively find and generate revenue. Pipeline, outreach, qualification, conversion.",
  },
  {
    slug: "intelligence",
    number: "03",
    title: "Intelligence & Oversight",
    description:
      "A system that sits above your entire operation, sees every data point, and finds the opportunities nobody\u2019s looking for.",
  },
  {
    slug: "full-department",
    number: "04",
    title: "Full Department Systems",
    description:
      "A complete function run by a coordinated team of AI agents with human oversight only where it matters.",
  },
];

export default function ServicesGrid() {
  return (
    <section className="bg-primary section-padding">
      <SectionContainer>
        <SectionHeading
          eyebrow="What We Do"
          heading="Four ways we work with businesses"
          description="Every engagement starts with understanding your operation and ends with a system that runs it."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          {serviceCards.map((service, i) => {
            const Icon = iconMap[service.slug as keyof typeof iconMap];
            return (
              <Reveal key={service.slug} delay={i * 0.1}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group block bg-primary border border-border rounded-2xl p-8 md:p-10 hover:shadow-card-hover hover:border-accent/30 hover:-translate-y-[2px] transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="icon-animate w-14 h-14 bg-accent-light rounded-xl flex items-center justify-center">
                      <Icon size={32} className="text-accent" />
                    </div>
                    <span className="font-heading text-xs text-text-tertiary tracking-widest">
                      {service.number}
                    </span>
                  </div>

                  <h3 className="font-heading font-semibold text-xl text-text-primary mt-6">
                    {service.title}
                  </h3>
                  <p className="font-body text-text-secondary mt-3">
                    {service.description}
                  </p>

                  <div className="flex items-center gap-2 mt-6 text-accent font-heading font-medium text-sm">
                    <span>Learn more</span>
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </SectionContainer>
    </section>
  );
}
