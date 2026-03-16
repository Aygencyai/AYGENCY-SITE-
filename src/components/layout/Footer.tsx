import Link from "next/link";
import { services } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-green">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        {/* Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1 — Brand */}
          <div>
            <Link
              href="/"
              className="font-sans font-semibold text-sm text-white uppercase tracking-[0.15em]"
            >
              AYGENCY
            </Link>
            <p className="text-sm text-white/60 mt-4">
              Custom AI agent systems. Built for your operation. Running 24/7.
            </p>
            <a
              href="mailto:louis@aygency.ai"
              className="text-sm text-white/60 hover:text-white transition-colors mt-6 inline-block"
            >
              louis@aygency.ai
            </a>
          </div>

          {/* Col 2 — Services */}
          <div>
            <h3 className="uppercase tracking-[0.12em] text-sm font-sans font-medium text-white mb-4">
              Services
            </h3>
            <div className="flex flex-col gap-3">
              {services.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  {service.shortTitle}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 3 — Company */}
          <div>
            <h3 className="uppercase tracking-[0.12em] text-sm font-sans font-medium text-white mb-4">
              Company
            </h3>
            <div className="flex flex-col gap-3">
              <Link
                href="/use-cases"
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Use Cases
              </Link>
              <Link
                href="/contact"
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Col 4 — Get in Touch */}
          <div>
            <h3 className="uppercase tracking-[0.12em] text-sm font-sans font-medium text-white mb-4">
              Get in Touch
            </h3>
            <a
              href="mailto:louis@aygency.ai"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              louis@aygency.ai
            </a>
            <p className="text-sm text-white/60 mt-4">
              Based in London. Operating globally.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/60">
            &copy; 2026 Aygency. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-white/60 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-white/60 hover:text-white transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
