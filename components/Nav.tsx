"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { clientConfig } from "@/client.config";

const NAV_LINKS = [
  { href: "#services", label: "Services" },
  { href: "#gallery", label: "Gallery" },
  { href: "#about", label: "About" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when overlay is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 h-14 md:h-[72px] transition-colors duration-300",
          scrolled || menuOpen
            ? "bg-bg/95 backdrop-blur-sm border-b border-line"
            : "bg-transparent"
        )}
      >
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 h-full flex items-center justify-between gap-4">
          {/* Logo */}
          <a
            href="/"
            className="font-heading font-bold text-lg md:text-xl text-ink shrink-0 min-h-[44px] flex items-center"
            aria-label={`${clientConfig.business.name} home`}
          >
            {clientConfig.business.name}
          </a>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-ink-soft hover:text-ink transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Book Now */}
          <a
            href="#book"
            className="hidden md:inline-flex items-center justify-center min-h-[44px] px-5 rounded-brand bg-accent text-white font-semibold text-sm transition-all hover:brightness-90 active:scale-[0.98]"
          >
            Book Now
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-ink"
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
          >
            <Menu className="w-6 h-6" aria-hidden />
          </button>
        </div>
      </header>

      {/* Full-screen mobile overlay */}
      {menuOpen && (
        <div
          role="dialog"
          aria-label="Navigation menu"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-bg flex flex-col"
        >
          {/* Close button */}
          <div className="flex items-center justify-between h-14 px-4 border-b border-line">
            <a
              href="/"
              className="font-heading font-bold text-lg text-ink"
              onClick={() => setMenuOpen(false)}
            >
              {clientConfig.business.name}
            </a>
            <button
              onClick={() => setMenuOpen(false)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-ink"
              aria-label="Close navigation menu"
            >
              <X className="w-6 h-6" aria-hidden />
            </button>
          </div>

          {/* Links */}
          <nav className="flex flex-col flex-1 px-4 py-6 gap-1" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-heading text-2xl font-semibold text-ink py-3 border-b border-line hover:text-accent transition-colors min-h-[56px] flex items-center"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA at bottom */}
          <div className="p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <a
              href="#book"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center w-full min-h-[56px] rounded-brand bg-accent text-white font-semibold text-base"
            >
              Book Now
            </a>
          </div>
        </div>
      )}
    </>
  );
}
