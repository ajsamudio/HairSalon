# PLAN.md — Hair Salon Site Template (Master Spec)

> The "what to build" doc. Claude Code reads this after `CLAUDE.md`.

## What this is

A **template for brand-new solo stylists** building their first online presence. Two non-negotiables baked in from day one:

1. **Free to start** — no monthly platform fees. Domain (~$12/yr) + Stripe per-transaction fees only.
2. **Mobile-first** — 70% of salon traffic is phones. Every design and dev decision starts at 375px width.

By Monty's Media. Each new client = fork → swap config + content + images → deploy. 3-5 day delivery per client after the template is built.

Reference for visual feel: `https://dragonflyybar.vercel.app/`
Reference for booking architecture: **LGAthletics** and **Browsite** (Next.js + custom admin-managed availability + Stripe).

## The pitch

> "A beautiful website with built-in booking and payments. $0/month to start. You only pay processing fees when a client books and pays — same as if you were using GlossGenius, except you keep your data, keep your brand, and don't pay a monthly subscription. Annual cost to start: just your domain (~$12)."

That's the differentiation. Competitors charge $24-30/month from day one regardless of revenue.

## Cost breakdown (for the client)

| Item | Cost | When it kicks in |
|---|---|---|
| Domain name | ~$12/year | Day one |
| Vercel hosting | Free | Free tier handles normal traffic |
| Supabase (DB + auth) | Free | 500MB DB, 50k MAU, 5GB bandwidth — plenty for a solo stylist |
| Stripe (payments) | 2.9% + 30¢/txn | Only on actual deposit revenue |
| Resend (emails) | Free | 3,000/month, 100/day — plenty |
| Google Fonts | Free | Always |
| Lucide icons | Free | Always |
| **Monthly fixed cost** | **$0** | |

Realistic monthly cost for a stylist running 30 bookings/month at $50 deposit avg: ~$45/month in Stripe fees on $1,500 of deposit revenue. Same fee structure as any platform — but no subscription on top.

**Honest disclosure to the client:** Vercel's free tier is technically for non-commercial use. Once they're consistently making bookings, recommend the Pro plan ($20/mo) for ToS compliance and better reliability. Still way cheaper than the $24-48/mo salon platforms.

## Mobile-first manifesto

This is not optional. It's the design baseline:

