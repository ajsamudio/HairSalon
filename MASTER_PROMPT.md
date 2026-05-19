# MASTER_PROMPT.md — Build Sequence for Claude Code

> Paste these prompts into Claude Code in order. Use `/model opusplan` so Opus plans and Sonnet executes.
> Build time: ~1.5-2 weeks focused. 3-4 weeks spread over evenings.

## Before you start

Create these accounts (do this manually, not via Claude Code):

1. **Supabase project** (supabase.com, free tier) — note the project URL, anon key, service role key
2. **Stripe account** (stripe.com, test mode) — note the publishable key, secret key. Webhook secret comes later.
3. **Resend account** (resend.com, free tier) — note the API key. Use their default sending domain for testing.
4. **GitHub repo** (empty, private) — for the template code

These env vars go in `.env.local` (Claude Code will reference but not create the file):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
```

---

## 🚀 PROMPT 0 — Session bootstrap (paste at the START of every new session)

```
Read CLAUDE.md, then PLAN.md, then any other doc in the project root
relevant to the task I'm about to give you. Don't write any code yet.
Confirm when you've read them and tell me which docs you loaded.
```

This forces context load before any instruction lands. Use this EVERY new session.

---

## 🛠 PROMPT 1 — Project scaffold

Use plan mode first (`Shift+Tab Shift+Tab`). Review the plan. Exit plan mode. Run.

```
You've read CLAUDE.md and PLAN.md. Scaffold the Next.js 14 project for
the Monty's Media hair salon template.

1. Initialize Next.js 14 with TypeScript (strict), Tailwind, App Router,
   src/ disabled (use /app at root).
2. Install ONLY these dependencies (no others without asking):
   - @supabase/supabase-js, @supabase/ssr
   - stripe
   - resend
   - zod
   - date-fns, date-fns-tz
   - lucide-react
   - clsx, tailwind-merge
3. Set up tailwind.config.ts with design tokens from DESIGN.md.
   Default to "Approachable Modern" preset.
4. Configure /app/layout.tsx fonts via next/font/google — pull preset
   from client.config.ts. Self-host via next/font (no external requests).
5. Create the file structure from CLAUDE.md (/app, /components, /lib,
   /content, /types, /supabase/migrations).
6. Create /client.config.ts with the shape from PLAN.md, filled with
   placeholder values for a demo client called "Demo Salon".
7. Create .env.example with all required env vars (see top of
   MASTER_PROMPT.md). DO NOT create .env.local.
8. Create Supabase clients:
   - /lib/supabase/client.ts (browser)
   - /lib/supabase/server.ts (server with cookies)
   - /lib/supabase/admin.ts (service-role — server-only, never imported
     into Client Components)
9. Create /lib/stripe/client.ts with the Stripe SDK initialized.
10. Create a minimal /app/layout.tsx and /app/page.tsx rendering
    "Hello Hair Template" so I can verify the dev server runs.
11. Add .gitignore: .env*, .next, node_modules
12. Write a README.md with: how to run locally, env vars list, the
    per-client deployment recipe, and the free-to-start cost breakdown
    from PLAN.md.

Stop after `npm run dev` works. Tell me what to verify.
```

---

## 🛠 PROMPT 2 — Database setup

```
Read BOOKING.md sections "Database schema" and "RLS policies."
Read SERVICES.md.

Build the database foundation:

1. /supabase/migrations/0001_init.sql — full schema from BOOKING.md:
   - services
   - availability_rules
   - availability_overrides
   - bookings (with the GIST exclusion constraint)
   - All RLS policies
2. /supabase/migrations/0002_seed_services.sql — INSERT statements
   for services from SERVICES.md.
   - Use mid-range LA pricing for each
   - Set deposit_cents to 25% of price_cents for services with
     duration_min >= 90, else 0
   - Use the slugs from SERVICES.md exactly
   - Set requires_consult = true for vivid-color, color-correction,
     bridal-day, wedding-party, and both extension services
3. /types/database.ts — TypeScript types matching each table
4. /content/services.ts — typed export mirroring the seed data so
   the public site can render even before connecting to the DB.
   Type against /types/database.ts.

