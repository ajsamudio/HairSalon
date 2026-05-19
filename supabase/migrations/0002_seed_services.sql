-- 0002_seed_services.sql — LA mid-market service menu (2026 pricing)
--
-- Price strategy: price_cents = midpoint of the listed range (rounded to nearest dollar).
-- Display ranges live in /content/services.ts — the DB only needs the value for deposit math.
--
-- Deposit rule per SERVICES.md table:
--   - Most services ≥ 90 min → 25% deposit
--   - Exceptions (explicit in SERVICES.md):
--       root-touchup, frosted-tips, gray-blending → $0 despite straddling 90 min
--       updo → 25% despite max being 90 min
--   - Consult-required services: vivid-color, color-correction, bridal-day,
--     wedding-party, tape-in-extensions, hand-tied-extensions

insert into services
  (slug, name, description, category, duration_min, price_cents, deposit_cents, requires_consult, sort_order)
values

-- ── CUTS ─────────────────────────────────────────────────────────────────────
  ('precision-cut',
   'Precision Cut & Style Consultation',
   'Shampoo, scalp massage, personalized cut, blowout, and styling guidance.',
   'cuts', 68, 9250, 0, false, 1),

  ('mens-cut',
   'Signature Men''s Cut',
   'Clipper or scissor cut tailored to your face shape, finished with product styling.',
   'cuts', 45, 5750, 0, false, 2),

  ('buzz-fade',
   'Buzz / Skin Fade',
   'Clean clipper cut with detailed fade and neckline.',
   'cuts', 30, 4250, 0, false, 3),

  ('beard-trim',
   'Beard Trim & Shape',
   'Hot towel, beard sculpting, and neckline cleanup.',
   'cuts', 25, 3250, 0, false, 4),

  ('cut-beard-combo',
   'The Combo (Cut + Beard)',
   'Signature cut paired with a beard trim and hot towel finish.',
   'cuts', 60, 8000, 0, false, 5),

  ('straight-shave',
   'Hot Towel Shave',
   'Traditional straight razor shave with hot towels and aftershave balm.',
   'cuts', 45, 5750, 0, false, 6),

  ('kids-cut',
   'Kids'' Cut (12 & under)',
   'Patient, kid-friendly haircut.',
   'cuts', 30, 3750, 0, false, 7),

  ('bang-trim',
   'Bang Trim',
   'Quick fringe touch-up between full cuts.',
   'cuts', 15, 2000, 0, false, 8),

-- ── COLOR ────────────────────────────────────────────────────────────────────
  ('single-process',
   'Single Process Color',
   'One uniform color from root to tip — covers gray or shifts your base.',
   'color', 105, 12250, 3063, false, 1),

  ('root-touchup',
   'Root Touch-Up',
   'Refreshes regrowth to match your existing color, every 4–6 weeks.',
   'color', 75, 10000, 0, false, 2),

  ('gloss',
   'Gloss / Toner',
   'Add-on or standalone — boosts shine, neutralizes brass, refreshes tone.',
   'color', 38, 5750, 0, false, 3),

  ('partial-highlights',
   'Partial Highlights',
   'Highlights around the face and crown for dimension without full commitment.',
   'color', 120, 16500, 4125, false, 4),

  ('full-highlights',
   'Full Highlights',
   'All-over foil highlights for maximum brightness and dimension.',
   'color', 165, 23500, 5875, false, 5),

  ('balayage-partial',
   'Balayage — Partial',
   'Hand-painted highlights around the face and ends for a lived-in look.',
   'color', 135, 26000, 6500, false, 6),

  ('balayage-full',
   'Balayage — Full',
   'Full hand-painted color for a seamless, low-maintenance grow-out.',
   'color', 210, 35500, 8875, false, 7),

  ('babylights',
   'Babylights',
   'Ultra-fine foil highlights for the most natural-looking brightness.',
   'color', 210, 29000, 7250, false, 8),

  ('frosted-tips',
   'Frosted Tips',
   'Bleached tips with a tonal finish — modern revival of the classic look.',
   'color', 75, 12750, 0, false, 9),

  ('ombre',
   'Ombré / Sombré',
   'Soft or dramatic gradient from a darker root to lighter ends.',
   'color', 180, 28500, 7125, false, 10),

  ('vivid-color',
   'Vivid / Fashion Color',
   'Pinks, blues, coppers, pastels — full consultation required.',
   'color', 180, 34000, 8500, true, 11),

  ('color-correction',
   'Color Correction',
   'For fixing previous color or major tonal shifts. Always quoted post-consult.',
   'color', 240, 26500, 6625, true, 12),

  ('gray-blending',
   'Gray Blending',
   'Demi-permanent service that softens grays without full coverage.',
   'color', 75, 12250, 0, false, 13),

