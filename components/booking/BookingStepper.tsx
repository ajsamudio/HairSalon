import { cn } from "@/lib/utils";
import { BOOKING_STEPS, STEP_LABELS, type BookingStep } from "@/types/booking";

interface Props {
  currentStep: BookingStep;
}

export default function BookingStepper({ currentStep }: Props) {
  const currentIndex = BOOKING_STEPS.indexOf(currentStep);

  return (
    <nav aria-label="Booking steps" className="flex items-center gap-0">
      {BOOKING_STEPS.map((step, i) => {
        const isDone = i < currentIndex;
        const isCurrent = i === currentIndex;

        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors",
                  isDone
                    ? "bg-accent text-white"
                    : isCurrent
                    ? "bg-accent text-white"
                    : "bg-surface text-ink-soft border border-line"
                )}
              >
                {isDone ? (
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-3.5 h-3.5"
                    aria-hidden
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] mt-1 font-medium hidden sm:block",
                  isCurrent ? "text-accent" : "text-ink-soft"
                )}
              >
                {STEP_LABELS[step]}
              </span>
            </div>
            {i < BOOKING_STEPS.length - 1 && (
              <div
                className={cn(
                  "h-px w-6 sm:w-10 mx-1 transition-colors",
                  i < currentIndex ? "bg-accent" : "bg-line"
                )}
                aria-hidden
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
