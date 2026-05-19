# Image Slots — How to Replace Placeholders

Drop your real photos into this folder, then update the source paths in the components listed below.

---

## 1. Hero background
**File to add:** `public/images/hero.jpg`  
**Ideal size:** 1600×900px, landscape, compressed to <300 KB  
**Edit:** [`components/sections/Hero.tsx:14`](../../components/sections/Hero.tsx)  
Change:
```
src="https://placehold.co/1600x900.png?text=Hero+Image..."
```
To:
```
src="/images/hero.jpg"
```

---

## 2. Owner/stylist portrait
**File to add:** `public/images/owner.jpg`  
**Ideal size:** 800×1000px, portrait orientation, compressed to <200 KB  
**Edit:** [`components/sections/About.tsx:22`](../../components/sections/About.tsx)  
Change:
```
src="https://placehold.co/800x1000.png?text=Owner+Portrait"
```
To:
```
src="/images/owner.jpg"
```

---

## 3. Gallery (16 images)

Put photos in `public/images/gallery/`. Name them however you want — suggested names below.  
**Ideal size per image:** 600×750px (4:5 ratio), compressed to <150 KB each  
**Edit:** [`components/sections/Gallery.tsx:27-43`](../../components/sections/Gallery.tsx) — update the `src` in each `galleryItems` entry.

| Slot | Suggested filename | Category |
|---|---|---|
| 1 | `cut-bob.jpg` | cuts |
| 2 | `cut-curtain-bangs.jpg` | cuts |
| 3 | `cut-mens-crop.jpg` | cuts |
| 4 | `cut-long-layers.jpg` | cuts |
| 5 | `color-brunette.jpg` | color |
| 6 | `color-copper-red.jpg` | color |
| 7 | `color-platinum.jpg` | color |
| 8 | `color-dimensional.jpg` | color |
| 9 | `balayage-bronde.jpg` | balayage |
| 10 | `balayage-money-piece.jpg` | balayage |
| 11 | `balayage-sombre.jpg` | balayage |
| 12 | `balayage-babylights.jpg` | balayage |
| 13 | `extensions-before-after.jpg` | extensions |
| 14 | `extensions-volume.jpg` | extensions |
| 15 | `updo-romantic.jpg` | updos |
| 16 | `updo-sleek.jpg` | updos |

Example update for slot 1:
```
// Before
{ src: "https://placehold.co/600x750.png?text=Modern+bob+clean+lines", ... }

// After
{ src: "/images/gallery/cut-bob.jpg", ... }
```

---

## Tips

- **Compress everything** before committing: use [squoosh.app](https://squoosh.app) (free, in-browser). Target JPEG quality 75-80.
- **No faces without permission.** If using client photos, make sure you have consent.
- **Don't rename the component** — just swap the `src` string. Everything else (alt text, lightbox, categories) stays the same.
- After swapping, you can remove the `placehold.co` entry from `next.config.mjs` `remotePatterns`.
