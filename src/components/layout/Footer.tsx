import Link from "next/link";
import { services } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-navy">
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
            <p className="text-sm text-muted mt-4">
              Custom AI agent systems. Built for your operation. Running 24/7.
            </p>
            {/* Social icons */}
            <div className="flex gap-4 mt-6">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-white transition-colors"
                aria-label="X (Twitter)"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
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
                  className="text-sm text-muted hover:text-white transition-colors"
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
                href="/case-studies"
                className="text-sm text-muted hover:text-white transition-colors"
              >
                Case Studies
              </Link>
              <Link
                href="/contact"
                className="text-sm text-muted hover:text-white transition-colors"
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
              href="mailto:hello@aygency.ai"
              className="text-sm text-muted hover:text-white transition-colors"
            >
              hello@aygency.ai
            </a>
            <p className="text-sm text-muted mt-4">
              Based in London. Operating globally.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted">
            &copy; 2026 Aygency. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-muted hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-muted hover:text-white transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
