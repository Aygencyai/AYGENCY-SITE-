"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Mail,
  MapPin,
  Clock,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import SectionContainer from "@/components/ui/SectionContainer";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import TypewriterText from "@/components/effects/TypewriterText";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  company: z.string().optional(),
  message: z
    .string()
    .min(1, "Message is required")
    .min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactClient() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: ContactFormData) => {
    setError(null);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setError(body?.error ?? "Something went wrong. Please try again.");
      return;
    }
    setSubmitted(true);
  };

  const handleReset = () => {
    reset();
    setSubmitted(false);
  };

  const inputClasses =
    "w-full px-4 py-3 rounded-lg border border-ghost/[0.08] bg-surface text-ghost font-sans placeholder:text-ghost-dim focus:ring-2 focus:ring-cyan/20 focus:border-cyan/40 focus:outline-none transition-colors duration-200";

  return (
    <>
      {/* Combined hero + content */}
      <section className="bg-void pt-32 pb-24">
        <SectionContainer>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 lg:gap-16 items-start">
            {/* Left — Title, description, info card */}
            <div>
              <Reveal>
                <p className="text-cyan font-mono text-xs tracking-[0.2em] uppercase mb-4">
                  Contact
                </p>
              </Reveal>
              <h1 className="font-heading text-ghost text-4xl md:text-5xl leading-tight uppercase font-semibold mb-4">
                <TypewriterText
                  text="Let's Find What You Should Build First"
                  delay={300}
                  speed={35}
                />
              </h1>
              <Reveal delay={0.1}>
                <p className="text-ghost-muted font-sans text-lg md:text-xl leading-relaxed max-w-2xl">
                  Tell us what&rsquo;s slowing your operation down. We&rsquo;ll
                  get back to you within one working day with a straight answer
                  on where an agent system would hit hardest &mdash; and how
                  quickly we could have it live.
                </p>
              </Reveal>

              <div className="mt-10">
                <Reveal delay={0.2}>
                  <GlassCard tilt={false}>
                    <h3 className="font-heading text-lg font-semibold text-white">
                      Get in touch
                    </h3>

                    <div className="space-y-4 mt-5">
                      <a
                        href="mailto:louis@aygency.ai"
                        className="flex items-center gap-3 text-ghost-muted hover:text-cyan transition-colors duration-200"
                      >
                        <Mail size={18} className="text-cyan flex-shrink-0" />
                        <span className="font-sans text-sm">
                          louis@aygency.ai
                        </span>
                      </a>
                      <div className="flex items-center gap-3 text-ghost-muted">
                        <MapPin
                          size={18}
                          className="text-cyan flex-shrink-0"
                        />
                        <span className="font-sans text-sm">
                          London, United Kingdom
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-ghost-muted">
                        <Clock
                          size={18}
                          className="text-cyan flex-shrink-0"
                        />
                        <span className="font-sans text-sm">
                          Mon–Fri, 9am–6pm GMT
                        </span>
                      </div>
                      <p className="font-sans text-xs text-ghost-dim mt-2 ml-[30px]">
                        We typically respond within one working day.
                      </p>
                    </div>
                  </GlassCard>
                </Reveal>
              </div>
            </div>

            {/* Right — Form (aligned to top of title) */}
            <div>
              <Reveal delay={0.2}>
                <GlassCard tilt={false}>
                  {submitted ? (
                    <div className="text-center py-8">
                      <CheckCircle2
                        size={48}
                        className="text-cyan mx-auto"
                      />
                      <h3 className="font-heading text-xl font-semibold text-white mt-4">
                        Message sent!
                      </h3>
                      <p className="font-sans text-ghost-muted text-sm mt-2">
                        We&rsquo;ll get back within 24 hours.
                      </p>
                      <button
                        onClick={handleReset}
                        className="text-cyan font-sans font-medium text-sm mt-6 hover:underline"
                      >
                        Send another message
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-heading text-lg font-semibold text-white mb-6">
                        Send us a message
                      </h3>
                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                      >
                        <div>
                          <label
                            htmlFor="name"
                            className="block font-sans text-sm font-medium text-ghost mb-1.5"
                          >
                            Name
                          </label>
                          <input
                            id="name"
                            type="text"
                            placeholder="Your name"
                            className={inputClasses}
                            {...register("name")}
                          />
                          {errors.name && (
                            <p className="text-error text-xs mt-1">
                              {errors.name.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="email"
                            className="block font-sans text-sm font-medium text-ghost mb-1.5"
                          >
                            Email
                          </label>
                          <input
                            id="email"
                            type="email"
                            placeholder="you@company.com"
                            className={inputClasses}
                            {...register("email")}
                          />
                          {errors.email && (
                            <p className="text-error text-xs mt-1">
                              {errors.email.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="company"
                            className="block font-sans text-sm font-medium text-ghost mb-1.5"
                          >
                            Company{" "}
                            <span className="text-ghost-dim font-normal">
                              (optional)
                            </span>
                          </label>
                          <input
                            id="company"
                            type="text"
                            placeholder="Your company"
                            className={inputClasses}
                            {...register("company")}
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="message"
                            className="block font-sans text-sm font-medium text-ghost mb-1.5"
                          >
                            What can we help with?
                          </label>
                          <textarea
                            id="message"
                            rows={4}
                            placeholder="Tell us what's taking too long, costing too much, or breaking when you try to scale."
                            className={inputClasses + " resize-none"}
                            {...register("message")}
                          />
                          {errors.message && (
                            <p className="text-error text-xs mt-1">
                              {errors.message.message}
                            </p>
                          )}
                        </div>

                        {error && (
                          <p className="text-error text-sm">{error}</p>
                        )}

                        <Button
                          variant="primary"
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full mt-6 flex items-center justify-center gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2
                                size={18}
                                className="animate-spin"
                              />
                              Sending...
                            </>
                          ) : (
                            "Send It Over"
                          )}
                        </Button>
                      </form>
                    </>
                  )}
                </GlassCard>
              </Reveal>
            </div>
          </div>
        </SectionContainer>
      </section>
    </>
  );
}
