"use client";

import Link from "next/link";
import { Bot, Megaphone, Cog, Search, ArrowRight } from "lucide-react";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const iconMap = {
  "agent-design": Bot,
  "ai-marketing": Megaphone,
  automation: Cog,
  consulting: Search,
} as const;

const serviceCards = [
  {
    slug: "agent-design",
    number: "01",
    title: "AI Agent Design & Deployment",
    description:
      "Custom agents designed for your specific workflows, data, and decision-making.",
  },
  {
    slug: "ai-marketing",
    number: "02",
    title: "AI-Powered Marketing",
    description:
      "Full-stack marketing operations run by coordinated AI agents.",
  },
  {
    slug: "automation",
    number: "03",
    title: "Process Automation",
    description:
      "Inventory, lead routing, energy, documents \u2014 the operational work that bleeds time and money.",
  },
  {
    slug: "consulting",
    number: "04",
    title: "Strategic AI Consulting",
    description:
      "A clear-eyed audit of where AI fits in your business \u2014 and where it doesn\u2019t.",
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
