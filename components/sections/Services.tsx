"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import ServiceCard from "./ServiceCard";
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
    <section id="services" aria-labelledby="services-heading" className="py-16 md:py-24">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-8">
          <h2 id="services-heading" className="font-heading text-3xl md:text-4xl font-bold text-ink mb-2">
            Services &amp; pricing
          </h2>
          <p className="text-ink-soft">Transparent pricing, no surprises. Final price confirmed at consultation.</p>
        </div>

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
                  "shrink-0 snap-start min-h-[44px] px-4 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                  activeCategory === cat
                    ? "bg-accent text-white"
                    : "bg-surface text-ink-soft border border-line hover:border-accent hover:text-accent"
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {visibleServices.map((service) => (
            <ServiceCard
              key={service.slug}
              service={service}
              badge={serviceBadges[service.slug]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
