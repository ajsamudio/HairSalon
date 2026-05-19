# BOOKING.md — Booking System Spec

Custom Next.js + Supabase + Stripe booking. Solo stylist. Mobile-first.
Matches the LGAthletics / Browsite pattern, simplified for one operator.

## High-level flow

```
Stylist (admin)                     Client (mobile)
─────────────────                   ──────────────────────
1. Magic-link login
2. Sets weekly availability
3. Adds blackout dates
                                    4. Visits site
                                    5. Taps Book Now → bottom sheet opens
                                    6. Picks service
                                    7. Picks open slot
                                    8. Enters name + email + phone
                                    9. Stripe Checkout (deposit)
                                    ──────────────────────
                                    Stripe webhook fires
                                    ──────────────────────
                                    10. Booking confirmed in DB
                                    11. Slot blocked
                                    12. Confirmation email sent
                                    13. Redirected to /booking/confirm
14. Booking visible in /admin
```

## Database schema (Supabase Postgres)

Solo-stylist scope. No `stylists` table, no `stylist_services` join.

```sql
-- services
create table services (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  name         text not null,
  description  text,
  category     text not null check (category in ('cuts','color','treatments','styling','extensions','add-ons')),
  duration_min integer not null,
  price_cents      integer not null,
  deposit_cents    integer not null default 0,
  requires_consult boolean default false,
  is_active        boolean default true,
  sort_order       integer default 0,
  created_at       timestamptz default now()
);

-- weekly recurring availability
create table availability_rules (
  id          uuid primary key default gen_random_uuid(),
  day_of_week integer not null check (day_of_week between 0 and 6), -- 0 = Sunday
  start_time  time not null,
  end_time    time not null,
  is_active   boolean default true,
  created_at  timestamptz default now()
);

-- specific date overrides (vacation, special hours, closed days)
create table availability_overrides (
  id         uuid primary key default gen_random_uuid(),
  date       date not null unique,
  start_time time, -- null = closed all day
  end_time   time,
  reason     text,
  created_at timestamptz default now()
);

-- bookings
create table bookings (
  id                    uuid primary key default gen_random_uuid(),
  service_id            uuid not null references services(id),
  customer_name         text not null,
  customer_email        text not null,
  customer_phone        text,
  starts_at             timestamptz not null,
  ends_at               timestamptz not null,
  status                text not null default 'pending'
                          check (status in ('pending','confirmed','cancelled','completed','no_show')),
  stripe_session_id     text,
  stripe_payment_intent text,
  deposit_paid_cents    integer default 0,
  notes                 text,
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

create index idx_bookings_starts_at on bookings(starts_at);
create index idx_bookings_status on bookings(status);

-- DB-level double-booking prevention
alter table bookings
  add constraint no_overlapping_bookings
  exclude using gist (
    tstzrange(starts_at, ends_at) with &&
  ) where (status in ('pending','confirmed'));
```

## RLS policies

```sql
alter table services enable row level security;
create policy "public read active services" on services
  for select using (is_active = true);
create policy "admin all services" on services
  for all using (auth.role() = 'authenticated');

alter table availability_rules enable row level security;
create policy "public read availability" on availability_rules
  for select using (is_active = true);
create policy "admin all availability" on availability_rules
  for all using (auth.role() = 'authenticated');

alter table availability_overrides enable row level security;
create policy "public read overrides" on availability_overrides
  for select using (true);
create policy "admin all overrides" on availability_overrides
  for all using (auth.role() = 'authenticated');

alter table bookings enable row level security;
create policy "admin all bookings" on bookings
  for all using (auth.role() = 'authenticated');
-- Public booking creation uses service-role key via Server Action
```

## Slot generation algorithm

`GET /api/availability?service_id=X&from=2026-05-20&to=2026-05-27`

```
1. Look up service.duration_min
2. For each day in [from, to]:
   a. Check availability_overrides for that date
      - If override has null start/end_time → day is closed, skip
      - If override has times → use those (skip weekly rule for this date)
   b. Else use availability_rules for that day_of_week
   c. For each [start_time, end_time] window:
      - Slice into slots of duration_min, stepping every slotStepMinutes (default 15)
      - Exclude slots overlapping existing pending/confirmed bookings
      - Exclude slots in the past
      - Exclude slots within minNoticeHours of now (default 2)
3. Return [{ starts_at, ends_at }, ...]
```

Config in `client.config.ts.booking`:
```ts
{
  minNoticeHours: 2,
  maxDaysAhead: 60,
  slotStepMinutes: 15,
  defaultDepositPercent: 25,
}
```

## Mobile UI specs

This is where most bookings actually happen. Design specifically for mobile.

### Bottom-sheet pattern
- On mobile (< 768px), the booking flow renders as a bottom sheet that slides up from the bottom of the viewport
- Sheet height: ~85vh (leaves a small backdrop visible above for context)
- Rounded top corners (16px radius)
- Drag handle at top (visual cue + tap to dismiss)
- Backdrop dimmed at `rgba(0,0,0,0.4)` — tap to close
- Bottom safe-area inset respected on iOS (`env(safe-area-inset-bottom)`)
- Background scroll locked while sheet is open

### Step layout in the sheet
1. **Service** — list of service cards, taller and easier to tap than the homepage version
2. **Date** — horizontal scrollable date picker (next 60 days, snap-to-day)
3. **Time** — slot list as full-width tappable rows, not a tight grid
4. **Details** — single-column form: name, email, phone (use `autocomplete` attributes for OS autofill)
5. **Confirm** — review summary + "Continue to Payment" button → opens Stripe Checkout

