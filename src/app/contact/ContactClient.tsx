"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Mail,
  MapPin,
  Clock,
  Linkedin,
  Twitter,
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
  const [calLoaded, setCalLoaded] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    // TODO: Connect to Resend/SendGrid API
    console.log("Form submitted:", data);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
  };

  const handleReset = () => {
    reset();
    setSubmitted(false);
  };

  const inputClasses =
    "w-full px-4 py-3 rounded-lg border border-border bg-primary text-text-primary font-body placeholder:text-text-tertiary focus:ring-2 focus:ring-accent/20 focus:border-accent focus:outline-none transition-colors duration-200";

  return (
    <>
      {/* Hero */}
      <section className="bg-secondary pt-32 pb-16">
        <SectionContainer>
          <div className="max-w-3xl">
            <Reveal>
              <h1 className="font-display italic text-text-primary text-4xl md:text-5xl leading-tight">
                Let&rsquo;s talk
              </h1>
              <p className="text-text-secondary text-lg md:text-xl leading-relaxed mt-4 max-w-2xl">
                Book a free 30-minute discovery call. We&rsquo;ll diagnose your
                highest-impact AI opportunity and show you a clear path forward.
              </p>
            </Reveal>
          </div>
        </SectionContainer>
      </section>

      {/* Main */}
      <section className="bg-primary section-padding">
        <SectionContainer>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 lg:gap-16">
            {/* Left — Cal.com embed */}
            <div>
              <Reveal>
                <h2 className="font-heading font-medium text-lg text-text-primary mb-6">
                  Pick a time
                </h2>
                <div className="min-h-[500px] rounded-2xl border border-border overflow-hidden bg-secondary relative">
                  <iframe
                    src={process.env.NEXT_PUBLIC_CAL_URL || "https://cal.com"}
                    className="w-full h-full min-h-[500px] border-0"
                    title="Schedule a discovery call"
                    loading="lazy"
                    onLoad={() => setCalLoaded(true)}
                  />
                  {/* Skeleton loading state */}
                  <div className={`absolute inset-0 bg-secondary flex flex-col items-center justify-center gap-4 pointer-events-none animate-pulse transition-opacity duration-500 ${calLoaded ? "opacity-0" : "opacity-100"}`}>
                    <div className="w-48 h-4 bg-border rounded" />
                    <div className="w-64 h-4 bg-border rounded" />
                    <div className="w-40 h-4 bg-border rounded" />
                    <div className="grid grid-cols-7 gap-2 mt-6">
                      {Array.from({ length: 35 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 bg-border rounded"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-text-tertiary mt-3">
                  Calendar not loading?{" "}
                  <a
                    href="mailto:hello@aygency.ai"
                    className="text-accent hover:underline"
                  >
                    Email us at hello@aygency.ai
                  </a>
                </p>
              </Reveal>
            </div>

            {/* Right — Info card + Form */}
            <div>
              {/* Info card */}
              <Reveal delay={0.1}>
                <div className="bg-secondary rounded-2xl p-8">
                  <h3 className="font-heading font-semibold text-lg text-text-primary">
                    Get in touch
                  </h3>

                  <div className="space-y-4 mt-6">
                    <a
                      href="mailto:hello@aygency.ai"
                      className="flex items-center gap-3 text-text-secondary hover:text-accent transition-colors duration-200"
                    >
                      <Mail size={18} className="text-accent flex-shrink-0" />
                      <span className="font-body text-sm">
                        hello@aygency.ai
                      </span>
                    </a>
                    <div className="flex items-center gap-3 text-text-secondary">
                      <MapPin
                        size={18}
                        className="text-accent flex-shrink-0"
                      />
                      <span className="font-body text-sm">
                        London, United Kingdom
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-text-secondary">
                      <Clock
                        size={18}
                        className="text-accent flex-shrink-0"
                      />
                      <span className="font-body text-sm">
                        Mon–Fri, 9am–6pm GMT
                      </span>
                    </div>
                  </div>

                  {/* Social icons */}
                  <div className="flex items-center gap-3 mt-6">
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg bg-primary border border-border hover:border-accent flex items-center justify-center transition-colors duration-200"
                      aria-label="LinkedIn"
                    >
                      <Linkedin size={18} className="text-text-secondary" />
                    </a>
                    <a
                      href="https://x.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg bg-primary border border-border hover:border-accent flex items-center justify-center transition-colors duration-200"
                      aria-label="X (Twitter)"
                    >
                      <Twitter size={18} className="text-text-secondary" />
                    </a>
                  </div>
                </div>
              </Reveal>

              {/* Form */}
              <Reveal delay={0.2}>
                <div className="bg-secondary rounded-2xl p-8 mt-6">
                  {submitted ? (
                    <div className="text-center py-8">
                      <CheckCircle2
                        size={48}
                        className="text-accent mx-auto"
                      />
                      <h3 className="font-heading font-semibold text-xl text-text-primary mt-4">
                        Message sent!
                      </h3>
                      <p className="font-body text-text-secondary text-sm mt-2">
                        We&rsquo;ll get back within 24 hours.
                      </p>
                      <button
                        onClick={handleReset}
                        className="text-accent font-heading font-medium text-sm mt-6 hover:underline"
                      >
                        Send another message
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-heading font-semibold text-lg text-text-primary mb-6">
                        Or send us a message
                      </h3>
                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                      >
                        {/* Name */}
                        <div>
                          <label
                            htmlFor="name"
                            className="block font-heading text-sm font-medium text-text-primary mb-1.5"
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
                            className="block font-heading text-sm font-medium text-text-primary mb-1.5"
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
                            className="block font-heading text-sm font-medium text-text-primary mb-1.5"
                          >
                            Company{" "}
                            <span className="text-text-tertiary font-normal">
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
                            className="block font-heading text-sm font-medium text-text-primary mb-1.5"
                          >
                            Tell us your pain point
                          </label>
                          <textarea
                            id="message"
                            rows={4}
                            placeholder="What challenge are you facing?"
                            className={inputClasses + " resize-none"}
                            {...register("message")}
                          />
                          {errors.message && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.message.message}
                            </p>
                          )}
                        </div>

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
                            "Send Message"
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
