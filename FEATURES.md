# FEATURES.md — Feature Priorities (MVP / P2 / Later)

Mobile-first, free-tier, solo-stylist scope. Three tiers:

- 🟢 **MVP** — ship without these and you're losing money
- 🟡 **P2** — add within 30 days of launch
- 🔵 **Later** — strategic upgrades / paid upsells

---

## 🟢 MVP — Ship with these or don't ship

### 1. Mobile-first responsive build
- Why: 70% of salon bookings happen on phones, usually late at night
- How: Design at 375px first. Tap targets ≥ 44px. Booking flow as bottom sheet on mobile.
- Test: Real iPhone in Safari + Lighthouse mobile score ≥ 90

### 2. Sticky bottom Book Now bar (mobile)
- Why: The single highest-converting element. Always-visible CTA outperforms scroll-into-view buttons.
- How: 64px tall band fixed to bottom of viewport on screens < 768px. Single "Book Now" CTA. Hides automatically when the booking section is in view.

### 3. Custom admin-managed booking (the LGAthletics pattern)
- Why: $0/month for client. Owns the data. Matches brand. The differentiator.
- How: See `BOOKING.md` — Supabase + Stripe + Next.js Server Actions.

### 4. Inline transparent pricing
- Why: Hidden pricing is the #1 conversion killer for service businesses.
- How: Every service card shows duration + price (range or "from $X") visible without clicking.

### 5. Above-the-fold Book Now CTA (desktop)
- Why: Standard pattern — users scan top-right for the action.
- How: Sticky nav with persistent Book button. Hero has two CTAs (primary Book, secondary Services).

### 6. Stripe deposits on services ≥ 90 min
- Why: Deposits cut no-shows by ~42%. Long color services are expensive to lose to no-shows.
- How: `services.deposit_cents` per row. 25% default. See `BOOKING.md`.

### 7. Tap-to-call / tap-to-text / tap-to-directions
- Why: Mobile-native shortcuts. Removes friction for the "I just want to ask one question" client.
- How: `tel:` on phone, `sms:` on text fallback, Google Maps deep link on address.

### 8. Native HTML form inputs in booking
- Why: iOS keyboard adapts to input type. Native date pickers handle DST/timezone bugs that custom pickers introduce.
- How: `inputmode="email"`, `inputmode="tel"`, `autocomplete` attributes throughout.

### 9. Before/after gallery
- Why: Most powerful visual element for hair conversion.
- How: 4:5 aspect tiles (matches IG), filter chips, tap-to-enlarge lightbox. Native scroll-snap, no carousel JS.

### 10. Reviews / social proof block
- Why: Strongest local-business marketing signal aside from word-of-mouth.
- How: 3-6 curated quotes from Google Reviews, or embed the live Google widget.

### 11. New-client welcome offer
- Why: Lowers barrier for first-time visitors. Consistent winner across service businesses.
- How: Slim banner under hero: "15% off your first service" → flows through booking with code prefilled.

### 12. Local SEO essentials
- Why: "{{NEIGHBORHOOD}} hair stylist" is the search query that converts.
- How:
  - Title tag: city + neighborhood
  - `HairSalon` JSON-LD schema (NAP, hours, geo)
  - H1 mentions neighborhood naturally
  - Footer has full NAP in plain text
  - Google Business Profile claimed (client task post-launch)

### 13. Performance budget (free + fast)
- Why: Each second of load time = ~7% fewer bookings
- How:
  - WebP via `next/image`
  - Lazy load below the fold
  - Hero preloaded with `fetchpriority="high"`
  - No JS for layout (use CSS scroll-snap, `<details>`, etc.)
- Target: Lighthouse mobile Performance ≥ 90

### 14. FAQ with schema markup
- Why: Pre-empts booking-killers (parking, cancellation, walk-ins). FAQPage schema feeds AI search results (Perplexity, Google AI Overviews).
- How: Native `<details>` accordion + JSON-LD `FAQPage` schema. Questions in `CONTENT.md`.

### 15. Accessible mobile UX
- Why: 1 in 5 users has some form of accessibility need. Also Lighthouse 100 = bonus SEO signal.
- How: Semantic HTML, focus rings, alt text, prefers-reduced-motion respected, color contrast ≥ 4.5:1.

---

## 🟡 P2 — Add within 30 days of launch

### 16. Instagram feed embed
- Why: IG Reels are Google-indexed. Embedding the feed has SEO value + social proof.
- How: **Instafeed.js** (free, no API key for public profiles) or Elfsight (free tier). 6-9 tiles.

### 17. TikTok showcase
- Why: Hair transformations are TikTok-native content. Salons posting consistent 7-second transformations pull traffic from outside their city.
- How: Embed top 3 TikToks or just link to handle.

### 18. SMS booking shortcut on mobile
- Why: Some clients won't book online ever — they want to text.
- How: "Text us" button as a secondary CTA → `sms:` link with prefilled message body.

### 19. 24-hour reminder emails
- Why: Reduces no-shows beyond what deposits alone do.
- How: Vercel Cron + Resend. Runs hourly, finds bookings starting in 24-25h, sends a friendly reminder.

### 20. `.ics` calendar attachment in confirmation email
- Why: Lets clients add the appointment to their calendar in one tap.
- How: Generate `.ics` blob in the confirmation email Server Action.

