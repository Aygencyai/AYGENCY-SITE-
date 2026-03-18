"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { services } from "@/lib/data";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Use Cases", href: "/use-cases" },
  { label: "Contact", href: "/contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleDropdownEnter = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setDropdownOpen(false), 150);
  };

  const isActive = (href: string) => {
    if (href === "/services") return pathname === "/services" || pathname.startsWith("/services/");
    return pathname === href;
  };

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-void-light/80 backdrop-blur-xl shadow-nav border-b border-ghost/[0.06]"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link
              href="/"
              className="font-heading font-bold text-sm text-white uppercase tracking-[0.1em]"
            >
              AYGENCY
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) =>
                link.label === "Services" ? (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={handleDropdownEnter}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "relative font-sans font-medium text-[13px] uppercase tracking-[0.12em] transition-colors duration-200",
                        isActive(link.href)
                          ? "text-white"
                          : "text-ghost-muted hover:text-white"
                      )}
                    >
                      {link.label}
                      {isActive(link.href) && (
                        <span className="absolute -bottom-1 left-0 right-0 h-px bg-cyan" />
                      )}
                    </Link>

                    {/* Services dropdown */}
                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-4 glass-strong rounded-xl p-2 min-w-[280px] z-50"
                        >
                          {services.map((service) => (
                            <Link
                              key={service.slug}
                              href={`/services/${service.slug}`}
                              className="block px-4 py-3 rounded-lg hover:bg-surface-light/50 transition-colors group"
                            >
                              <span className="block font-sans font-medium text-sm text-ghost group-hover:text-white transition-colors">
                                {service.shortTitle}
                              </span>
                              <span className="block text-xs text-ghost-dim mt-0.5 line-clamp-1">
                                {service.description}
                              </span>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={cn(
                      "relative font-sans font-medium text-[13px] uppercase tracking-[0.12em] transition-colors duration-200",
                      isActive(link.href)
                        ? "text-white"
                        : "text-ghost-muted hover:text-white"
                    )}
                  >
                    {link.label}
                    {isActive(link.href) && (
                      <span className="absolute -bottom-1 left-0 right-0 h-px bg-cyan" />
                    )}
                  </Link>
                )
              )}

              {/* Desktop CTA */}
              <Link
                href="/contact"
                className="bg-cyan text-void font-heading font-semibold text-[13px] uppercase tracking-[0.15em] rounded-lg px-8 py-3 hover:brightness-110 hover:shadow-glow-sm active:scale-[0.97] transition-all duration-200"
              >
                Book a Call
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-[6px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/30 focus-visible:ring-offset-2 focus-visible:ring-offset-void rounded-lg"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              <span
                className={cn(
                  "block w-6 h-[2px] bg-ghost transition-all duration-300 origin-center",
                  mobileOpen && "translate-y-[4px] rotate-45"
                )}
              />
              <span
                className={cn(
                  "block w-6 h-[2px] bg-ghost transition-all duration-300",
                  mobileOpen && "opacity-0"
                )}
              />
              <span
                className={cn(
                  "block w-6 h-[2px] bg-ghost transition-all duration-300 origin-center",
                  mobileOpen && "-translate-y-[4px] -rotate-45"
                )}
              />
            </button>
          </div>
        </div>

        {/* Bottom border line (only when not scrolled, since scrolled state has its own border) */}
        {!scrolled && <div className="h-px w-full bg-ghost/[0.06]" />}
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-void z-50 flex flex-col"
          >
            {/* Mobile header with logo + close */}
            <div className="px-6">
              <div className="flex items-center justify-between py-4">
                <Link
                  href="/"
                  className="font-heading font-bold text-sm text-white uppercase tracking-[0.1em]"
                  onClick={() => setMobileOpen(false)}
                >
                  AYGENCY
                </Link>
                <button
                  className="relative w-8 h-8 flex flex-col items-center justify-center gap-[6px]"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                >
                  <span className="block w-6 h-[2px] bg-ghost translate-y-[4px] rotate-45 transition-all duration-300 origin-center" />
                  <span className="block w-6 h-[2px] bg-ghost opacity-0 transition-all duration-300" />
                  <span className="block w-6 h-[2px] bg-ghost -translate-y-[4px] -rotate-45 transition-all duration-300 origin-center" />
                </button>
              </div>
              <div className="h-px w-full bg-ghost/[0.06]" />
            </div>

            {/* Mobile links */}
            <div className="flex-1 flex flex-col items-center justify-center gap-8 px-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="text-center"
                >
                  <Link
                    href={link.href}
                    className="font-heading text-3xl text-ghost font-semibold uppercase"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                  {/* Sub-links for Services */}
                  {link.label === "Services" && (
                    <div className="flex flex-col gap-3 mt-4">
                      {services.map((service) => (
                        <Link
                          key={service.slug}
                          href={`/services/${service.slug}`}
                          className="text-lg text-ghost-muted hover:text-cyan transition-colors"
                          onClick={() => setMobileOpen(false)}
                        >
                          {service.shortTitle}
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: navLinks.length * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="mt-4 w-full max-w-xs"
              >
                <Link
                  href="/contact"
                  className="block w-full text-center bg-cyan text-void font-heading font-semibold text-[13px] uppercase tracking-[0.15em] rounded-lg px-8 py-4 hover:brightness-110 hover:shadow-glow-sm active:scale-[0.97] transition-all duration-200"
                >
                  Book a Call
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
