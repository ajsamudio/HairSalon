"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import ServiceCard from "./ServiceCard";
import Reveal from "@/components/Reveal";
import {
  categoryOrder,
  categoryLabels,
  servicesByCategory,
  serviceBadges,
} from "@/content/services";
import type { ServiceCategory } from "@/types/database";

export default function Services() {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>("cuts");

  const visibleServices = servicesByCategory[activeCategory] ?? [];

  return (
    <section id="services" aria-labelledby="services-heading" className="py-20 md:py-28 relative overflow-hidden">
      <div className="blob" style={{ width: 360, height: 360, background: "#F6D6E0", top: -80, right: -100 }} aria-hidden />
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 relative">
        {/* Heading */}
        <Reveal className="mb-10 text-center">
          <p className="text-accent font-medium tracking-wide uppercase text-xs mb-3">
            The Menu
          </p>
          <h2
            id="services-heading"
            className="font-heading text-4xl md:text-5xl font-medium italic text-ink mb-3"
          >
            Services &amp; pricing
          </h2>
          <p className="text-ink-soft max-w-md mx-auto">
            Transparent pricing, no surprises. Final price confirmed at your consultation.
          </p>
        </Reveal>

        {/* Category tabs — horizontal scroll on mobile, wrap on desktop */}
        <div
          className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-none snap-x"
          role="tablist"
          aria-label="Service categories"
        >
          {categoryOrder.map((cat) => {
            if (!servicesByCategory[cat]?.length) return null;
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "shrink-0 snap-start min-h-[44px] px-5 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                  activeCategory === cat
                    ? "bg-accent text-white shadow-md shadow-accent/30 scale-[1.02]"
                    : "bg-white/70 text-ink-soft border border-accent-2 hover:border-accent hover:text-accent"
                )}
              >
                {categoryLabels[cat]}
              </button>
            );
          })}
        </div>

        {/* Service cards grid */}
        <div
          role="tabpanel"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {visibleServices.map((service, i) => (
            <Reveal
              key={service.slug}
              delay={(((i % 3) + 1) as 1 | 2 | 3)}
            >
              <ServiceCard
                service={service}
                badge={serviceBadges[service.slug]}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
