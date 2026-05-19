# STRUCTURE.md — Page Architecture (Mobile-First)

Solo stylist scope. Layout designed at 375px width first, scaled up.

## Single-page section order (mobile scroll)

```
[STICKY] NAV (top)
[STICKY] BOTTOM BOOK BAR (mobile only — bottom of viewport, persistent)

 1. HERO
 2. WELCOME OFFER STRIP
 3. SERVICES
 4. SHOWCASE / GALLERY
 5. ABOUT (the stylist)
 6. REVIEWS
 7. INSTAGRAM FEED
 8. BOOKING
 9. FAQ
10. CONTACT
[FOOTER]
```

## Sticky elements (mobile-specific)

### Sticky top nav (all screens)
- 56px height on mobile, 72px desktop
- Logo (left) · Book Now button (right) · hamburger (mobile) or links (desktop)
- Semi-transparent at top of page, solid background after 80px scroll
- Hamburger opens full-screen overlay (not a tiny dropdown)

### Sticky bottom Book bar (mobile only, hidden ≥768px)
- 64px height, full-width, primary background color
- Single CTA: "Book Now" → scrolls to `#book` and opens the bottom-sheet booking flow
- Appears after the user scrolls past the hero (around 400px down)
- Hides automatically when the booking section is in view (avoid stacking with the actual booking UI)
- Z-index above all content but below modal dialogs

## Section-by-section spec

### 1. HERO
- **Mobile (375px):** image background or short video (≤6s, muted, autoplay, ≤2MB), 60vh height, single-column overlay text, two CTAs stacked vertically
- **Desktop:** full-bleed, 80vh, headline + subhead side-by-side or overlay
- Trust pills below headline (3 max): "★ 4.9 on Google" · "{{X}} years in {{NEIGHBORHOOD}}" · "Same-day appointments"
- Hero image uses `fetchpriority="high"` and is preloaded — never lazy-loaded

### 2. WELCOME OFFER STRIP
- Slim horizontal band, ~48px height on mobile
- One sentence + CTA, both in one line on desktop, stacked on mobile if needed
- Brand accent color background

### 3. SERVICES
- Category tabs at top (Cuts · Color · Treatments · Styling · Extensions · Add-ons)
  - Mobile: horizontal scroll-snap (native, no JS), active tab highlighted
  - Desktop: row of pills
- Service cards:
  - Mobile: 1 column, full-width, 16px padding
  - Tablet: 2 columns
  - Desktop: 3 columns
- Each card shows: name (experience-led), 1-line description, duration, **price inline** ("from $85" or "$85–$110"), per-card Book button
- Optional badges: "Most Booked" · "New" · "Consult Required"

### 4. SHOWCASE / GALLERY
- Filter chips (All · Cuts · Color · Balayage · Extensions · Updos)
  - Mobile: horizontal scroll-snap row
- Grid:
  - Mobile: 2 columns, 4:5 aspect tiles (matches IG)
  - Desktop: 3-4 columns, masonry optional
- Tap a tile → opens lightbox with image at full width
- Native scroll-snap on the gallery row, no carousel JS

### 5. ABOUT (the stylist)
- One owner — single column block with photo + bio
- Mobile: photo on top (full-width, 4:5 aspect), text below
- Desktop: photo left (40%), text right (60%)
- Content per `CONTENT.md` "About section"
- Optional: list of specialties as pills, years of experience as a stat

### 6. REVIEWS
- 3-6 curated quotes from `CONTENT.md` reviews
- Mobile: 1 per row, swipeable scroll-snap carousel
- Desktop: 3 columns
- Each: ★★★★★ + quote + first name + service type
- "Read all reviews on Google →" link below

### 7. INSTAGRAM FEED
- 6-tile grid (3×2 mobile, 3×2 or 6×1 desktop)
- MVP: placeholders. Real embed in P2 (Instafeed.js or Elfsight, both have free tiers)
- "Follow @{{HANDLE}}" CTA below

