# CLAUDE.md — Project Rules

> Skeleton file. Grows as patterns emerge. Keep under 200 lines.
> The big-picture spec lives in **PLAN.md** — read that for any non-trivial task.

## Project

Hair salon site template by Monty's Media. Target: **brand-new solo stylist** who needs a website + booking + payments, **free to start**, **mobile-first**.

Solo stylist scope only. Multi-stylist is a future paid upgrade — do NOT build it preemptively.

## Stack (don't deviate without asking)

- Next.js 14 (App Router) + TypeScript (strict mode)
- Tailwind CSS
- Supabase (Postgres + RLS + magic-link auth) — free tier
- Stripe Checkout (deposits only) — pay per transaction, no monthly
- Resend (confirmation emails) — free tier (3k/month)
- Vercel hosting — free tier
- Google Fonts (free), Lucide icons (free)

All free tier. No paid dependencies without asking.

## Hard rules

### Mobile-first (non-negotiable)
- **Design every component at 375px width first**, then scale up. 70% of salon traffic is phones.
- Tap targets ≥ 44×44px (preferred 48-56px for primary CTAs)
- No hover-only states — everything must work on touch
- Use native browser features (scroll-snap, `tel:`/`sms:`/`mailto:` links, native date inputs) before custom JS
- Test on a real iPhone before declaring anything done — DevTools mobile emulator lies about iOS Safari quirks

### Budget (free-tier only)
- Never add a paid service or dependency without explicit approval
- Approved free stack: Next.js, Tailwind, Supabase free, Stripe (pay-per-txn), Resend free, Vercel free, Google Fonts, Lucide, Vercel Analytics, GA4
- If you think a paid tool is genuinely necessary, stop and ask first

### Security
- Never commit `.env.local` or any secret. Vercel env vars only.
- Never push directly to `main`. Feature branch + PR.
- Never call live Stripe APIs. Use `sk_test_*` keys until I explicitly say "go live."
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to client components or browser code.
- Never run destructive Supabase queries (`DROP`, `TRUNCATE`, `DELETE` without `WHERE`) without explicit confirmation in chat.

### Scope
- Never add a `stylists` table or multi-stylist routing. Solo stylist only.
- Never invent service prices, durations, or copy — pull from `SERVICES.md` and `CONTENT.md`.
- Never use stock photos or AI-generated faces for the owner photo — use `placehold.co` with label text until real photos exist.
- Never add a new dependency without asking.

## Conventions

### File structure
```
/app                   Next.js App Router pages
/app/admin             Owner-facing admin panel
/app/api               API routes (availability, Stripe webhook)
/components            Reusable React components
/components/sections   Homepage section components (Hero, Services, etc.)
/components/booking    Booking flow components
/components/admin      Admin panel components
/lib                   Utility functions
/lib/supabase          Supabase clients (browser, server, admin)
/lib/stripe            Stripe client + helpers
/lib/booking           Slot generation, validation
/lib/email             Resend templates
/types                 Shared TypeScript types
/content               Static content (services seed, faqs, reviews)
/public/images         Static images
/supabase/migrations   Database migrations
/client.config.ts      Per-client configuration (the only file that changes per deployment)
```

### Naming
- Components: `PascalCase.tsx` (e.g. `ServiceCard.tsx`)
- Utilities: `camelCase.ts` (e.g. `formatPrice.ts`)
- Routes: lowercase kebab-case
- DB tables: snake_case, plural (`bookings`, `services`)

### Components
- Server Components by default. `"use client"` only when needed (state, browser APIs).
- Props typed with `interface {Component}Props`.
- One component per file.

### Styling
- Tailwind utilities first. No arbitrary inline values — use design tokens from `tailwind.config.ts`.
- Mobile-first responsive: write base styles for mobile, add `sm:`, `md:`, `lg:` for larger screens (NOT the other way around).
- See `DESIGN.md` for the three vibe presets.

### Forms
- Server Actions for form submissions, not API routes (except webhooks).
- Validate with `zod` on the server.

### Database access
- Public reads: anon client via RLS
- Public writes (create booking): Server Action using service-role client server-side only
- Admin reads/writes: authenticated client after magic-link login + email allowlist check

## Workflow expectations

- **Plan mode for anything touching >2 files or making architecture decisions.** Write the plan, wait for approval, then implement.
- **One task per session.** When a feature is done, suggest `/clear` before the next one.
- **Read before editing.** Open the file, read it, then propose the change.
- **Test before declaring done.** `npm run lint`, `npm run typecheck`, then check at 375px AND 1280px in the browser.
- **Stop and ask** when: spec is ambiguous, two reasonable approaches exist, or you're about to introduce a new dependency.

## "Done" definition

- TypeScript compiles with no errors
- ESLint passes
- Page works on mobile (375px) and desktop (1280px+)
- Tap targets ≥ 44×44px on interactive elements
- No console errors in browser
- No Cumulative Layout Shift issues (CLS) — especially around image loading
- If touching database: migration file committed, RLS policies set
- If touching Stripe: tested with test keys end-to-end (`4242 4242 4242 4242`)

## Where to look for what

| Question | File |
|---|---|
| What does the site need to do? | `PLAN.md` |
| What pages and components exist? | `STRUCTURE.md` |
| How does booking work? Schema, flow, Stripe? | `BOOKING.md` |
| What services and prices? | `SERVICES.md` |
| What does the copy say? | `CONTENT.md` |
| What images go where? | `IMAGES.md` |
| What colors / fonts / spacing? Approved free tools? | `DESIGN.md` |
| What features now vs later? Mobile-first priorities? | `FEATURES.md` |
| The build sequence | `MASTER_PROMPT.md` |