Do NOT run migrations against Supabase. Show me the SQL when done.
I'll run `supabase db push` after reviewing.
```

---

## 🛠 PROMPT 3 — Public marketing site (mobile-first)

```
Read STRUCTURE.md, DESIGN.md, CONTENT.md, IMAGES.md.

Build the public-facing marketing site. Mobile-first throughout — design
each component at 375px width first, then add responsive modifiers.

1. /app/layout.tsx — load fonts per DESIGN.md preset (use next/font/google).
   Set up html/body with Nav + children + Footer + MobileBookBar.
   Pull metadata from client.config.ts.seo.

2. /components/Nav.tsx — sticky top nav.
   - 56px height mobile, 72px desktop
   - Logo (left), Book Now button (right), hamburger (mobile) or links
     (desktop ≥768px)
   - Transparent at top, solid after 80px scroll
   - Hamburger opens FULL-SCREEN overlay (not a dropdown)

3. /components/MobileBookBar.tsx — sticky bottom Book Now bar.
   - Visible only on screens < 768px (use Tailwind md:hidden)
   - 64px tall, full-width, fixed to bottom of viewport
   - Single CTA "Book Now" → scroll to #book and open booking flow
   - Appears after user scrolls 400px down
   - Auto-hides when the booking section is in view (use IntersectionObserver)
   - Respect iOS safe-area: padding-bottom: env(safe-area-inset-bottom)

4. /components/Footer.tsx — full NAP block for local SEO, hours table,
   social icons (use Lucide), © line, optional "Site by Monty's Media" credit.

