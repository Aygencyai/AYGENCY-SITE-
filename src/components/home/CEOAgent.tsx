"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { User, Brain } from "lucide-react";
import GlowOrb from "@/components/effects/GlowOrb";
import { agents } from "@/lib/data";

const core = agents.filter((a) => a.group === "core");

function Connector({ active, delay }: { active: boolean; delay: number }) {
  return (
    <motion.div
      initial={{ scaleY: 0 }}
      animate={active ? { scaleY: 1 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="w-px h-9 md:h-11 origin-top mx-auto"
      style={{
        background:
          "linear-gradient(180deg, rgba(0,229,255,0.5), rgba(0,229,255,0.12))",
      }}
    />
  );
}

function SystemDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const active = useInView(ref, { once: true, margin: "-80px 0px" });

  return (
    <div ref={ref} className="flex flex-col items-center">
      {/* You: the human interface */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={active ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center"
      >
        <div className="inline-flex items-center gap-2.5 rounded-full border border-ghost/20 bg-void-light/60 px-5 py-2.5">
          <User className="w-4 h-4 text-ghost-muted" strokeWidth={1.5} />
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-ghost">
            You
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ghost-dim mt-2.5">
          your interface to the system
        </span>
      </motion.div>

      <Connector active={active} delay={0.15} />

      {/* CEO Agent: on top of every other agent */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={active ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        <div className="relative inline-flex flex-col items-center gap-2 rounded-2xl border border-cyan/40 bg-cyan/[0.06] px-8 py-5 shadow-glow-sm">
          <div className="w-11 h-11 rounded-xl bg-cyan/10 border border-cyan/30 flex items-center justify-center">
            <Brain className="w-6 h-6 text-cyan" strokeWidth={1.5} />
          </div>
          <span className="font-heading text-lg font-semibold text-white">
            CEO Agent
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan">
            reads across everything
          </span>
          <motion.span
            className="pointer-events-none absolute inset-0 rounded-2xl border border-cyan/40"
            animate={{ opacity: [0.4, 0, 0.4], scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>

      <Connector active={active} delay={0.4} />

      {/* Specialist agents: the operation core feeding the CEO */}
      <div className="flex flex-wrap justify-center gap-2.5 max-w-lg">
        {core.map((agent, i) => (
          <motion.span
            key={agent.name}
            initial={{ opacity: 0, y: 10 }}
            animate={active ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.4,
              delay: 0.5 + i * 0.06,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="font-mono text-xs uppercase tracking-wider rounded px-3 py-1.5 border border-ghost/15 text-ghost-muted bg-void-light/40"
          >
            {agent.name}
          </motion.span>
        ))}
      </div>
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ghost-dim mt-4">
        your specialist agents
      </span>
    </div>
  );
}

export default function CEOAgent() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bg-void section-padding relative overflow-hidden">
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
            Every System Comes With a CEO
          </h2>
        </motion.div>

        <div className="mt-14">
          <SystemDiagram />
        </div>

        <div ref={ref} className="mt-16 space-y-5">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans text-base leading-relaxed text-ghost-muted"
          >
            The CEO Agent sits on top of every other agent and reads across the whole
            operation as it happens. It does what a sharp operator does: it catches the
            patterns no single department can see, and finds the openings nobody thought
            to look for.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans text-base leading-relaxed text-ghost-muted"
          >
            Your specialist agents do the work. The CEO Agent reads across all of it and
            brings you what you&rsquo;d usually only catch months later, like the segment
            that&rsquo;s quietly growing or the bottleneck that&rsquo;s quietly costing
            you. You talk to it; it runs the room.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono text-sm tracking-wide uppercase text-cyan mt-6"
          >
            Included with every system we build, always.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