-- ── TREATMENTS ───────────────────────────────────────────────────────────────
  ('deep-conditioning',
   'Deep Conditioning Treatment',
   'Hydrating mask for thirsty, color-treated, or damaged hair.',
   'treatments', 25, 5000, 0, false, 1),

  ('olaplex',
   'Olaplex Bond Repair',
   'Strengthens bonds during or after a color service.',
   'treatments', 20, 5250, 0, false, 2),

  ('k18',
   'K18 Molecular Repair',
   '4-minute treatment that reverses damage at the molecular level.',
   'treatments', 15, 6500, 0, false, 3),

  ('keratin',
   'Keratin Smoothing Treatment',
   'Frizz reduction and smoothing — lasts 3–5 months.',
   'treatments', 150, 36500, 9125, false, 4),

  ('brazilian-blowout',
   'Brazilian Blowout',
   'Customized smoothing treatment with no harsh fumes.',
   'treatments', 90, 40000, 10000, false, 5),

  ('scalp-detox',
   'Scalp Detox Treatment',
   'Exfoliation and scalp massage to clear buildup and stimulate growth.',
   'treatments', 30, 7000, 0, false, 6),

-- ── STYLING ──────────────────────────────────────────────────────────────────
  ('blowout',
   'Express Blowout',
   'Wash, dry, and style — bouncy, sleek, or beachy.',
   'styling', 45, 6750, 0, false, 1),

  ('updo',
   'Special Occasion Styling',
   'Updos, braids, or down-styles for events, prom, photoshoots.',
   'styling', 75, 13000, 3250, false, 2),

  ('bridal-trial',
   'Bridal Hair (Trial)',
   'Pre-wedding trial to lock in your look.',
   'styling', 90, 16500, 4125, false, 3),

  ('bridal-day',
   'Bridal Hair (Day-of)',
   'Day-of styling — on-location available.',
   'styling', 105, 24500, 6125, true, 4),

  ('wedding-party',
   'Wedding Party Styling',
   'Group bookings — ask about packages.',
   'styling', 53, 11500, 2875, true, 5),

-- ── EXTENSIONS ───────────────────────────────────────────────────────────────
  ('tape-in-extensions',
   'Tape-In Extensions',
   'Semi-permanent, 6–8 week maintenance cycle.',
   'extensions', 150, 41500, 10375, true, 1),

  ('hand-tied-extensions',
   'Hand-Tied Wefts',
   'Premium method for the most natural feel — long-term wear.',
   'extensions', 210, 81500, 20375, true, 2),

  ('extension-maintenance',
   'Extension Maintenance',
   'Repositioning, refresh, and tightening.',
   'extensions', 105, 24000, 6000, false, 3),

-- ── ADD-ONS ───────────────────────────────────────────────────────────────────
  ('scalp-massage-upgrade',
   'Scalp Massage Upgrade',
   'Extended scalp massage added to any service.',
   'add-ons', 10, 2000, 0, false, 1),

  ('express-blowout-addon',
   'Express Blowout (after color)',
   'Blowout and style added on after any color service.',
   'add-ons', 30, 4250, 0, false, 2);