5. /app/page.tsx with sections in this order, each as its own component
   in /components/sections/:
   a. Hero — pull headline variant matching brand preset. Two CTAs (Book
      Now scrolls to #book, See Services scrolls to #services). Trust
      pills below. Hero image uses next/image with priority prop.
   b. OfferStrip — welcome offer from CONTENT.md
   c. Services — read from /content/services.ts. Category tabs
      (horizontal scroll-snap on mobile, pill row on desktop). Service
      cards: 1 col mobile, 2 col tablet, 3 col desktop. Show name,
      description, duration, price range, Book button per card.
   d. Gallery — filter chips (horizontal scroll-snap mobile). Grid: 2
      col mobile (4:5 tiles), 3-4 col desktop. Tiles use placehold.co
      with IMAGES.md briefs as labels. Tap to enlarge in lightbox.
   e. About — single owner block. Photo on top mobile, photo left
      desktop. Content from CONTENT.md "About" template.
   f. Reviews — array from /content/reviews.ts (create with placeholders).
      Carousel mobile (scroll-snap), grid desktop.
   g. InstagramFeed — placeholder grid of 6 tiles. Real embed deferred.
   h. BookingSection — wrap a <section id="book"> with "Book your
      appointment" heading and "Booking flow goes here" stub. We'll
      fill in Prompt 5.
   i. FAQ — native <details> accordion from /content/faqs.ts (create from
      CONTENT.md).
   j. Contact — address (tap to Maps), phone (tel:), email (mailto:),
      embedded Google Maps iframe (lazy-loaded), hours table.

All copy from CONTENT.md. All images via placehold.co with IMAGES.md
brief text as visible label + alt. Use Lucide icons throughout.

Test at 375px AND 1280px before declaring done. Show me a Lighthouse
mobile score.
```

---

## 🛠 PROMPT 4 — Admin panel

Build admin before public booking so we can seed availability + services.

```
Read BOOKING.md sections "Admin auth," and the admin components list
in STRUCTURE.md.

Build the admin panel:

1. /app/admin/login/page.tsx — magic-link login.
   - Email input, "Send magic link" button
   - Uses Supabase Auth signInWithOtp
   - On submit: check email against client.config.ts.admin.allowedEmails
     BEFORE calling Supabase. Reject non-allowlisted emails with friendly
     "This email isn't authorized" message.

2. /middleware.ts — protect /admin/* routes.
   - Check Supabase session
   - Verify session.user.email is in allowedEmails
   - Redirect to /admin/login if either fails

3. /app/admin/page.tsx — dashboard.
   - Today's bookings (count + list with customer name, service, time)
   - Upcoming this week (next 7 days, grouped by day)
   - Quick links to /admin/availability + /admin/bookings

4. /app/admin/availability/page.tsx — weekly schedule editor.
   - 7-column grid (Sun-Sat). Each column shows current rules.
   - Add/remove time blocks per day via Server Actions
   - Blackout dates: list + "Add blackout" form (date + optional start/end times)
   - All writes via Server Actions using service-role client

5. /app/admin/services/page.tsx — services CRUD.
   - List of active services from DB
   - Add/edit form (zod-validated): name, slug, description, category,
     duration_min, price_cents, deposit_cents, requires_consult
   - Toggle is_active

6. /app/admin/bookings/page.tsx — bookings list.
   - Filter tabs: upcoming | past | all
   - Each row: customer name, service, date/time, status, deposit paid
   - Click row → drawer with full details + Cancel button
   - Cancel Server Action: marks status='cancelled', sends email via
     Resend, reminds admin to refund manually via Stripe dashboard

Desktop-first but mobile-friendly. UI is plain — function over form.
All mutations via Server Actions with service-role client (NEVER expose
service role key to browser).

Stop when login works and I can seed availability + services through
the admin UI.
```

---

## 🛠 PROMPT 5 — Public booking flow (mobile-first bottom sheet)

```
Read BOOKING.md sections "Slot generation algorithm," "Mobile UI specs,"
"Server Actions," and "Stripe webhook."

Build the public booking flow on top of the existing site. Build
incrementally — stop and show me each step before moving on.

Step A: /lib/booking/availability.ts
Pure function: takes (service, dateRange, dbState) → returns open slots.
Add a test file covering:
- Normal day with rules
- Day with override (different hours)
- Closed day via null override
- Day with existing bookings (slots properly excluded)
- Slots in the past excluded
- Slots within minNoticeHours excluded
- Daylight saving transition day

Step B: /app/api/availability/route.ts
GET endpoint wrapping the function. Server-side Supabase reads
rules + overrides + existing bookings.

Step C: /components/booking/ — picker components
- ServicePicker (list of service cards, taller than homepage version)
- DatePicker (horizontal scroll-snap of next 60 days)
- SlotPicker (full-width tappable rows)
- CustomerForm (single-column, native input types, autocomplete attrs)
- BookingSummary (sidebar on desktop, top section on mobile)
- BookingStepper (progress indicator)
- BookingSkeleton (loading state matching final dimensions)

Persist step state in URL search params so refreshes don't lose progress.
"use client" only where state is required.

Step D: /components/booking/BookingFlow.tsx — mobile bottom-sheet wrapper.
- On mobile (< 768px): renders as a bottom sheet
  - 85vh height, rounded top, drag handle, dimmed backdrop
  - Background scroll locked while open
  - iOS safe-area inset respected
- On desktop: renders inline (no sheet)

Step E: Update /components/booking/BookingEmbed.tsx
- If client.config.ts.booking.mode === "native": render <BookingFlow />
- If mode === "iframe": render iframe (fallback for rare clients on
  existing platforms)

Replace the BookingSection stub from Prompt 3 with <BookingEmbed />.

Step F: /lib/booking/createBooking.ts — Server Action
- Validate input with zod
- Re-check slot availability server-side
- Insert booking with status='pending'
- Compute deposit: service.deposit_cents OR defaultDepositPercent of
  price_cents OR 0 for free consults
- If deposit > 0: create Stripe Checkout session with metadata
  { booking_id }
- If deposit === 0: mark confirmed immediately + send email
- Return checkout URL OR confirmation URL

Step G: /app/api/webhooks/stripe/route.ts
- Verify signature with STRIPE_WEBHOOK_SECRET
- On checkout.session.completed: mark booking confirmed, send email
- On checkout.session.expired: mark booking cancelled

Step H: /app/booking/confirm/page.tsx
Post-payment confirmation page. Pulls session_id from URL, fetches
booking, shows summary.

Step I: /lib/email/sendBookingConfirmation.ts
Resend integration. Subject + body from BOOKING.md "Email templates."
No .ics attachment in MVP.

After each step: typecheck + lint, show me the diff summary, wait for
my approval. Use Stripe test keys throughout. Test the bottom sheet on
a real iPhone before declaring Step D done.
```

---

## 🛠 PROMPT 6 — Polish + SEO + mobile QA

```
Read FEATURES.md "Non-negotiables" and CONTENT.md "Meta / SEO copy."

Polish pass:

1. JSON-LD structured data in /app/layout.tsx:
   - HairSalon (NAP + hours + geo from client.config.ts)
   - FAQPage (from /content/faqs.ts)
   - Per-service Service schema

2. /robots.txt and /app/sitemap.ts (dynamic)

3. /app/opengraph-image.tsx — render 1200×630 OG image dynamically using
   next/og with client name + tagline + brand color background

4. Image audit:
   - All below-fold images use loading="lazy"
   - Hero image uses priority + fetchPriority="high"
   - All <img> have width/height attrs (no CLS)
   - All have meaningful alt text

5. Lighthouse mobile audit. Targets:
   - Performance ≥ 90
   - Accessibility 100
   - Best Practices ≥ 95
   - SEO 100
   Report all failures with line numbers + proposed fixes. Don't auto-fix.

6. Tap target audit — every interactive element ≥ 44×44px (preferred 48+
   for primary CTAs)

7. End-to-end smoke test (do this manually after Claude Code reports):
   - Book a service on iPhone Safari → complete Stripe Checkout with
     4242 4242 4242 4242 → confirm email arrives
   - Try to double-book the same slot → confirm graceful error
   - Block a date in /admin/availability → confirm public booking
     respects it
   - Test the bottom sheet drag/dismiss on real iPhone

Report results. Let me approve fixes individually.
```

---

## 🔄 PROMPT N — Per-client deployment recipe

For each new client (e.g. "Amber Hair Studio"):

```
Read CLAUDE.md and PLAN.md.

I'm deploying this template for: {{CLIENT_NAME}} in {{NEIGHBORHOOD}},
{{CITY}}.

Specifics:
- Stylist name: {{STYLIST_FULL_NAME}}
- Vibe preset: {{editorial-luxe | approachable-modern | edgy-studio}}
- Primary color: {{HEX}}
- Services they offer (delete the rest from /content/services.ts AND
  /supabase/migrations/0002_seed_services.sql): {{LIST WITH PRICES
  if different from defaults}}
- Owner email (for admin allowlist): {{EMAIL}}
- IG: @{{HANDLE}}
- Address: {{FULL ADDRESS}}
- Phone: {{PHONE}}
- Business email: {{EMAIL}}
- Hours: {{PER-DAY}}
- Timezone: {{e.g. America/Los_Angeles}}

1. Update client.config.ts with all above.
2. Update /content/services.ts AND the seed migration to match their
   actual service list and prices.
3. Update /content/faqs.ts and /content/reviews.ts (flag review
   placeholders to replace with real ones before launch).
4. Update About section copy in /content/about.ts with the stylist's
   actual bio from CONTENT.md "About" template.
5. Update metadata in client.config.ts.seo.
6. Note: I'll create a new Supabase project and Stripe account for this
   client manually, then drop their env vars into Vercel.

Do not change logic in /components, /lib, or /app — only config,
content, and seed data.

Stop when `npm run dev` runs cleanly with the new client's config.
Show me what to verify before deploying.
```

---

## Workflow tips

- **One prompt per session.** `/clear` between major prompts.
- **Plan mode** for Prompts 1, 4, 5. They touch many files. `Shift+Tab Shift+Tab` to enter, review, edit inline, then approve.
- **Annotate the first plan.** Add `> NOTE:` comments where wrong, send back with "address all notes, don't implement yet." Repeat until clean.
- **Commit between every step inside Prompt 5.** Each step is a feature branch.
- **When stuck:** dump current state to `PROGRESS.md`, `/clear`, fresh session reading `PROGRESS.md` + relevant spec doc.
- **Stripe webhook locally:** `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- **Test on real iPhone** at every major prompt — emulators lie about iOS Safari.
