/**
 * Pure slot-generation function — no DB calls, fully testable.
 *
 * Given a service, a date range, and pre-fetched DB state, returns all
 * open booking slots as { starts_at, ends_at } pairs (UTC ISO strings).
 */

export interface AvailabilityRule {
  day_of_week: number; // 0 = Sunday
  start_time: string;  // "HH:MM" or "HH:MM:SS"
  end_time: string;
}

export interface AvailabilityOverride {
  date: string;        // "YYYY-MM-DD"
  start_time: string | null;
  end_time: string | null;
}

export interface ExistingBooking {
  starts_at: string;   // ISO
  ends_at: string;     // ISO
}

export interface SlotGeneratorInput {
  durationMin: number;
  slotStepMinutes: number;
  minNoticeMs: number;       // e.g. 2 * 60 * 60 * 1000
  timezone: string;          // e.g. "America/Los_Angeles"
  fromDate: Date;            // start of range (inclusive)
  toDate: Date;              // end of range (inclusive)
  rules: AvailabilityRule[];
  overrides: AvailabilityOverride[];
  existingBookings: ExistingBooking[];
  now?: Date;                // injectable for testing
}

export interface Slot {
  starts_at: string; // ISO UTC
  ends_at: string;   // ISO UTC
}

/** Parse "HH:MM" or "HH:MM:SS" to { hours, minutes }. */
function parseTime(t: string): { hours: number; minutes: number } {
  const [h, m] = t.split(":").map(Number);
  return { hours: h, minutes: m };
}

/**
 * Given a local YYYY-MM-DD date string and an HH:MM time,
 * return a UTC Date object using the given IANA timezone.
 */
function localToUTC(dateStr: string, timeStr: string, tz: string): Date {
  const { hours, minutes } = parseTime(timeStr);
  // Build an ISO-looking string in the target timezone then let
  // Intl.DateTimeFormat do the UTC math.
  // We use a trick: format a UTC date as local time in tz until we find one
  // that matches, but the simpler path is to use Date.parse with a manually
  // constructed offset. Instead, we rely on the browser/node Intl support.
  //
  // Reliable approach: format the UTC epoch 0 in the target timezone to get
  // the offset, then apply it. But more robust: use a reference Date in the
  // target timezone by constructing it from parts.
  //
  // Simplest correct approach for Node 18+:
  const [year, month, day] = dateStr.split("-").map(Number);
  // Create a date string that Intl can resolve by iterating
  // We build a Date at UTC midnight and adjust by the tz offset.
  const approxUTC = new Date(
    Date.UTC(year, month - 1, day, hours, minutes)
  );
  // Get what local time this UTC instant is in the target tz
  const localParts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(approxUTC);

  const get = (type: string) =>
    Number(localParts.find((p) => p.type === type)?.value ?? "0");

  const localH = get("hour");
  const localM = get("minute");

  // Compute the offset difference
  const wantedMinutes = hours * 60 + minutes;
  const gotMinutes = localH * 60 + localM;
  const diffMs = (wantedMinutes - gotMinutes) * 60_000;

  return new Date(approxUTC.getTime() + diffMs);
}

/** Clamp a Date to the start of its local day in the given timezone. */
function localDayStart(dateStr: string, tz: string): Date {
  return localToUTC(dateStr, "00:00", tz);
}

/** Format a UTC Date to "YYYY-MM-DD" in the given timezone. */
function toLocalDateStr(d: Date, tz: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

/** Get the day-of-week (0=Sun) of a YYYY-MM-DD string in a given timezone. */
function localDayOfWeek(dateStr: string, tz: string): number {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(Date.UTC(year, month - 1, day, 12)); // noon UTC avoids edge
  const localParts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "short",
  }).formatToParts(d);
  const dayName = localParts.find((p) => p.type === "weekday")?.value;
  const map: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };
  return map[dayName ?? "Sun"] ?? 0;
}

export function generateSlots(input: SlotGeneratorInput): Slot[] {
  const {
    durationMin,
    slotStepMinutes,
    minNoticeMs,
    timezone,
    fromDate,
    toDate,
    rules,
    overrides,
    existingBookings,
    now = new Date(),
  } = input;

  const cutoff = new Date(now.getTime() + minNoticeMs);
  const durationMs = durationMin * 60_000;
  const stepMs = slotStepMinutes * 60_000;

  // Pre-build override lookup: date string → override
  const overrideMap = new Map<string, AvailabilityOverride>();
  for (const o of overrides) {
    overrideMap.set(o.date, o);
  }

  // Pre-build existing booking intervals as ms pairs
  const busyIntervals = existingBookings.map((b) => ({
    start: new Date(b.starts_at).getTime(),
    end: new Date(b.ends_at).getTime(),
  }));

  const slots: Slot[] = [];

  // Enumerate every local date in [fromDate, toDate]
  // Walk day-by-day using UTC midnight + tz normalization
  const rangeStart = new Date(fromDate);
  rangeStart.setUTCHours(0, 0, 0, 0);
  const rangeEnd = new Date(toDate);
  rangeEnd.setUTCHours(23, 59, 59, 999);

  // Iterate local calendar dates
  let current = new Date(rangeStart);

  while (current <= rangeEnd) {
    const dateStr = toLocalDateStr(current, timezone);
    const dowLocal = localDayOfWeek(dateStr, timezone);

    // Determine windows for this day
    let windows: { start: string; end: string }[] = [];

    if (overrideMap.has(dateStr)) {
      const ovr = overrideMap.get(dateStr)!;
      if (ovr.start_time === null || ovr.end_time === null) {
        // Closed all day — skip
        current = new Date(current.getTime() + 24 * 60 * 60_000);
        continue;
      }
      windows = [{ start: ovr.start_time, end: ovr.end_time }];
    } else {
      // Use weekly rules matching this day_of_week
      const dayRules = rules.filter((r) => r.day_of_week === dowLocal);
      if (dayRules.length === 0) {
        current = new Date(current.getTime() + 24 * 60 * 60_000);
        continue;
      }
      windows = dayRules.map((r) => ({ start: r.start_time, end: r.end_time }));
    }

    // Generate slots from each window
    for (const w of windows) {
      const windowStart = localToUTC(dateStr, w.start, timezone).getTime();
      const windowEnd = localToUTC(dateStr, w.end, timezone).getTime();

      let slotStart = windowStart;
      while (slotStart + durationMs <= windowEnd) {
        const slotEnd = slotStart + durationMs;

        // Must be beyond the notice cutoff
        if (slotStart < cutoff.getTime()) {
          slotStart += stepMs;
          continue;
        }

        // Must not overlap any existing booking
        const overlaps = busyIntervals.some(
          (b) => slotStart < b.end && slotEnd > b.start
        );

        if (!overlaps) {
          slots.push({
            starts_at: new Date(slotStart).toISOString(),
            ends_at: new Date(slotEnd).toISOString(),
          });
        }

        slotStart += stepMs;
      }
    }

    // Advance to next calendar day (add 25h to handle DST spring-forward)
    current = new Date(current.getTime() + 25 * 60 * 60_000);
    // Re-normalize to midnight UTC of the next local date
    const nextDateStr = toLocalDateStr(current, timezone);
    current = localDayStart(nextDateStr, timezone);
  }

  return slots;
}
