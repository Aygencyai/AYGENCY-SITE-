"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import SectionContainer from "@/components/ui/SectionContainer";
import Button from "@/components/ui/Button";

const smoothEase = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const [scrollIndicatorVisible, setScrollIndicatorVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => setScrollIndicatorVisible(window.scrollY < 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleScrollDown = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-primary">
      {/* Background visual layer */}
      <div className="absolute inset-0">
        {/* Warm radial gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(123,167,188,0.08) 0%, transparent 70%)",
          }}
        />
        {/* Subtle grain texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "256px 256px",
          }}
        />
        {/* TODO: Replace with cinematic AI/tech video or 3D rendered visual (MP4, H.264, 1080p, <8MB, 15-20s loop) */}
      </div>

      {/* Abstract orbital element — right side, desktop only */}
      <div className="absolute -right-[5%] bottom-[10%] w-[500px] h-[500px] md:w-[600px] md:h-[600px] lg:w-[700px] lg:h-[700px] opacity-0 md:opacity-60 pointer-events-none">
        {/* Outer ring — slow rotation */}
        <div className="absolute inset-0 rounded-full border border-border/30 animate-[spin_60s_linear_infinite]">
          {/* Middle ring — offset */}
          <div className="absolute inset-[12%] rounded-full border border-accent/20">
            {/* Inner glow */}
            <div
              className="absolute inset-[15%] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(123,167,188,0.05) 0%, transparent 70%)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <SectionContainer className="pt-40 md:pt-48 pb-32 md:pb-40">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-16 lg:gap-24 items-end">
            {/* Left column — main content */}
            <div>
              {/* Pagination label */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1, ease: smoothEase }}
                className="font-heading text-xs tracking-[0.2em] uppercase text-text-tertiary mb-8"
              >
                AI Agent Systems / 001
              </motion.p>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: smoothEase }}
                className="font-display italic text-5xl sm:text-6xl md:text-7xl lg:text-[80px] xl:text-[88px] text-text-primary leading-[1.05] tracking-tight"
              >
                We don&rsquo;t advise.
                <br />
                We build.
              </motion.h1>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: smoothEase }}
                className="flex flex-col sm:flex-row gap-4 mt-10"
              >
                <Button
                  variant="primary"
                  size="lg"
                  href="/contact"
                  className="w-full sm:w-auto text-center"
                >
                  Get in Touch
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  href="/services"
                  className="w-full sm:w-auto text-center"
                >
                  Our Services
                </Button>
              </motion.div>

              {/* Mobile description fallback (below lg) */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8, ease: smoothEase }}
                className="lg:hidden text-lg text-text-secondary leading-relaxed mt-8 text-center sm:text-left max-w-lg"
              >
                We specialise in workflow automation and personalised AI
                solutions for progressive organisations.
              </motion.p>
            </div>

            {/* Right column — supporting text (desktop only) */}
            <div className="hidden lg:block">
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: smoothEase }}
                className="text-lg text-text-secondary leading-relaxed max-w-sm"
              >
                We specialise in workflow automation and personalised AI
                solutions for progressive organisations.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7, ease: smoothEase }}
                className="text-sm text-text-tertiary leading-relaxed max-w-xs mt-8"
              >
                Helping forward-looking companies thrive with custom AI
                solutions and automated workflows.
              </motion.p>
            </div>
          </div>
        </SectionContainer>
      </div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: scrollIndicatorVisible ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        onClick={handleScrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-text-tertiary cursor-pointer"
        aria-label="Scroll down"
      >
        <ChevronDown size={24} className="animate-bounce" />
      </motion.button>
    </section>
  );
}
