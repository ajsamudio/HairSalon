import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { clientConfig } from "@/client.config";

interface Props {
  selectedDate: string | null; // "YYYY-MM-DD"
  onSelect: (date: string) => void;
  maxDaysAhead?: number;
}

function toLocalDateStr(d: Date, tz: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export default function DatePicker({
  selectedDate,
  onSelect,
  maxDaysAhead = 60,
}: Props) {
  const tz = clientConfig.business.timezone;
  const scrollRef = useRef<HTMLDivElement>(null);

  // Build array of next maxDaysAhead dates
  const dates: { dateStr: string; label: string; dayName: string }[] = [];
  const today = new Date();

  for (let i = 0; i < maxDaysAhead; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const dateStr = toLocalDateStr(d, tz);
    const [, , day] = dateStr.split("-");
    const dayName = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      weekday: "short",
    }).format(d);
    const monthLabel = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      month: "short",
    }).format(d);
    const label = i === 0 ? "Today" : i === 1 ? "Tmw" : `${monthLabel} ${parseInt(day)}`;
    dates.push({ dateStr, label, dayName });
  }

  // Auto-scroll selected date into view
  useEffect(() => {
    if (!selectedDate || !scrollRef.current) return;
    const el = scrollRef.current.querySelector(
      `[data-date="${selectedDate}"]`
    ) as HTMLElement | null;
    el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [selectedDate]);

  return (
    <div
      ref={scrollRef}
      className="flex gap-2 overflow-x-auto pb-1 snap-x scrollbar-none -mx-4 px-4"
      role="listbox"
      aria-label="Select a date"
    >
      {dates.map(({ dateStr, label, dayName }) => {
        const isSelected = dateStr === selectedDate;
        return (
          <button
            key={dateStr}
            role="option"
            aria-selected={isSelected}
            data-date={dateStr}
            onClick={() => onSelect(dateStr)}
            className={cn(
              "shrink-0 snap-start flex flex-col items-center justify-center rounded-xl min-w-[60px] min-h-[72px] gap-0.5 transition-colors border",
              isSelected
                ? "bg-accent text-white border-accent"
                : "bg-surface text-ink border-line hover:border-accent/50"
            )}
          >
            <span
              className={cn(
                "text-[10px] font-medium",
                isSelected ? "text-white/80" : "text-ink-soft"
              )}
            >
              {dayName}
            </span>
            <span className="text-base font-bold leading-none">
              {label.split(" ")[1] ?? label}
            </span>
            {label !== "Today" && label !== "Tmw" && (
              <span
                className={cn(
                  "text-[9px]",
                  isSelected ? "text-white/70" : "text-ink-soft"
                )}
              >
                {label.split(" ")[0]}
              </span>
            )}
            {(label === "Today" || label === "Tmw") && (
              <span
                className={cn(
                  "text-[10px] font-medium",
                  isSelected ? "text-white/80" : "text-accent"
                )}
              >
                {label}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
