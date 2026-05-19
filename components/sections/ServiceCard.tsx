import { cn } from "@/lib/utils";
import type { ServiceWithDisplay, ServiceBadge } from "@/content/services";

interface ServiceCardProps {
  service: ServiceWithDisplay;
  badge?: ServiceBadge;
}

export default function ServiceCard({ service, badge }: ServiceCardProps) {
  return (
    <article className="relative bg-white/70 backdrop-blur-sm rounded-brand p-5 flex flex-col gap-3 border border-accent-2 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-accent transition-all duration-300 h-full">
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
      <h3 className="font-heading font-semibold text-ink text-xl leading-snug pr-24">
        {service.name}
      </h3>

      {/* Description */}
      <p className="text-ink-soft text-sm leading-relaxed">{service.description}</p>

      {/* Meta row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs bg-accent-2/70 text-ink rounded-full px-3 py-1 font-medium">
          {service.durationDisplay}
        </span>
        <span className="text-base font-semibold text-accent ml-auto">{service.priceDisplay}</span>
      </div>

      {/* Book button */}
      <a
        href={`#book?service=${service.slug}`}
        className="mt-auto inline-flex items-center justify-center min-h-[44px] rounded-brand bg-accent/10 border border-accent text-accent font-semibold text-sm transition-all hover:bg-accent hover:text-white active:scale-[0.98]"
      >
        Book
      </a>
    </article>
  );
}