### 21. Hair quiz / consultation request form
- Why: Pre-screens color corrections, vivids, extensions. Reduces wasted consult slots.
- How: 4-6 question form: current hair, goal, photos, budget, timeline. Routes to email.

### 22. Real reviews integration
- Why: Curated quotes work but live Google Reviews carry more weight.
- How: Embed Google Reviews widget (Elfsight free tier or similar). Or scrape monthly and refresh.

### 23. OG image generation
- Why: Better link previews on iMessage / Slack / IG = better share clickthrough
- How: `/app/opengraph-image.tsx` using `next/og` — generates dynamically per page

---

## 🔵 Later — Paid upsells and strategic upgrades

### 24. Multi-stylist support
- Why: Client grows from solo to multi-stylist salon. Big revenue event for you.
- How: Add `stylists` + `stylist_services` tables. Add stylist picker to booking flow. Per-stylist routes.
- Sell as: $$$ migration project + ongoing retainer.

### 25. Gift card sales
- Why: Pure margin product, popular for holidays and birthdays.
- How: Stripe Payment Links (no code) for MVP-level gift cards. Custom Stripe Checkout + Supabase tracking for full integration.

### 26. Loyalty / referral program
- Why: Word-of-mouth is #1 acquisition. Formalizing it amplifies it.
- How: Simple custom build: referral codes in URL, tracked in Supabase, reward credit added to client's account.

### 27. Email list capture + Mailchimp/Beehiiv integration
- Why: Repeat bookings are the highest-margin revenue.
- How: Slim form in footer + post-booking opt-in. Beehiiv free tier covers up to 2,500 subscribers.

### 28. Per-service deep pages
- Why: AI search (Perplexity, Google AI Overviews) rewards depth. A dedicated balayage page with photos, FAQs, aftercare ranks better than a single services page.
- How: `/services/[slug]` Next.js dynamic routes. 800-1200 words per page. Original photography.

### 29. Blog / aftercare content hub
- Why: Topical authority for SEO + a reason for past clients to return.
- How: MDX-based blog in `/content/blog/*.mdx`. 1 post/week. Topics from Search Console.

### 30. Booking abandonment recovery
- Why: A surprising share of bookings get started, not finished. Recovery emails recover 10-20%.
- How: Vercel Cron checks `pending` bookings > 30 min old, sends "come back and finish" email via Resend.

### 31. Card-on-file for no-show charges
- Why: Combined with deposits, drops no-shows further.
- How: Stripe SetupIntent at booking, charge 50% on no-show via admin panel.

### 32. AI virtual try-on (color preview)
- Why: Reduces booking hesitation on color services. Trend in 2026.
- How: Modiface SDK or Stable Diffusion-based color simulation. Heavy lift — only worth it for color-focused salons.
- Risk: AI-generated previews of the client's actual face can backfire. Use AI for inspiration only, not before/after marketing.

---

## What makes a salon site go viral (truthfully)

The site itself doesn't go viral. **The content does** — and the site is the conversion floor that captures traffic.

What the site needs to support viral spikes:

1. **The IG feed embed funnels TikTok/IG discovery → booking widget.** When a Reel pops, the site needs to handle 1000+ visitors hitting the booking CTA simultaneously. Vercel + Supabase free tiers handle this comfortably for short bursts.

2. **Original transformation photography on the site beats AI/stock 10:1.** Viral visitors immediately check the gallery to verify the work is real. Stock kills the spell.

3. **"Book this look" CTA on every gallery image.** When someone arrives from a viral post, they want THIS look. Pre-filling the booking flow with that service converts harder than generic Book CTAs.

4. **Branded hashtags + UGC funnel.** Footer includes `#{{BUSINESS_HASHTAG}}`. Viewers see it → post their result with it → owner reshares → loop reinforces.

5. **Speed during viral spikes.** CDN, image optimization, clean iframe-free booking. Vercel + `next/image` cover this without any extra work.

**What the salon owner needs to do (not the site):**
- Post 7-second transformations on TikTok/IG Reels 3-5x/week
- Use "client asked for X / I did Y" framing — beats generic "look at this"
- Partner with micro-influencers in the local metro (3K-30K followers) — converts better than larger creators
- Google Business Profile fresh: photos weekly, respond to every review
- Consistency beats virality — 100 small posts > 1 hoped-for viral hit

---

## Approved free tools (reminder)

Use these. Don't reach for paid alternatives.

| Need | Free tool |
|---|---|
| Framework | Next.js |
| Styling | Tailwind |
| Database | Supabase free |
| Payments | Stripe (per-txn only) |
| Email | Resend free (3k/mo) |
| Hosting | Vercel free (Hobby tier) |
| Fonts | Google Fonts |
| Icons | Lucide React |
| Image optimization | `next/image` (built-in) |
| Analytics | Vercel Analytics + Google Analytics 4 |
| Session recording | Microsoft Clarity (free, unlimited) |
| Search Console | Google Search Console |
| Performance audit | Chrome Lighthouse |
| IG feed embed | Instafeed.js |
| Reviews widget | Elfsight free tier |
| Newsletter | Beehiiv free tier (2.5k subs) |
| Color generation | Coolors.co |
| Image placeholders | placehold.co |
