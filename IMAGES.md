# IMAGES.md — Image Slots & Pinterest Briefs

Mobile-first image strategy. Solo stylist scope = single owner photo, not multi-stylist team.

## Naming convention

`/public/images/{section}-{slot}.{ext}` — predictable, easy to swap per client.

## Placeholder strategy (during build)

Use `placehold.co` with descriptive labels:
```html
<img src="https://placehold.co/1200x800?text=Hero+Image+%E2%80%94+stylist+at+work" alt="..." />
```

The text after `?text=` matches the brief below. URL-encode spaces as `+` and special characters.

Before client launch: replace every placeholder with real photography. Pinterest is for **inspiration during build**, not as a launch source — Pinterest images are copyrighted.

## File specs (apply everywhere)

- **Format:** WebP (use `next/image` to convert automatically)
- **Compression:** Hero <500KB, gallery <200KB each, owner photo <250KB
- **Lazy load:** Everything below the fold (`loading="lazy"`)
- **Priority:** Hero only (`priority` prop in `next/image`, `fetchpriority="high"`)
- **Responsive:** `next/image` handles `srcset` automatically — pass `sizes` prop accurately

## Mobile-specific sizing

- **Hero:** 800px wide on mobile is plenty (2x retina = 400px display). 1600px on desktop.
- **Gallery tiles:** 600px wide on mobile (matches 300px display × 2x retina). Don't ship desktop-sized images to phones — `next/image` `sizes` prop handles this.
- **Owner photo:** 800×1000px source (4:5 aspect)

---

## HERO

### `/public/images/hero-main.{webp,jpg}` or `hero-main.{webm,mp4}` for video

- **Pinterest brief:** "modern hair stylist at work natural light" / "salon hero shot stylist in action" / "back of head color shot aesthetic"
- **Vibe:** wide cinematic. Either (a) stylist mid-color application, (b) wide salon interior with natural light, or (c) stunning back-of-head color shot
- **Avoid:** anything that screams stock, anyone smiling directly at camera, busy backgrounds
- **Specs:** Source 2400×1350 (16:9). Mobile crop 4:3 (`object-fit: cover` handles the crop)
- **Video alt:** ≤6s loop, muted autoplay, ≤2MB. Add `playsInline` for iOS.
- **Alt:** `{{STYLIST_NAME}} at work in {{NEIGHBORHOOD}}, {{CITY}}`

---

## SERVICES SECTION

Each category gets a small icon or image header (optional — Lucide icons are simpler).

If using images:

| Slot | Pinterest brief | Aspect |
|---|---|---|
| `service-cuts.webp` | "modern haircut close up scissors aesthetic" | square |
| `service-color.webp` | "hair color foils close up artistic" | square |
| `service-treatments.webp` | "shiny healthy hair close up" | square |
| `service-styling.webp` | "blowout salon styling" | square |
| `service-extensions.webp` | "long hair extensions natural" | square |

Or use Lucide icons (recommended for MVP — simpler, free, scalable):
- Cuts: `Scissors`
- Color: `Palette` or `Brush`
- Treatments: `Sparkles`
- Styling: `Wind`
- Extensions: `ChevronsDown`
- Add-ons: `Plus`

---

## SHOWCASE / GALLERY

The conversion engine. Aim for **12-18 images at launch**. Group by service type so filter chips work.

### Cuts (3-4 images)
- `gallery-cut-01.webp` — Modern bob, clean lines, profile
- `gallery-cut-02.webp` — Curtain bangs, soft layers
- `gallery-cut-03.webp` — Men's textured crop or fade
- `gallery-cut-04.webp` — Long layers, glossy, back view

### Color (3-4 images)
- `gallery-color-01.webp` — Rich brunette gloss
- `gallery-color-02.webp` — Copper/red transformation
- `gallery-color-03.webp` — Platinum / cool blonde
- `gallery-color-04.webp` — Lived-in dimensional brunette

