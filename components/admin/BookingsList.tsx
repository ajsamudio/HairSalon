"use client";

import { useState, useTransition } from "react";
import { X } from "lucide-react";
import { cancelBooking } from "@/lib/actions/bookings";
import { formatCents } from "@/lib/utils";
import type { BookingWithService } from "@/app/admin/bookings/page";
import { clientConfig } from "@/client.config";

type Filter = "upcoming" | "past" | "all";

const STATUS_BADGE: Record<string, string> = {
  confirmed: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  cancelled: "bg-gray-100 text-gray-500",
  completed: "bg-blue-100 text-blue-800",
  no_show: "bg-red-100 text-red-800",
};

function formatDateTime(iso: string, tz: string) {
  return new Date(iso).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: tz,
  });
}

interface Props {
  bookings: BookingWithService[];
}

export default function BookingsList({ bookings }: Props) {
  const [filter, setFilter] = useState<Filter>("upcoming");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState("");
  const [cancelling, startCancel] = useTransition();

  const tz = clientConfig.business.timezone;
  const now = new Date();

  const filtered = bookings.filter((b) => {
    if (filter === "upcoming") return new Date(b.starts_at) >= now;
    if (filter === "past") return new Date(b.starts_at) < now;
    return true;
  });

  const selected = bookings.find((b) => b.id === selectedId) ?? null;

  function handleCancel(id: string) {
    setCancelError("");
    startCancel(async () => {
      const result = await cancelBooking(id);
      if (result.error) {
        setCancelError(result.error);
      } else {
        setSelectedId(null);
      }
    });
  }

  const FILTERS: { value: Filter; label: string }[] = [
    { value: "upcoming", label: "Upcoming" },
    { value: "past", label: "Past" },
    { value: "all", label: "All" },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Filter tabs */}
      <div className="flex gap-2" role="tablist">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            role="tab"
            aria-selected={filter === f.value}
            onClick={() => setFilter(f.value)}
            className={`min-h-[40px] px-4 rounded-full text-sm font-medium transition-colors ${
              filter === f.value
                ? "bg-accent text-white"
                : "bg-surface text-ink-soft border border-line hover:border-accent hover:text-accent"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Booking rows */}
      {filtered.length === 0 ? (
        <p className="text-sm text-ink-soft py-4 border border-line rounded-xl px-4">
          No {filter === "all" ? "" : filter} bookings.
        </p>
      ) : (
        <div className="rounded-xl border border-line overflow-hidden">
          {filtered.map((b, i) => (
            <button
              key={b.id}
              onClick={() => setSelectedId(b.id)}
              className={`w-full flex items-center justify-between gap-4 px-4 py-3 text-left hover:bg-surface transition-colors ${
                i !== 0 ? "border-t border-line" : ""
              } ${selectedId === b.id ? "bg-surface" : ""}`}
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-ink text-sm">{b.customer_name}</p>
                <p className="text-xs text-ink-soft truncate">
                  {b.service_name} · {formatDateTime(b.starts_at, tz)}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {b.deposit_paid_cents > 0 && (
                  <span className="text-xs text-ink-soft hidden sm:block">
                    {formatCents(b.deposit_paid_cents)} dep.
                  </span>
                )}
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_BADGE[b.status] ?? STATUS_BADGE.cancelled}`}
                >
                  {b.status}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Detail drawer */}
      {selected && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-30"
            onClick={() => setSelectedId(null)}
            aria-hidden
          />
          <aside className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-bg z-40 shadow-xl flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-line">
              <h2 className="font-semibold text-ink">Booking details</h2>
              <button
                onClick={() => setSelectedId(null)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-ink-soft hover:text-ink"
                aria-label="Close"
              >
                <X className="w-5 h-5" aria-hidden />
              </button>
            </div>

            <div className="flex-1 px-5 py-5 flex flex-col gap-4">
              <div>
                <p className="text-xs text-ink-soft mb-1">Client</p>
                <p className="font-medium text-ink">{selected.customer_name}</p>
                <p className="text-sm text-ink-soft">{selected.customer_email}</p>
                {selected.customer_phone && (
                  <a
                    href={`tel:${selected.customer_phone.replace(/\D/g, "")}`}
                    className="text-sm text-accent"
                  >
                    {selected.customer_phone}
                  </a>
                )}
              </div>
              <div>
                <p className="text-xs text-ink-soft mb-1">Service</p>
                <p className="font-medium text-ink">{selected.service_name ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-ink-soft mb-1">Date & time</p>
                <p className="font-medium text-ink">
                  {formatDateTime(selected.starts_at, tz)}
                </p>
                <p className="text-sm text-ink-soft">
                  Ends: {formatDateTime(selected.ends_at, tz)}
                </p>
              </div>
              <div>
                <p className="text-xs text-ink-soft mb-1">Status</p>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_BADGE[selected.status] ?? STATUS_BADGE.cancelled}`}
                >
                  {selected.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-ink-soft mb-1">Deposit paid</p>
                <p className="font-medium text-ink">
                  {selected.deposit_paid_cents > 0
                    ? formatCents(selected.deposit_paid_cents)
                    : "None"}
                </p>
              </div>
              {selected.notes && (
                <div>
                  <p className="text-xs text-ink-soft mb-1">Notes</p>
                  <p className="text-sm text-ink">{selected.notes}</p>
                </div>
              )}
            </div>

            {selected.status !== "cancelled" && selected.status !== "completed" && (
              <div className="px-5 py-4 border-t border-line">
                {cancelError && (
                  <p className="text-xs text-red-600 mb-2">{cancelError}</p>
                )}
                <p className="text-xs text-ink-soft mb-3">
                  Cancelling will not automatically refund the deposit — process any
                  refunds in the Stripe dashboard.
                </p>
                <button
                  onClick={() => handleCancel(selected.id)}
                  disabled={cancelling}
                  className="min-h-[44px] w-full rounded-xl border border-red-300 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-60"
                >
                  {cancelling ? "Cancelling…" : "Cancel booking"}
                </button>
              </div>
            )}
          </aside>
        </>
      )}
    </div>
  );
}