1. **Every page is designed and built at 375px first**, then scaled up to tablet (768px) and desktop (1280px+).
2. **70% of bookings happen on phones**, usually late at night or between errands. The mobile flow IS the product.
3. **Specific mobile patterns required:**
   - Sticky bottom Book Now bar (always visible on mobile, doesn't scroll away)
   - Tap-to-call (`tel:`) on every phone number display
   - Tap-to-text (`sms:`) as a booking fallback
   - Tap-to-directions on the address (Google Maps deep link)
   - Bottom-sheet pattern for the booking flow on mobile (slides up, full-height)
   - Native scroll-snap for the gallery (no custom carousel JS)
   - Native browser date/time inputs in the booking flow (better than custom pickers on iOS Safari)
   - Hamburger menu opens full-screen overlay, not a tiny dropdown
4. **Tap targets ≥ 44×44px**, preferred 48-56px for primary CTAs.
5. **No hover-only states.** Everything works on touch.
6. **Test on a real iPhone** before launch. Chrome DevTools mobile emulator misrepresents Safari behavior.
7. **Network-conscious:** WebP images, lazy load below the fold, fetch-priority high on hero, total page weight under 1MB.

## Tech stack

- Next.js 14 (App Router) + TypeScript (strict)
- Tailwind CSS (mobile-first responsive)
- Supabase (Postgres + RLS + magic-link auth)
- Stripe Checkout (deposits)
- Resend (confirmation emails)
- Vercel hosting
- Google Fonts (typography)
- Lucide React (icons)

That's the entire MVP stack. All free tier.

## What the site does

### Public (clients)
```
/                       single-page experience (showcase → services → booking)
/book                   full-page booking flow (mobile bottom-sheet style)
/booking/confirm        post-Stripe success page
```

### Admin (the stylist owner)
```
/admin/login            magic-link login
/admin                  today + upcoming bookings dashboard
/admin/availability     set weekly hours + blackout dates
/admin/services         add/edit/remove services
/admin/bookings         view bookings (cancel = manual Stripe refund)
```

### API
```
/api/availability       GET open slots for a service
/api/webhooks/stripe    POST — confirms booking after payment
```

That's it. No `/stylists/[slug]`, no `/services/[slug]` deep pages, no SMS reminders, no .ics calendar attachments in MVP.

## Booking flow

```
Stylist (admin)                     Client (public, on phone)
─────────────────                   ─────────────────────────
1. Magic-link login
2. Sets weekly availability
   (e.g. Tue-Sat 10am-7pm)
3. Adds blackout dates
                                    4. Visits site → taps "Book Now"
                                    5. Bottom sheet slides up
                                    6. Picks service
                                    7. Picks open slot
                                    8. Enters name + email + phone
                                    9. Stripe Checkout (deposit)
                                    ─────────────────────────
                                    Stripe webhook fires
                                    ─────────────────────────
                                    10. Booking confirmed
                                    11. Slot blocked
                                    12. Confirmation email sent
                                    13. Redirected to /booking/confirm
14. Stylist sees booking in /admin
```

See `BOOKING.md` for full schema, slot-generation algorithm, mobile UI specs, webhook handler.

## Per-client customization

Everything per-client lives in `client.config.ts` + `/content/*` + `/public/images/*`:

```ts
export const clientConfig = {
  business: {
    name: "Amber Hair Studio",
    tagline: "Color, cuts, and care in Long Beach.",
    city: "Long Beach",
    neighborhood: "Belmont Shore",
    address: "...",
    phone: "(562) 555-0100",
    email: "hello@amberhair.com",
    hours: { /* per-day display only — booking uses availability_rules in DB */ },
    timezone: "America/Los_Angeles",
  },
  brand: {
    preset: "approachable-modern", // "editorial-luxe" | "approachable-modern" | "edgy-studio"
    primaryColor: "#D97757",
    accentColor: "#F4E5DC",
  },
  social: {
    instagram: "amberhairstudio",
    tiktok: "amberhairstudio",
    googleReviewsUrl: null,
  },
  booking: {
    mode: "native",
    iframeSrc: null,
    minNoticeHours: 2,
    maxDaysAhead: 60,
    slotStepMinutes: 15,
    defaultDepositPercent: 25,
    welcomeOfferText: "New client? Get 15% off your first service.",
  },
  admin: {
    allowedEmails: ["amber@amberhair.com"],
  },
  seo: {
    title: "Amber Hair Studio — Hair Stylist in Belmont Shore, Long Beach",
    description: "...",
    ogImage: "/og-share.jpg",
  },
};
```

Everything client-specific is in this file + content + images. No code changes per deployment.

## File map (planning docs)

| File | Purpose |
|---|---|
| `START_HERE.md` | Entry point + first prompt to paste in Claude Code |
| `CLAUDE.md` | Skeleton conventions + hard rules |
| `PLAN.md` | **This file.** Strategy, stack, scope |
| `STRUCTURE.md` | Page sections, mobile-first layout, components, routes |
| `BOOKING.md` | Booking spec — schema, slot algorithm, mobile UI, Stripe webhook |
| `SERVICES.md` | Service menu + LA pricing |
| `CONTENT.md` | All copy: headlines, microcopy, CTAs, FAQs |
| `IMAGES.md` | Image slots + Pinterest placeholder strategy + mobile sizing |
| `DESIGN.md` | Vibe presets, mobile-first design system, approved free tools list |
| `FEATURES.md` | Conversion features — MVP / P2 / Later |
| `MASTER_PROMPT.md` | Sequential build prompts for Claude Code |

## Build order

1. **Lock the spec** (done — these docs)
2. **Scaffold Next.js** + Tailwind + Supabase + Stripe SDK (PROMPT 1)
3. **Database setup** — schema + seed services from `SERVICES.md` (PROMPT 2)
4. **Public site shell + marketing sections** — mobile-first (PROMPT 3)
5. **Admin panel** — login + availability + services + bookings (PROMPT 4)
6. **Public booking flow** — bottom sheet, Stripe Checkout, webhook (PROMPT 5)
7. **Polish + SEO + mobile QA** (PROMPT 6)

Detailed prompts in `MASTER_PROMPT.md`.

## Non-negotiables (don't skip)

- **Free-to-start promise** — no required paid services
- **Mobile-first** — every component designed at 375px first
- Booking CTA visible above the fold on mobile (sticky bottom bar)
- Pricing shown inline on every service
- Tap targets ≥ 44×44px
- Original or licensed photography (Pinterest placeholders during build)
- Local SEO: city + neighborhood in title tag, H1, footer

## Out of scope for MVP (defer to "Later")

- Multi-stylist support (`stylists` table, per-stylist routes) — paid upgrade later
- SMS reminders (Twilio) — email only in MVP
- .ics calendar attachments
- Automated cancellation/refund flows (manual via Stripe dashboard for now)
- Per-service deep pages for SEO
- Blog / CMS
- Loyalty / referral
- AI virtual try-on
- Multi-location

Each becomes a paid upgrade conversation when a client outgrows MVP.

## Success criteria for the template

- Per-client deploy time ≤ 4 hours (edit config + content + images only)
- Lighthouse mobile Performance ≥ 90
- Lighthouse mobile Accessibility = 100
- New stylist with zero clients can use the system at $0/mo fixed cost
- Test booking with Stripe test card works end-to-end in under 60 seconds
- Three vibe presets functional
- The site works perfectly on a real iPhone in Safari

## Domain ownership

**Client owns their own domain.** Never register it under your account. They buy through Namecheap, Cloudflare, or Google Domains, then connect it to their Vercel deployment via DNS. Keeps handoff clean and avoids you holding domains for past clients.
