# SERVICES.md — Service Menu + Pricing

LA-area mid-market ranges for 2026. Each service has experience-led name, plain name (for SEO/alt text), duration, price, and deposit rules. Per-client deployments shift prices up or down based on positioning.

Every service has:
- **Name** (experience-led, used on the site)
- **Slug** (used in URLs, alt text, DB)
- **Plain name** (search-friendly)
- **Duration**
- **Price range** (mid-market LA default)
- **Deposit** (25% on services ≥ 90 min, $0 on shorter ones)

---

## 💇 CUTS

| Name | Slug | Duration | Price | Deposit |
|---|---|---|---|---|
| Precision Cut & Style Consultation | `precision-cut` | 60-75 min | $75-110 | $0 |
| Signature Men's Cut | `mens-cut` | 45 min | $45-70 | $0 |
| Buzz / Skin Fade | `buzz-fade` | 30 min | $35-50 | $0 |
| Beard Trim & Shape | `beard-trim` | 20-30 min | $25-40 | $0 |
| The Combo (Cut + Beard) | `cut-beard-combo` | 60 min | $65-95 | $0 |
| Hot Towel Shave | `straight-shave` | 45 min | $45-70 | $0 |
| Kids' Cut (12 & under) | `kids-cut` | 30 min | $30-45 | $0 |
| Bang Trim | `bang-trim` | 15 min | $15-25 | $0 |

Descriptions in `CONTENT.md`. One-line per card on the site.

---

## 🎨 COLOR

| Name | Slug | Duration | Price | Deposit |
|---|---|---|---|---|
| Single Process Color | `single-process` | 90-120 min | $95-150 | 25% |
| Root Touch-Up | `root-touchup` | 60-90 min | $80-120 | $0 |
| Gloss / Toner | `gloss` | 30-45 min | $45-70 | $0 |
| Partial Highlights | `partial-highlights` | 90-150 min | $135-195 | 25% |
| Full Highlights | `full-highlights` | 150-180 min | $185-285 | 25% |
| Balayage — Partial | `balayage-partial` | 120-150 min | $210-310 | 25% |
| Balayage — Full | `balayage-full` | 180-240 min | $285-425 | 25% |
| Babylights | `babylights` | 180-240 min | $215-365 | 25% |
| Frosted Tips | `frosted-tips` | 60-90 min | $95-160 | $0 |
| Ombré / Sombré | `ombre` | 150-210 min | $210-360 | 25% |
| Vivid / Fashion Color | `vivid-color` | 180+ min | $215-465 | 25%, **consult required** |
| Color Correction | `color-correction` | 240+ min | From $265 | 25%, **consult required** |
| Gray Blending | `gray-blending` | 60-90 min | $95-150 | $0 |

---

## ✨ TREATMENTS

| Name | Slug | Duration | Price | Deposit |
|---|---|---|---|---|
| Deep Conditioning Treatment | `deep-conditioning` | 20-30 min | $40-60 | $0 |
| Olaplex Bond Repair (Add-on) | `olaplex` | +20 min | $40-65 | $0 |
| K18 Molecular Repair (Add-on) | `k18` | +15 min | $50-80 | $0 |
| Keratin Smoothing Treatment | `keratin` | 120-180 min | $265-465 | 25% |
| Brazilian Blowout | `brazilian-blowout` | 90 min | $315-485 | 25% |
| Scalp Detox Treatment | `scalp-detox` | 30 min | $55-85 | $0 |

---

## 💁 STYLING

| Name | Slug | Duration | Price | Deposit |
|---|---|---|---|---|
| Express Blowout | `blowout` | 45 min | $55-80 | $0 |
| Special Occasion Styling | `updo` | 60-90 min | $95-165 | 25% |
| Bridal Hair (Trial) | `bridal-trial` | 90 min | From $165 | 25% |
| Bridal Hair (Day-of) | `bridal-day` | 90-120 min | From $245 | 25%, **consult required** |
| Wedding Party Styling | `wedding-party` | 45-60 min/person | From $115/person | 25%, **consult required** |

---

## 💎 EXTENSIONS

| Name | Slug | Duration | Price | Deposit |
|---|---|---|---|---|
| Tape-In Extensions | `tape-in-extensions` | 120-180 min | From $415 + hair | 25%, **consult required** |
| Hand-Tied Wefts | `hand-tied-extensions` | 180-240 min | From $815 + hair | 25%, **consult required** |
| Extension Maintenance | `extension-maintenance` | 90-120 min | $165-315 | 25% |

---

## 🔥 ADD-ONS

| Add-on | Time | Price |
|---|---|---|
| Olaplex / K18 bond repair | +15-20 min | $40-80 |
| Toner / Gloss | +30 min | $45-70 |
| Scalp massage upgrade | +10 min | $20 |
| Express blowout (after color) | +30 min | $35-50 |
| Bang trim (with any service) | +10 min | $0-15 |

---

## Booking system notes

- **Deposit rule:** services ≥ 90 min require 25% deposit. Implemented at the `services` table row level via `deposit_cents`.
- **Consultation required:** services flagged `requires_consult = true` should show a "Consult Required" badge on the card and route through a consult-request form instead of direct booking (P2). For MVP, allow booking but include "We'll confirm timing after a brief consult" in confirmation email.
- **Free consultations (0 deposit):** if `deposit_cents = 0`, skip Stripe entirely — booking is auto-confirmed.
- **Cancellation policy** (in confirmation email + FAQ): >24h = full refund (manual via Stripe dashboard). 0-24h = forfeit deposit. No-show = 50% (card-on-file is P2).

## Per-client customization checklist

When deploying for a real client:
- [ ] Confirm which services they actually offer — delete the rest
- [ ] Adjust prices to match their positioning (luxury can run 30-60% above defaults)
- [ ] Add any signature services unique to them (give those a hero card + photo)
- [ ] Confirm duration with the stylist — accurate times = accurate booking calendar
- [ ] Decide which services require consultation (mark `requires_consult = true`)
- [ ] Confirm deposit amounts — some clients want fixed dollar deposits instead of 25%
