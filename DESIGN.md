# DESIGN.md — Design System & Vibe Presets

Mobile-first. Every preset designed for 375px width baseline. Approved free tools only.

## Approved tools (free tier only)

- **Fonts:** Google Fonts (any). Use `next/font/google` for self-hosting and zero layout shift.
- **Icons:** Lucide React (`lucide-react`). Free, tree-shakeable.
- **Color palette:** Coolors.co (free) for generating; tokenize in `tailwind.config.ts`
- **Images:** Pinterest for inspiration, Unsplash for stock backgrounds (rare — prefer original), placehold.co for placeholders during build
- **Analytics:** Vercel Analytics (free tier) + Google Analytics 4 (free)
- **Session recording:** Microsoft Clarity (free, unlimited sessions) — optional
- **Search Console:** Google Search Console (free)
- **Lighthouse:** built into Chrome DevTools (free)

Never reach for paid Adobe Fonts, paid icon sets, paid analytics, or paid color tools. The free options are objectively good enough for the template's needs.

## Three vibe presets

The client picks one at the start. Each locks in palette + typography + motion. Do not mix.

### Preset 1: Editorial Luxe
For high-end stylists charging top of market. Vogue beauty editorial feel.

```
Palette:
--bg:       #FAFAF7    (warm off-white)
--surface:  #FFFFFF
--ink:      #1A1A1A
--ink-soft: #4A4A4A
--accent:   #8B6F47    (warm bronze)
--accent-2: #C9A961    (gold)
--line:     #E8E4DC

Typography (all Google Fonts):
- Headings: Fraunces (serif, contemporary editorial)
- Body: Inter (clean sans)
- Mobile sizes: H1 36-44px · H2 24-28 · Body 16-17/1.6
- Desktop: H1 56-72 · H2 36-40 · Body 17/1.7

Motion: slow, generous. 400-600ms fades. Hover scale 1.02 over 600ms.
Photography: muted, slightly desaturated, lots of whitespace.
```

### Preset 2: Approachable Modern (DEFAULT)
For neighborhood stylists who want friendly + current. The safest starting point.

```
Palette:
--bg:       #FFFFFF
--surface:  #F7F5F2
--ink:      #1F2937
--ink-soft: #6B7280
--accent:   #D97757    (warm clay)
--accent-2: #F4E5DC
--line:     #E5E7EB

Typography:
- Headings: Fraunces or Recoleta (warm serif)
- Body: Inter or DM Sans
- Mobile: H1 32-40 · H2 22-26 · Body 16/1.5
- Desktop: H1 48-56 · H2 28-32 · Body 16-17/1.6

Motion: snappy. 200-300ms. Subtle bounce on buttons.
Photography: bright, true-to-life color, real people.
```

### Preset 3: Edgy Studio
For independent stylists and studio collectives. Brooklyn / Silver Lake feel.

```
Palette:
--bg:       #0F0F0F
--surface:  #1A1A1A
--ink:      #F5F5F5
--ink-soft: #A0A0A0
--accent:   #FF4E2C    (electric orange) or #00FF88 (acid green) — pick one
--accent-2: #2A2A2A
--line:     #2A2A2A

Typography:
- Headings: Inter Tight or Space Grotesk
- Body: Inter
- Optional mono accent: JetBrains Mono for metadata
- Mobile: H1 36-42 · H2 22-26 · Body 15-16/1.5
- Desktop: H1 56-64 · H2 32-36 · Body 16/1.5

Motion: fast and confident. 150ms. Sharp transitions.
Photography: high contrast, moody, flash-photography vibe.
```

## Spacing scale

4px base unit. Tailwind defaults (0.5, 1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24) cover this.

Specific values for this project:
- **Section vertical padding:** 64px mobile (`py-16`), 96px desktop (`md:py-24`)
- **Container side padding:** 16px mobile (`px-4`), 24px tablet (`md:px-6`), 32px desktop (`lg:px-8`)
- **Card padding:** 16px mobile, 24px desktop
- **Gap between cards:** 16px mobile, 24px desktop
- **Vertical rhythm between elements:** 16px default, 8px dense, 24px generous

## Border radius

- Editorial Luxe: 2px (almost square — feels expensive)
- Approachable Modern: 12px (friendly, not playful)
- Edgy Studio: 0px (hard corners), 999px on pills only

## Buttons

