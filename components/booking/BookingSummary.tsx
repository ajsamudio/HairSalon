import { clientConfig } from "@/client.config";
import { formatCents } from "@/lib/utils";
import type { BookingState } from "@/types/booking";

interface Props {
  state: BookingState;
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: clientConfig.business.timezone,
  });
}

export default function BookingSummary({ state }: Props) {
  const { service, slot } = state;

  if (!service) return null;

  const depositCents =
    service.deposit_cents > 0
      ? service.deposit_cents
      : Math.round(
          (service.price_cents * clientConfig.booking.defaultDepositPercent) / 100
        );

  return (
    <div className="rounded-xl border border-line bg-surface p-4 flex flex-col gap-3">
      <p className="text-xs font-semibold text-ink-soft uppercase tracking-wide">
        Booking summary
      </p>

      <div>
        <p className="font-semibold text-ink">{service.name}</p>
        <p className="text-sm text-ink-soft">
          {service.durationDisplay} · {service.priceDisplay}
        </p>
      </div>

      {slot && (
        <div className="border-t border-line pt-3">
          <p className="text-sm text-ink">{formatDateTime(slot.starts_at)}</p>
          <p className="text-xs text-ink-soft mt-0.5">
            {clientConfig.business.name}
          </p>
        </div>
      )}

      {service.deposit_cents > 0 || depositCents > 0 ? (
        <div className="border-t border-line pt-3 flex items-center justify-between">
          <span className="text-sm text-ink-soft">Deposit due now</span>
          <span className="font-semibold text-ink">
            {formatCents(depositCents)}
          </span>
        </div>
      ) : null}

      <p className="text-xs text-ink-soft">
        Remainder due at appointment. 24h cancellation policy.
      </p>
    </div>
  );
}
