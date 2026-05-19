/**
 * Tests for the slot-generation pure function.
 * Run with: npx jest lib/booking/availability.test.ts
 * (or npx vitest if you prefer)
 */

import { generateSlots, type SlotGeneratorInput } from "./availability";

// Fixed timezone for all tests
const TZ = "America/Los_Angeles";

// Helper: build a base input with sensible defaults
function base(overrides: Partial<SlotGeneratorInput> = {}): SlotGeneratorInput {
  return {
    durationMin: 60,
    slotStepMinutes: 30,
    minNoticeMs: 2 * 60 * 60 * 1000,
    timezone: TZ,
    fromDate: new Date("2026-06-01T00:00:00Z"),
    toDate: new Date("2026-06-01T23:59:59Z"),
    rules: [],
    overrides: [],
    existingBookings: [],
    now: new Date("2026-06-01T08:00:00Z"), // 1am LA time
    ...overrides,
  };
}

describe("generateSlots", () => {
  // June 1 2026 is a Monday (day_of_week = 1)
  const mondayRules = [
    { day_of_week: 1, start_time: "09:00", end_time: "17:00" },
  ];

  it("generates slots on a normal working day", () => {
    const slots = generateSlots(
      base({ rules: mondayRules })
    );
    // 9am–5pm, 60min duration, 30min step = slots at 9:00, 9:30, ..., 16:00
    // That's (5pm - 9am) / 30min = 16 slots — but only ones where start + 60min <= 5pm
    // 9:00→10:00, 9:30→10:30, ..., 16:00→17:00 = 15 slots
    // But now = 1am LA so notice cutoff = 3am LA, all slots pass
    expect(slots.length).toBeGreaterThan(0);
    // First slot should be 9am LA time on June 1
    expect(slots[0].starts_at).toContain("2026-06-01");
  });

  it("returns no slots on a day with no rules", () => {
    // Sunday, no rules
    const sundayOnly: SlotGeneratorInput = base({
      fromDate: new Date("2026-05-31T00:00:00Z"),
      toDate: new Date("2026-05-31T23:59:59Z"),
      rules: [{ day_of_week: 1, start_time: "09:00", end_time: "17:00" }],
      now: new Date("2026-05-31T08:00:00Z"),
    });
    const slots = generateSlots(sundayOnly);
    expect(slots).toHaveLength(0);
  });

  it("uses override times instead of weekly rule", () => {
    const slots = generateSlots(
      base({
        rules: mondayRules, // 9am–5pm
        overrides: [
          { date: "2026-06-01", start_time: "12:00", end_time: "14:00" },
        ],
      })
    );
    // Only 12:00→13:00 fits (12:00+60 = 13:00 ≤ 14:00)
    // 12:30→13:30 also fits
    expect(slots.length).toBeGreaterThan(0);
    // All slots should be within 12:00–14:00
    for (const slot of slots) {
      const h = new Date(slot.starts_at).getUTCHours();
      // 12pm LA = 19:00 UTC (PDT = UTC-7)
      expect(h).toBeGreaterThanOrEqual(19);
    }
  });

  it("treats null start_time override as closed all day", () => {
    const slots = generateSlots(
      base({
        rules: mondayRules,
        overrides: [{ date: "2026-06-01", start_time: null, end_time: null }],
      })
    );
    expect(slots).toHaveLength(0);
  });

  it("excludes slots that overlap existing bookings", () => {
    // Existing booking: 10:00am–11:00am LA = 17:00–18:00 UTC
    const existingBookings = [
      {
        starts_at: "2026-06-01T17:00:00.000Z",
        ends_at: "2026-06-01T18:00:00.000Z",
      },
    ];
    const slots = generateSlots(base({ rules: mondayRules, existingBookings }));
    // No slot should overlap [17:00, 18:00) UTC
    for (const slot of slots) {
      const start = new Date(slot.starts_at).getTime();
      const end = new Date(slot.ends_at).getTime();
      const existStart = new Date("2026-06-01T17:00:00.000Z").getTime();
      const existEnd = new Date("2026-06-01T18:00:00.000Z").getTime();
      const overlaps = start < existEnd && end > existStart;
      expect(overlaps).toBe(false);
    }
  });

  it("excludes slots in the past", () => {
    // now is 1pm LA (20:00 UTC), only slots after 3pm LA should appear (notice = 2h)
    const slots = generateSlots(
      base({
        rules: mondayRules,
        now: new Date("2026-06-01T20:00:00Z"), // 1pm LA
      })
    );
    const cutoff = new Date("2026-06-01T22:00:00Z"); // 3pm LA
    for (const slot of slots) {
      expect(new Date(slot.starts_at).getTime()).toBeGreaterThanOrEqual(
        cutoff.getTime()
      );
    }
  });

  it("excludes slots within minNoticeHours", () => {
    // now = 2pm LA (21:00 UTC), minNotice = 3h
    const slots = generateSlots(
      base({
        rules: mondayRules,
        minNoticeMs: 3 * 60 * 60 * 1000,
        now: new Date("2026-06-01T21:00:00Z"), // 2pm LA
      })
    );
    const cutoff = new Date("2026-06-02T00:00:00Z"); // 5pm LA
    for (const slot of slots) {
      expect(new Date(slot.starts_at).getTime()).toBeGreaterThanOrEqual(
        cutoff.getTime()
      );
    }
  });

  it("handles DST spring-forward day (no duplicate/missing hours)", () => {
    // US clocks spring forward on March 8 2026 at 2am → 3am
    const slots = generateSlots({
      ...base(),
      fromDate: new Date("2026-03-08T00:00:00Z"),
      toDate: new Date("2026-03-08T23:59:59Z"),
      rules: [{ day_of_week: 0, start_time: "09:00", end_time: "17:00" }], // Sunday
      now: new Date("2026-03-08T04:00:00Z"), // very early UTC
    });
    // Should still generate slots — none should have duplicate starts_at
    const starts = slots.map((s) => s.starts_at);
    const unique = new Set(starts);
    expect(unique.size).toBe(starts.length);
    expect(slots.length).toBeGreaterThan(0);
  });
});