### Primary (Book Now CTA)
- **Mobile:** 56px tall minimum (thumb-friendly), full-width within container
- **Desktop:** 48-52px tall, auto-width with 24px horizontal padding
- Bold weight (600+)
- Hover: darken bg 8%
- Active: scale(0.98)
- Tap feedback: 150ms transition

### Secondary
- Outlined variant of primary, same dimensions

### Tertiary
- Text link with underline on hover

## Form inputs

- **Minimum 48px height** (prevents iOS focus-zoom when paired with font-size ≥ 16px)
- **Font size: 16px minimum** on inputs (iOS zooms in if smaller)
- Border: 1px solid `--line`, 2px on focus with `--accent`
- Padding: 12px horizontal, 12px vertical
- Border radius matches button radius
- Error state: red 1px border + small error text below

## Images & media

- **Aspect ratios:**
  - Hero: 16:9 desktop, 4:3 mobile crop
  - Service cards: 4:3 or square
  - Gallery: 4:5 vertical (matches IG, mobile-friendly)
  - About/owner: 4:5 vertical
  - OG share: 1200×630 exact
- **Format:** WebP everywhere
- **Compression:** Hero <500KB, gallery <200KB, owner photo <250KB
- **Lazy load:** Everything below the fold (`loading="lazy"`)
- **High priority:** Hero gets `fetchpriority="high"` and is preloaded
- **`next/image` everywhere:** automatic responsive sizing + WebP conversion at build

## Motion principles

1. **One animation at a time** per scroll position
2. **Respect `prefers-reduced-motion`:**
   ```css
   @media (prefers-reduced-motion: reduce) {
     * { animation: none !important; transition: none !important; }
   }
   ```
3. **No carousel autoplay** — let users drive
4. **Sticky nav transition** smooth between transparent (top) and solid (scrolled)
5. **Tap feedback** on every interactive element (visual response in <100ms)

## Mobile-first checklist (non-negotiable)

- Design at 375px width FIRST, then scale up
- Tap targets ≥ 44×44px, primary CTAs ≥ 48px
- Sticky bottom Book bar visible on all mobile pages
- Native browser features over custom JS (scroll-snap, `<details>`, native date inputs)
- `tel:`, `sms:`, `mailto:`, Maps deep links on contact info
- Hamburger opens full-screen overlay
- Bottom sheets for any modal flow (booking)
- Form fonts ≥ 16px to prevent iOS zoom
- Bottom safe-area inset respected on iOS (`env(safe-area-inset-bottom)`)
- Test on real iPhone before any feature is "done"

## Accessibility floor (WCAG AA)

- Color contrast ≥ 4.5:1 for body text, 3:1 for large headings — verify each preset
- Semantic HTML (`<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`)
- Form labels associated to inputs (use `<label for>` or `aria-label`)
- Focus rings visible on all interactive elements
- Skip-to-content link at the top of every page
- Alt text on every image (briefs in `IMAGES.md`)
- No `outline: none` without a replacement focus indicator

## Tailwind config sketch

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";
import { clientConfig } from "./client.config";

const presets = {
  "approachable-modern": {
    bg: "#FFFFFF",
    surface: "#F7F5F2",
    ink: "#1F2937",
    inkSoft: "#6B7280",
    accent: "#D97757",
    accent2: "#F4E5DC",
    line: "#E5E7EB",
  },
  "editorial-luxe": { /* ... */ },
  "edgy-studio": { /* ... */ },
};

const palette = presets[clientConfig.brand.preset];

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: palette.bg,
        surface: palette.surface,
        ink: palette.ink,
        "ink-soft": palette.inkSoft,
        accent: clientConfig.brand.primaryColor || palette.accent,
        "accent-2": clientConfig.brand.accentColor || palette.accent2,
        line: palette.line,
      },
      fontFamily: {
        heading: ["var(--font-heading)"],
        body: ["var(--font-body)"],
      },
    },
  },
} satisfies Config;
```

## Inspiration board (don't copy — borrow patterns)

Real-world salon sites worth studying:
- **Nine Zero One** (LA) — celebrity-luxe, gallery-forward
- **Rita Hazan** (NYC) — editorial product integration
- **IGK** — playful color, bold type
- **Barb Styling** — minimal, modern
- **Refresh Hair Studio** (Chicago) — booking + offer above the fold

Patterns to **avoid:**
- Splash pages with "Enter site" — kills conversion
- Carousel sliders on hero — IG-feed attention killers
- Hidden pricing behind contact forms — bounces clients
- Auto-playing audio — never
- Stock photos of fake consultations — destroys credibility instantly
