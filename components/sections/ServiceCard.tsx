import { cn } from "@/lib/utils";
import type { ServiceWithDisplay, ServiceBadge } from "@/content/services";

interface ServiceCardProps {
  service: ServiceWithDisplay;
  badge?: ServiceBadge;
}

export default function ServiceCard({ service, badge }: ServiceCardProps) {
  return (
    <article className="relative bg-surface rounded-brand p-4 flex flex-col gap-3 border border-line">
      {/* Badge */}
      {badge && (
        <span
          className={cn(
            "absolute top-3 right-3 text-[11px] font-semibold px-2 py-0.5 rounded-full",
            badge === "Most Booked"
              ? "bg-accent text-white"
              : badge === "Consult Required"
                ? "bg-ink text-white"
                : "bg-accent-2 text-ink"
          )}
        >
          {badge}
        </span>
      )}

      {/* Name */}
      <h3 className="font-heading font-semibold text-ink text-base leading-snug pr-24">
        {service.name}
      </h3>

      {/* Description */}
      <p className="text-ink-soft text-sm leading-relaxed">{service.description}</p>

      {/* Meta row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs bg-line text-ink-soft rounded-full px-2.5 py-1">
          {service.durationDisplay}
        </span>
        <span className="text-sm font-semibold text-ink">{service.priceDisplay}</span>
      </div>

      {/* Book button */}
      <a
        href={`#book?service=${service.slug}`}
        className="mt-auto inline-flex items-center justify-center min-h-[44px] rounded-brand border border-accent text-accent font-semibold text-sm transition-colors hover:bg-accent hover:text-white active:scale-[0.98]"
      >
        Book
      </a>
    </article>
  );
}