### Balayage (3-4 images) — these convert hardest
- `gallery-balayage-01.webp` — Beachy bronde, beach waves
- `gallery-balayage-02.webp` — Money piece face-frame
- `gallery-balayage-03.webp` — Sombré gradient
- `gallery-balayage-04.webp` — Babylights, ultra-natural

### Extensions (2 images)
- `gallery-extensions-01.webp` — Before/after length
- `gallery-extensions-02.webp` — Volume + length combo

### Updos / Bridal (2 images)
- `gallery-updo-01.webp` — Soft romantic updo
- `gallery-updo-02.webp` — Sleek modern updo

**Pinterest brief pattern:** Search "{service type} transformation before after" — these get reposted enough that you can find clean reference shots.

**Specs:** 4:5 aspect (matches IG). Source 800×1000, served responsively via `next/image`.

---

## ABOUT (single owner photo)

### `/public/images/owner-portrait.webp`

- **Pinterest (placeholder only):** "hair stylist portrait professional natural light"
- **Vibe:** confident but warm. Slight smile, looking at camera or slightly off-camera. Salon environment as soft background.
- **Avoid:** stiff studio portraits, fluorescent lighting, awkward smiles
- **Specs:** 800×1000 (4:5 aspect), WebP
- **Alt:** `{{STYLIST_NAME}}, hair stylist at {{BUSINESS_NAME}}`

> **MUST be a real photo before launch.** AI-generated or stock portraits break trust instantly with beauty clients. Use Pinterest only as a placeholder during build.

---

## INSTAGRAM FEED

MVP: 6 placeholder tiles using `placehold.co`. Real embed in P2 (Instafeed.js — free, no API key needed for public profiles).

Placeholder briefs:
- `ig-placeholder-01` through `ig-placeholder-06` — labeled "Recent IG post" each

---

## OG / SOCIAL SHARE IMAGE

### `/public/images/og-share.webp` (or generated via `/app/opengraph-image.tsx`)

- **Dimensions:** 1200×630 exact
- **Content:** Business name + tagline + brand-color background + one hero shot
- **Used by:** iMessage, Slack, IG link previews, Twitter cards
- **Recommendation:** Generate dynamically with `/app/opengraph-image.tsx` using `next/og` — easier than maintaining a static file per client

---

## FAVICON / LOGO ASSETS

- `/public/favicon.ico` — 32×32
- `/public/icon.svg` — modern browsers, scalable
- `/public/apple-touch-icon.png` — 180×180 for iOS home screen
- `/public/logo-light.svg` — for dark backgrounds (nav over hero)
- `/public/logo-dark.svg` — for light backgrounds (footer)

Each client deployment swaps these in `/public/`. The template ships with generic placeholders.

---

## Image performance checklist (before launch)

- [ ] All Pinterest placeholders replaced with real photos
- [ ] All images converted to WebP (`next/image` does this automatically)
- [ ] Hero image preloaded with `priority` prop
- [ ] Every below-the-fold image has `loading="lazy"`
- [ ] Every image has descriptive `alt` text (briefs above)
- [ ] `next/image` `sizes` prop set correctly (e.g. `sizes="(max-width: 768px) 100vw, 50vw"`)
- [ ] No image larger than 500KB at the served size
- [ ] OG image renders correctly in iMessage + Slack preview
- [ ] Owner photo is real (not Pinterest, not AI)
- [ ] No cumulative layout shift (CLS) on image loads — width/height attributes always present

---

## When upgrading to real photography

Recommend the client invest in a 1-2 hour photo session:
- Portrait of them (used as owner photo + IG profile)
- 6-10 hero shots of work in progress
- 12-18 before/after pairs of recent clients
- 3-5 ambient salon shots for hero/about background

Total cost: ~$300-600 for a local photographer. Big ROI vs the alternative of stock or AI-generated photos that kill credibility.
