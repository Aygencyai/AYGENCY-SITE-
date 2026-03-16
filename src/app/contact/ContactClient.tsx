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
    "w-full px-4 py-3 rounded-lg border border-ivory-dark bg-ivory text-near-black font-sans placeholder:text-muted focus:ring-2 focus:ring-green/20 focus:border-green focus:outline-none transition-colors duration-200";

  return (
    <>
      {/* Hero */}
      <section className="bg-ivory pt-32 pb-16">
        <SectionContainer>
          <div className="max-w-3xl">
            <Reveal>
              <h1 className="font-serif text-green text-4xl md:text-5xl leading-tight uppercase">
                Let&rsquo;s Find What You Should Build First
              </h1>
              <p className="text-green-muted font-sans text-lg md:text-xl leading-relaxed mt-4 max-w-2xl">
                Tell us what&rsquo;s slowing your operation down. We&rsquo;ll
                get back to you within one working day with a straight answer
                on where an agent system would hit hardest &mdash; and how
                quickly we could have it live.
              </p>
            </Reveal>
          </div>
        </SectionContainer>
      </section>

      {/* Main */}
      <section className="bg-ivory py-20 md:py-24">
        <SectionContainer>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 lg:gap-16">
            {/* Left — Info card */}
            <div>
              <Reveal>
                <div className="bg-ivory-dark rounded-lg p-8">
                  <h3 className="font-serif text-lg text-green">
                    Get in touch
                  </h3>

                  <div className="space-y-4 mt-6">
                    <a
                      href="mailto:louis@aygency.ai"
                      className="flex items-center gap-3 text-green-muted hover:text-green transition-colors duration-200"
                    >
                      <Mail size={18} className="text-green flex-shrink-0" />
                      <span className="font-sans text-sm">
                        louis@aygency.ai
                      </span>
                    </a>
                    <div className="flex items-center gap-3 text-green-muted">
                      <MapPin
                        size={18}
                        className="text-green flex-shrink-0"
                      />
                      <span className="font-sans text-sm">
                        London, United Kingdom
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-green-muted">
                      <Clock
                        size={18}
                        className="text-green flex-shrink-0"
                      />
                      <span className="font-sans text-sm">
                        Mon–Fri, 9am–6pm GMT
                      </span>
                    </div>
                    <p className="font-sans text-xs text-muted mt-2 ml-[30px]">
                      We typically respond within one working day.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right — Form */}
            <div>

              {/* Form */}
              <Reveal delay={0.2}>
                <div className="bg-ivory-dark rounded-lg p-8 mt-6">
                  {submitted ? (
                    <div className="text-center py-8">
                      <CheckCircle2
                        size={48}
                        className="text-green mx-auto"
                      />
                      <h3 className="font-serif text-xl text-green mt-4">
                        Message sent!
                      </h3>
                      <p className="font-sans text-green-muted text-sm mt-2">
                        We&rsquo;ll get back within 24 hours.
                      </p>
                      <button
                        onClick={handleReset}
                        className="text-green font-sans font-medium text-sm mt-6 hover:underline"
                      >
                        Send another message
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-serif text-lg text-green mb-6">
                        Send us a message
                      </h3>
                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                      >
                        {/* Name */}
                        <div>
                          <label
                            htmlFor="name"
                            className="block font-sans text-sm font-medium text-green mb-1.5"
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
                            <p className="text-red-500 text-xs mt-1">
                              {errors.name.message}
                            </p>
                          )}
                        </div>

                        {/* Email */}
                        <div>
                          <label
                            htmlFor="email"
                            className="block font-sans text-sm font-medium text-green mb-1.5"
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
                            <p className="text-red-500 text-xs mt-1">
                              {errors.email.message}
                            </p>
                          )}
                        </div>

                        {/* Company */}
                        <div>
                          <label
                            htmlFor="company"
                            className="block font-sans text-sm font-medium text-green mb-1.5"
                          >
                            Company{" "}
                            <span className="text-muted font-normal">
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

                        {/* Message */}
                        <div>
                          <label
                            htmlFor="message"
                            className="block font-sans text-sm font-medium text-green mb-1.5"
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
                            <p className="text-red-500 text-xs mt-1">
                              {errors.message.message}
                            </p>
                          )}
                        </div>

                        {/* Error */}
                        {error && (
                          <p className="text-red-500 text-sm">{error}</p>
                        )}

                        {/* Submit */}
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
                </div>
              </Reveal>
            </div>
          </div>
        </SectionContainer>
      </section>
    </>
  );
}
