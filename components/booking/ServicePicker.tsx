"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  categoryOrder,
  categoryLabels,
  servicesByCategory,
  type ServiceWithDisplay,
} from "@/content/services";
import type { ServiceCategory } from "@/types/database";

interface Props {
  selected: ServiceWithDisplay | null;
  onSelect: (service: ServiceWithDisplay) => void;
}

export default function ServicePicker({ selected, onSelect }: Props) {
  // Open the category that contains the selected service, if any. Otherwise all closed.
  const initialOpen: ServiceCategory | null =
    (selected?.category as ServiceCategory | undefined) ?? null;
  const [openCat, setOpenCat] = useState<ServiceCategory | null>(initialOpen);

  return (
    <div className="flex flex-col gap-2">
      {categoryOrder.map((cat) => {
        const services = (servicesByCategory[cat] ?? []).filter((s) => s.is_active);
        if (!services.length) return null;

        const isOpen = openCat === cat;
        const count = services.length;
        const containsSelected = services.some((s) => s.id === selected?.id);

        return (
          <div
            key={cat}
            className={cn(
              "rounded-xl border bg-bg overflow-hidden transition-colors",
              containsSelected ? "border-accent" : "border-line"
            )}
          >
            <button
              type="button"
              onClick={() => setOpenCat(isOpen ? null : cat)}
              aria-expanded={isOpen}
              className="w-full min-h-[56px] flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-accent/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="font-semibold text-ink text-sm">
                  {categoryLabels[cat]}
                </span>
                <span className="text-xs text-ink-soft bg-accent-2/60 rounded-full px-2 py-0.5">
                  {count}
                </span>
                {containsSelected && selected && (
                  <span className="text-xs text-accent font-medium truncate max-w-[140px]">
                    · {selected.name}
                  </span>
                )}
              </div>
              <ChevronDown
                className={cn(
                  "w-5 h-5 text-ink-soft shrink-0 transition-transform duration-200",
                  isOpen && "rotate-180"
                )}
                aria-hidden
              />
            </button>

            <div
              className={cn(
                "grid transition-all duration-300 ease-out",
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <div className="flex flex-col gap-2 p-3 pt-1 border-t border-line">
                  {services.map((service) => {
                    const isSelected = selected?.id === service.id;
                    return (
                      <button
                        key={service.id}
                        onClick={() => onSelect(service)}
                        className={cn(
                          "w-full text-left rounded-lg border px-4 py-3 min-h-[60px] flex items-center justify-between gap-3 transition-colors",
                          isSelected
                            ? "border-accent bg-accent/5"
                            : "border-line bg-bg hover:border-accent/50"
                        )}
                      >
                        <div className="flex-1">
                          <p
                            className={cn(
                              "font-medium text-sm",
                              isSelected ? "text-accent" : "text-ink"
                            )}
                          >
                            {service.name}
                          </p>
                          <p className="text-xs text-ink-soft mt-0.5">
                            {service.durationDisplay} · {service.priceDisplay}
                          </p>
                        </div>
                        {isSelected && (
                          <svg
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-5 h-5 text-accent shrink-0"
                            aria-hidden
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