### Form field considerations
- Use native HTML5 input types so iOS keyboards adapt:
  - `inputmode="email"` on email
  - `inputmode="tel"` on phone
  - `autocomplete="name"`, `autocomplete="email"`, `autocomplete="tel"`
- All inputs ≥ 48px tall (avoids iOS zoom on focus when font-size ≥ 16px)
- Error messages below each input, not in a toast (easier to scan on mobile)

### Desktop layout (≥ 768px)
- Booking renders inline in the homepage `#book` section (no bottom sheet)
- Two-column: stepper + step content (60%) on left, persistent summary on right (40%)
- Full-page `/book` route is also available for direct linking

## Server Actions

### `createBooking(formData)` — public

```
1. Validate input with zod (service_id, slot_start, customer_*)
2. Re-check slot availability server-side
3. Insert booking with status='pending'
4. Compute deposit amount:
   - service.deposit_cents if > 0
   - Else defaultDepositPercent of price_cents
   - 0 → free consult (skip Stripe entirely, mark confirmed immediately)
5. If deposit > 0: create Stripe Checkout session with metadata { booking_id }
6. Store stripe_session_id on the booking
7. Return checkout URL → client redirects
```

### `cancelBooking(bookingId)` — admin

```
1. Verify admin auth
2. Mark booking status='cancelled'
3. Send simple cancellation email via Resend
4. Note: refund happens manually via Stripe dashboard in MVP
```

## Stripe webhook

`POST /api/webhooks/stripe`

```
1. Verify signature with STRIPE_WEBHOOK_SECRET
2. On `checkout.session.completed`:
   - Find booking by stripe_session_id
   - Update status='confirmed', deposit_paid_cents=amount_total
   - Send confirmation email via Resend
3. On `checkout.session.expired`:
   - Mark booking status='cancelled' → frees the slot
```

**Webhook is the source of truth.** The post-checkout redirect can fail or be closed early.

## Admin auth (Supabase magic link)

- Owner visits `/admin/login`
- Enters email — must match `client.config.ts.admin.allowedEmails`
- Supabase Auth emails the magic link
- Click → session created
- `/middleware.ts` protects `/admin/*` routes, verifies email against allowlist on every request

## Email templates (Resend)

### Booking confirmation
- Triggered: webhook `checkout.session.completed`
- Subject: `Your appointment is confirmed — {date} at {time}`
- Body: service name, date/time in salon timezone, address, cancellation policy, contact info
- Plain HTML — no fancy template. Mobile-readable.

### Cancellation
- Triggered: admin `cancelBooking()`
- Subject: `Your appointment has been cancelled`
- Body: brief, mentions refund will be processed

### Deferred (Later)
- `.ics` calendar attachment
- 24h reminder via Vercel Cron

## Edge cases

- **Double-booking attempts:** GIST exclusion constraint catches it at DB level; UI shows "slot just taken, pick another"
- **Stripe abandonment:** booking stays `pending`. Webhook `checkout.session.expired` (24h later) marks it cancelled and frees the slot
- **Daylight saving:** all times in UTC in DB, displayed in `client.config.ts.business.timezone`
- **Walk-ins:** admin can manually create bookings without Stripe step from `/admin/bookings/new`
- **Free consults:** `service.deposit_cents = 0` → skip Stripe, immediate confirmation

## Pre-launch testing (mobile-specific)

- [ ] Test booking end-to-end on a real iPhone in Safari
- [ ] Bottom sheet drags smoothly, can be dismissed by tapping backdrop or drag handle
- [ ] iOS keyboard appears for the right field type (email shows @ key, phone shows numpad)
- [ ] Form doesn't trigger iOS auto-zoom on focus (inputs ≥ 16px font-size)
- [ ] Stripe Checkout opens cleanly on mobile (test in iOS Safari + Chrome iOS)
- [ ] Webhook fires after test card payment
- [ ] Confirmation email arrives, reads correctly on iOS Mail
- [ ] Slot is blocked from being booked twice
- [ ] Date picker scrolls and snaps properly on mobile
- [ ] Bottom-safe area respected on iPhones with home indicator

## Deferred features (Later — paid upgrades)

| Feature | Why deferred |
|---|---|
| Multi-stylist support | Solo target — add `stylists` table later |
| SMS reminders | Twilio adds cost + complexity |
| .ics calendar attachments | Nice-to-have, not booking-blocking |
| Automated refund flow | Manual via Stripe dashboard fine for low volume |
| 24h reminder emails | Vercel Cron — defer until first client asks |
| Card-on-file for no-shows | Requires SetupIntent |
| Gift cards | Stripe-native but adds UI |
| Booking from IG bio link | Trivial deep link when needed |

## Build effort estimate

- Schema + migrations + RLS: 3-4h
- Slot generation + API route + tests: 4-6h
- Public booking components + bottom sheet: 12-16h
- Stripe Checkout + webhook: 6-8h
- Admin login + middleware: 2-3h
- Admin pages (availability + services + bookings): 12-16h
- Email template + Resend: 2-3h
- Mobile QA on real device: 4-6h

**Total: 45-62 hours** ≈ 1.5-2 weeks focused. 3-4 weeks spread over evenings.

Per-client deployment after template exists: 3-4 hours.
