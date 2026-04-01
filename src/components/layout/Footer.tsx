import Link from "next/link";
import Image from "next/image";
import { services } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-void-light relative">
      {/* Gradient top border */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        {/* Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1 — Brand */}
          <div>
            <Link
              href="/"
              className="flex items-center gap-2 font-heading font-bold text-sm text-white uppercase tracking-[0.1em]"
            >
              <Image src="/icon-mark.png" alt="" width={24} height={24} className="w-6 h-6" />
              AYGENCY
            </Link>
            <p className="text-sm text-ghost-dim mt-4">
              Custom AI agent systems. Built for your operation. Running 24/7.
            </p>
            <a
              href="mailto:build@aygency.ai"
              className="text-sm text-cyan hover:text-cyan-muted transition-colors mt-6 inline-block"
            >
              build@aygency.ai
            </a>
          </div>

          {/* Col 2 — Services */}
          <div>
            <h3 className="uppercase tracking-[0.12em] text-xs font-heading font-semibold text-ghost mb-4">
              Services
            </h3>
            <div className="flex flex-col gap-3">
              {services.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="text-sm text-ghost-dim hover:text-cyan transition-colors"
                >
                  {service.shortTitle}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 3 — Company */}
          <div>
            <h3 className="uppercase tracking-[0.12em] text-xs font-heading font-semibold text-ghost mb-4">
              Company
            </h3>
            <div className="flex flex-col gap-3">
              <Link
                href="/use-cases"
                className="text-sm text-ghost-dim hover:text-cyan transition-colors"
              >
                Use Cases
              </Link>
              <Link
                href="/contact"
                className="text-sm text-ghost-dim hover:text-cyan transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Col 4 — Get in Touch */}
          <div>
            <h3 className="uppercase tracking-[0.12em] text-xs font-heading font-semibold text-ghost mb-4">
              Get in Touch
            </h3>
            <a
              href="mailto:build@aygency.ai"
              className="text-sm text-ghost-dim hover:text-cyan transition-colors"
            >
              build@aygency.ai
            </a>
            <p className="text-sm text-ghost-dim mt-4">
              Based in London. Operating globally.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-ghost/[0.06] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-ghost-dim">
            &copy; 2026 Aygency. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-ghost-dim hover:text-cyan transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-ghost-dim hover:text-cyan transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
