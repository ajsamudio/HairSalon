"use client";

import { useState, useTransition } from "react";
import { Plus, X } from "lucide-react";
import {
  addAvailabilityRule,
  removeAvailabilityRule,
  addBlackoutDate,
  removeBlackoutDate,
} from "@/lib/actions/availability";
import type { AvailabilityRuleRow, AvailabilityOverrideRow } from "@/types/database";

const DAYS = [
  { label: "Sun", value: 0 },
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
];

function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")}${suffix}`;
}

interface AddHoursFormProps {
  dayOfWeek: number;
  onDone: () => void;
}

function AddHoursForm({ dayOfWeek, onDone }: AddHoursFormProps) {
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:00");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function submit() {
    startTransition(async () => {
      const result = await addAvailabilityRule({
        day_of_week: dayOfWeek,
        start_time: start,
        end_time: end,
      });
      if (result.error) {
        setError(result.error);
      } else {
        onDone();
      }
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mt-2">
      <input
        type="time"
        value={start}
        onChange={(e) => setStart(e.target.value)}
        className="border border-line rounded-lg px-2 py-1 text-sm min-h-[36px]"
      />
      <span className="text-ink-soft text-sm">to</span>
      <input
        type="time"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
        className="border border-line rounded-lg px-2 py-1 text-sm min-h-[36px]"
      />
      <button
        onClick={submit}
        disabled={pending}
        className="min-h-[36px] px-3 rounded-lg bg-accent text-white text-sm font-medium disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save"}
      </button>
      <button
        onClick={onDone}
        className="min-h-[36px] px-3 rounded-lg border border-line text-ink-soft text-sm"
      >
        Cancel
      </button>
      {error && <p className="w-full text-xs text-red-600">{error}</p>}
    </div>
  );
}

interface Props {
  rules: AvailabilityRuleRow[];
  overrides: AvailabilityOverrideRow[];
}

