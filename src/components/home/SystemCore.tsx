"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { User, Network, Brain } from "lucide-react";
import GlowOrb from "@/components/effects/GlowOrb";
import { agents } from "@/lib/data";

const core = agents.filter((a) => a.group === "core");
const slug = (name: string) => name.toLowerCase().replace(/\s+/g, "-");
const fanX = [50, 150, 250, 350, 450, 550];

function Connector({ active, delay }: { active: boolean; delay: number }) {
  return (
    <motion.div
      initial={{ scaleY: 0 }}
      animate={active ? { scaleY: 1 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="w-px h-8 origin-top mx-auto"
      style={{
        background:
          "linear-gradient(180deg, rgba(0,229,255,0.5), rgba(0,229,255,0.12))",
      }}
    />
  );
}

function AgentChip({ name }: { name: string }) {
  return (
    <Link
      href={`/system#${slug(name)}`}
      className="flex items-center justify-center text-center font-mono text-[10px] md:text-[11px] uppercase tracking-wider rounded px-2 py-2 min-h-[2.6rem] leading-tight border border-ghost/15 text-ghost-muted bg-void-light/40 hover:border-cyan/40 hover:text-cyan transition-colors"
    >
      {name}
    </Link>
  );
}

function Diagram() {
  const ref = useRef<HTMLDivElement>(null);
  const active = useInView(ref, { once: true, margin: "-80px 0px" });

  return (
    <div ref={ref} className="flex flex-col items-center">
      {/* You */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={active ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="inline-flex items-center gap-2.5 rounded-full border border-ghost/20 bg-void-light/60 px-5 py-2.5"
      >
        <User className="w-4 h-4 text-ghost-muted" strokeWidth={1.5} />
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-ghost">You</span>
      </motion.div>

      <Connector active={active} delay={0.1} />

      {/* CEO Agent */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={active ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        <div className="relative inline-flex flex-col items-center gap-2 rounded-2xl border border-cyan/40 bg-cyan/[0.06] px-8 py-5 shadow-glow-sm">
          <div className="w-11 h-11 rounded-xl bg-cyan/10 border border-cyan/30 flex items-center justify-center">
            <Network className="w-6 h-6 text-cyan" strokeWidth={1.5} />
          </div>
          <span className="font-heading text-lg font-semibold text-white">CEO Agent</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan">
            reads across every agent
          </span>
          <motion.span
            className="pointer-events-none absolute inset-0 rounded-2xl border border-cyan/40"
            animate={{ opacity: [0.4, 0, 0.4], scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>

      {/* Desktop: fan-out lines from the CEO to every agent */}
      <motion.svg
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.35 }}
        viewBox="0 0 600 56"
        preserveAspectRatio="none"
        className="hidden md:block w-full max-w-2xl h-12"
        aria-hidden
      >
        {fanX.map((x) => (
          <line
            key={x}
            x1="300"
            y1="0"
            x2={x}
            y2="56"
            stroke="rgba(0,229,255,0.3)"
            strokeWidth="1"
          />
        ))}
      </motion.svg>

      {/* Desktop agents */}
      <div className="hidden md:grid grid-cols-6 gap-2 w-full max-w-2xl">
        {core.map((agent, i) => (
          <motion.div
            key={agent.name}
            initial={{ opacity: 0, y: 10 }}
            animate={active ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.4 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            <AgentChip name={agent.name} />
          </motion.div>
        ))}
      </div>

      {/* Mobile agents */}
      <div className="md:hidden flex flex-col items-center w-full">
        <Connector active={active} delay={0.3} />
        <div className="grid grid-cols-2 gap-2.5 w-full max-w-xs">
          {core.map((agent) => (
            <AgentChip key={agent.name} name={agent.name} />
          ))}
        </div>
      </div>

      <Connector active={active} delay={0.5} />

      {/* The Brain — the foundation every agent runs on */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={active ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <Link
          href="/brain"
          className="block rounded-xl border border-cyan/30 bg-cyan/[0.05] px-6 py-4 hover:border-cyan/50 transition-colors"
        >
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
            <span className="inline-flex items-center gap-2">
              <Brain className="w-5 h-5 text-cyan" strokeWidth={1.5} />
              <span className="font-heading text-base font-semibold text-white">The Brain</span>
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan">
              every agent reads and writes it
            </span>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}

export default function SystemCore() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="blend-surface section-padding relative overflow-hidden">
      <GlowOrb
        size={500}
        opacity={0.06}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        parallaxStrength={20}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-heading text-[2rem] sm:text-[2.5rem] md:text-[3rem] leading-[1.1] text-ghost uppercase font-semibold">
            Every System Ships With a CEO and a Brain
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans text-lg leading-[1.7] text-ghost-muted mt-6 max-w-2xl mx-auto"
        >
          A CEO agent on top, reading across every other agent. A private brain underneath,
          holding everything your business knows.
        </motion.p>

        <div className="mt-14">
          <Diagram />
        </div>

        <div ref={ref} className="mt-16 space-y-5">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans text-base leading-relaxed text-ghost-muted"
          >
            The CEO Agent catches what no single agent can see and brings it straight to
            you. The Brain remembers how your business runs, kept current by the agents as
            they work. You talk to one; everything runs on the other.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono text-sm tracking-wide uppercase text-cyan mt-6"
          >
            Included with every system we build, always.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
