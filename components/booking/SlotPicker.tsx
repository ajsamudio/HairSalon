import { cn } from "@/lib/utils";
import { clientConfig } from "@/client.config";
import type { Slot } from "@/types/booking";
import BookingSkeleton from "./BookingSkeleton";

interface Props {
  slots: Slot[];
  loading: boolean;
  selected: Slot | null;
  onSelect: (slot: Slot) => void;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: clientConfig.business.timezone,
  });
}

export default function SlotPicker({ slots, loading, selected, onSelect }: Props) {
  if (loading) return <BookingSkeleton />;

  if (slots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
        <p className="text-ink font-medium">No availability on this date</p>
        <p className="text-ink-soft text-sm">Try picking a different date.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {slots.map((slot) => {
        const isSelected =
          selected?.starts_at === slot.starts_at;
        return (
          <button
            key={slot.starts_at}
            onClick={() => onSelect(slot)}
            className={cn(
              "w-full text-left rounded-xl border px-4 min-h-[56px] flex items-center justify-between transition-colors",
              isSelected
                ? "border-accent bg-accent/5 text-accent"
                : "border-line bg-bg text-ink hover:border-accent/50"
            )}
          >
            <span className="font-medium">{formatTime(slot.starts_at)}</span>
            {isSelected && (
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5 text-accent"
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
  );
}
