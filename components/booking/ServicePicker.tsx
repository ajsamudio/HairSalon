import { cn } from "@/lib/utils";
import { categoryOrder, categoryLabels, servicesByCategory, type ServiceWithDisplay } from "@/content/services";

interface Props {
  selected: ServiceWithDisplay | null;
  onSelect: (service: ServiceWithDisplay) => void;
}

export default function ServicePicker({ selected, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-6">
      {categoryOrder.map((cat) => {
        const services = servicesByCategory[cat];
        if (!services?.length) return null;
        return (
          <div key={cat}>
            <h3 className="text-xs font-semibold text-ink-soft uppercase tracking-wide mb-2 px-1">
              {categoryLabels[cat]}
            </h3>
            <div className="flex flex-col gap-2">
              {services
                .filter((s) => s.is_active)
                .map((service) => {
                  const isSelected = selected?.id === service.id;
                  return (
                    <button
                      key={service.id}
                      onClick={() => onSelect(service)}
                      className={cn(
                        "w-full text-left rounded-xl border px-4 py-3 min-h-[64px] flex items-center justify-between gap-3 transition-colors",
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
        );
      })}
    </div>
  );
}
