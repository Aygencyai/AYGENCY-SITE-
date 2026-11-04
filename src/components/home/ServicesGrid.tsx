"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { services } from "@/lib/data";

// The first two services (command centre, back-office agents) lead, so they get the big cards.
const [lead, rest] = [services.slice(0, 2), services.slice(2)];

function Card({ slug, title, description, big }: { slug: string; title: string; description: string; big?: boolean }) {
  return (
    <Link href={`/services/${slug}`} className="group block h-full">
      <GlassCard tilt={false} className="h-full">
        <h3 className={`font-heading font-semibold text-white ${big ? "text-2xl" : "text-lg"}`}>{title}</h3>
        <p className={`font-sans leading-relaxed text-ghost-muted mt-3 ${big ? "text-base" : "text-sm"}`}>{description}</p>
        <span className="inline-flex items-center gap-2 mt-5 font-heading text-[12px] font-semibold uppercase tracking-[0.15em] text-cyan">
          Explore <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </span>
      </GlassCard>
    </Link>
  );
}

export default function ServicesGrid() {
  return (
    <section className="blend-surface section-padding">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-cyan mb-6">{`// what we build`}</p>
          <h2 className="font-heading text-[2rem] sm:text-[2.5rem] md:text-[3rem] leading-[1.1] text-ghost uppercase font-semibold">
            Start at the core. Build out from there.
          </h2>
          <p className="font-sans text-lg leading-[1.7] text-ghost-muted mt-6">
            Every system starts with the command centre and the back office, where the most
            hours are won. From there, we extend into the rest of the business.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-14">
          {lead.map((s) => (
            <Card key={s.slug} slug={s.slug} title={s.title} description={s.description} big />
          ))}
        </div>
        {/* 3 + 3 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mt-6">
          {rest.map((s) => (
            <div key={s.slug} className="lg:col-span-2">
              <Card slug={s.slug} title={s.shortTitle} description={s.description} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