### 8. BOOKING
- Heading: "Book your appointment"
- Booking embed renders here via `<BookingEmbed />`:
  - Native mode (default): inline booking flow on desktop, bottom-sheet on mobile (see `BOOKING.md` "Mobile UI" section)
  - Iframe mode (rare fallback): renders iframe at full width
- Below booking: "Prefer to text? {{PHONE}}" with `sms:` link
- Section ID: `#book` for scroll anchoring from all CTAs

### 9. FAQ
- Accordion (native `<details>` element — no JS, accessible by default)
- 6-10 Qs from `CONTENT.md`
- FAQPage JSON-LD schema in `<head>` for SEO + AI search

### 10. CONTACT
- Address block — tap to open in Maps (`https://maps.google.com/?q=...`)
- Phone — tap to call (`tel:`)
- Email — tap to compose (`mailto:`)
- Embedded Google Maps iframe (lazy-loaded, height 240px mobile / 320px desktop)
- Hours table (compact on mobile, expanded on desktop)

### FOOTER
- Repeated nav links · NAP (Name/Address/Phone) for local SEO · Social icons (IG/TikTok/Google) · © {{YEAR}}
- Small "Site by Monty's Media" credit link (optional, client decides)

## Public routes (MVP)

```
/                       single-page experience
/book                   full-page booking flow (mobile bottom-sheet style)
/booking/confirm        post-Stripe confirmation page
```

## Admin routes

```
/admin/login            magic-link login
/admin                  dashboard — today + week view
/admin/availability     weekly schedule + blackout dates
/admin/services         services CRUD
/admin/bookings         bookings list + cancel
```

## Component inventory

### Public-side
```
/components/
├── Nav.tsx                       Sticky top nav (mobile + desktop)
├── MobileBookBar.tsx             Sticky bottom Book bar (mobile only)
├── Footer.tsx                    NAP + social + © line
├── sections/
│   ├── Hero.tsx
│   ├── OfferStrip.tsx
│   ├── Services.tsx              Category tabs + cards
│   ├── ServiceCard.tsx
│   ├── Gallery.tsx               Filter chips + grid
│   ├── GalleryTile.tsx
│   ├── About.tsx                 Single stylist block (not "Stylists")
│   ├── Reviews.tsx               Carousel mobile, grid desktop
│   ├── InstagramFeed.tsx
│   ├── BookingSection.tsx        Wraps <BookingEmbed />
│   ├── FAQ.tsx                   Native <details> accordion
│   └── Contact.tsx
└── booking/
    ├── BookingEmbed.tsx          Top-level: native vs iframe mode
    ├── BookingFlow.tsx           Mobile bottom-sheet wrapper
    ├── ServicePicker.tsx
    ├── DatePicker.tsx
    ├── SlotPicker.tsx
    ├── CustomerForm.tsx
    ├── BookingSummary.tsx
    ├── BookingStepper.tsx
    └── BookingSkeleton.tsx
```

### Admin-side
```
/components/admin/
├── AdminNav.tsx
├── AvailabilityEditor.tsx
├── ServiceForm.tsx
├── BookingRow.tsx
└── BookingDetail.tsx
```

## Responsive breakpoints (Tailwind defaults)

```
sm:  640px   (large phone landscape)
md:  768px   (tablet portrait — hide MobileBookBar above this)
lg:  1024px  (tablet landscape / small laptop)
xl:  1280px  (desktop)
```

Design at base (375px) → add `sm:`, `md:`, `lg:`, `xl:` modifiers as the layout requires. NOT the other way around.

## Layout grid system

- Container max-width: 1280px
- Side padding: 16px mobile, 24px tablet, 32px desktop
- Section vertical padding: 64px mobile, 96px desktop
- Standard gap between elements: 16px mobile, 24px desktop

## Accessibility floor

- Semantic HTML (`<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`)
- All images have descriptive `alt` (briefs in `IMAGES.md`)
- Color contrast ≥ 4.5:1 for body text, 3:1 for large headings (WCAG AA)
- Focus rings visible (don't `outline: none` without a replacement)
- Skip-to-content link at the top of the page
- Form labels associated to inputs
- Reduced-motion users get static versions (`@media (prefers-reduced-motion: reduce)`)