export default function AvailabilityEditor({ rules, overrides }: Props) {
  const [addingDay, setAddingDay] = useState<number | null>(null);
  const [removingId, startRemoveRule] = useTransition();
  const [removingOverrideId, startRemoveOverride] = useTransition();

  // Blackout form state
  const [showBlackoutForm, setShowBlackoutForm] = useState(false);
  const [blackoutDate, setBlackoutDate] = useState("");
  const [blackoutStart, setBlackoutStart] = useState("");
  const [blackoutEnd, setBlackoutEnd] = useState("");
  const [blackoutReason, setBlackoutReason] = useState("");
  const [blackoutError, setBlackoutError] = useState("");
  const [blackoutPending, startBlackoutTransition] = useTransition();

  function handleRemoveRule(id: string) {
    startRemoveRule(async () => {
      await removeAvailabilityRule(id);
    });
  }

  function handleRemoveOverride(id: string) {
    startRemoveOverride(async () => {
      await removeBlackoutDate(id);
    });
  }

  function submitBlackout() {
    if (!blackoutDate) {
      setBlackoutError("Date is required.");
      return;
    }
    startBlackoutTransition(async () => {
      const result = await addBlackoutDate({
        date: blackoutDate,
        start_time: blackoutStart || null,
        end_time: blackoutEnd || null,
        reason: blackoutReason || null,
      });
      if (result.error) {
        setBlackoutError(result.error);
      } else {
        setShowBlackoutForm(false);
        setBlackoutDate("");
        setBlackoutStart("");
        setBlackoutEnd("");
        setBlackoutReason("");
        setBlackoutError("");
      }
    });
  }

  const rulesByDay = DAYS.reduce<Record<number, AvailabilityRuleRow[]>>(
    (acc, d) => {
      acc[d.value] = rules.filter((r) => r.day_of_week === d.value);
      return acc;
    },
    {}
  );

  return (
    <div className="flex flex-col gap-10">
      {/* Weekly hours */}
      <section>
        <h2 className="text-base font-semibold text-ink mb-4">Weekly hours</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {DAYS.map((day) => (
            <div
              key={day.value}
              className="rounded-xl border border-line p-4 flex flex-col gap-2"
            >
              <p className="font-semibold text-sm text-ink">{day.label}</p>
              {rulesByDay[day.value].length === 0 && (
                <p className="text-xs text-ink-soft">Closed</p>
              )}
              {rulesByDay[day.value].map((rule) => (
                <div key={rule.id} className="flex items-center justify-between gap-2">
                  <span className="text-sm text-ink">
                    {formatTime(rule.start_time)} – {formatTime(rule.end_time)}
                  </span>
                  <button
                    onClick={() => handleRemoveRule(rule.id)}
                    disabled={removingId}
                    aria-label={`Remove ${formatTime(rule.start_time)}–${formatTime(rule.end_time)}`}
                    className="min-h-[32px] min-w-[32px] flex items-center justify-center text-ink-soft hover:text-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" aria-hidden />
                  </button>
                </div>
              ))}
              {addingDay === day.value ? (
                <AddHoursForm
                  dayOfWeek={day.value}
                  onDone={() => setAddingDay(null)}
                />
              ) : (
                <button
                  onClick={() => setAddingDay(day.value)}
                  className="flex items-center gap-1 text-xs text-accent font-medium min-h-[32px] hover:underline"
                >
                  <Plus className="w-3 h-3" aria-hidden /> Add hours
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Blackout dates */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-ink">Blackout dates</h2>
          {!showBlackoutForm && (
            <button
              onClick={() => setShowBlackoutForm(true)}
              className="flex items-center gap-1 text-sm text-accent font-medium min-h-[36px] px-3 rounded-lg border border-accent hover:bg-accent/5 transition-colors"
            >
              <Plus className="w-4 h-4" aria-hidden /> Add date
            </button>
          )}
        </div>

        {showBlackoutForm && (
          <div className="rounded-xl border border-line p-4 mb-4 flex flex-col gap-3">
            <p className="text-sm font-medium text-ink">Add blackout date</p>
            <div className="flex flex-wrap gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-ink-soft">Date *</label>
                <input
                  type="date"
                  value={blackoutDate}
                  onChange={(e) => setBlackoutDate(e.target.value)}
                  className="border border-line rounded-lg px-3 py-2 text-sm min-h-[40px]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-ink-soft">Start time (optional)</label>
                <input
                  type="time"
                  value={blackoutStart}
                  onChange={(e) => setBlackoutStart(e.target.value)}
                  className="border border-line rounded-lg px-3 py-2 text-sm min-h-[40px]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-ink-soft">End time (optional)</label>
                <input
                  type="time"
                  value={blackoutEnd}
                  onChange={(e) => setBlackoutEnd(e.target.value)}
                  className="border border-line rounded-lg px-3 py-2 text-sm min-h-[40px]"
                />
              </div>
              <div className="flex flex-col gap-1 flex-1 min-w-[160px]">
                <label className="text-xs text-ink-soft">Reason (optional)</label>
                <input
                  type="text"
                  value={blackoutReason}
                  onChange={(e) => setBlackoutReason(e.target.value)}
                  placeholder="e.g. Vacation"
                  className="border border-line rounded-lg px-3 py-2 text-sm min-h-[40px]"
                />
              </div>
            </div>
            <p className="text-xs text-ink-soft">
              Leave start/end blank to block the entire day.
            </p>
            {blackoutError && (
              <p className="text-xs text-red-600">{blackoutError}</p>
            )}
            <div className="flex gap-2">
              <button
                onClick={submitBlackout}
                disabled={blackoutPending}
                className="min-h-[40px] px-4 rounded-lg bg-accent text-white text-sm font-medium disabled:opacity-60"
              >
                {blackoutPending ? "Saving…" : "Save"}
              </button>
              <button
                onClick={() => setShowBlackoutForm(false)}
                className="min-h-[40px] px-4 rounded-lg border border-line text-ink-soft text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {overrides.length === 0 ? (
          <p className="text-sm text-ink-soft py-4 border border-line rounded-xl px-4">
            No upcoming blackout dates.
          </p>
        ) : (
          <div className="rounded-xl border border-line overflow-hidden">
            {overrides.map((o, i) => (
              <div
                key={o.id}
                className={`flex items-center justify-between gap-4 px-4 py-3 ${
                  i !== 0 ? "border-t border-line" : ""
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-ink">{o.date}</p>
                  <p className="text-xs text-ink-soft">
                    {o.start_time && o.end_time
                      ? `${formatTime(o.start_time)} – ${formatTime(o.end_time)}`
                      : "Closed all day"}
                    {o.reason ? ` · ${o.reason}` : ""}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveOverride(o.id)}
                  disabled={removingOverrideId}
                  aria-label={`Remove blackout on ${o.date}`}
                  className="min-h-[40px] min-w-[40px] flex items-center justify-center text-ink-soft hover:text-red-600 transition-colors"
                >
                  <X className="w-4 h-4" aria-hidden />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
