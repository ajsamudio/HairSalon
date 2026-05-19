# Hair Salon Site Template

By **Monty's Media**. A mobile-first website + booking + payments template for solo stylists. Free to start — clients pay $0/month in fixed platform fees.

---

## Local development

**Requirements:** Node 20+, a Supabase project, a Stripe account (test mode), a Resend account.

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Fill in the values (see "Environment variables" below)

# 3. Run the dev server
npm run dev
# → http://localhost:3000

# 4. Type-check
npm run typecheck

# 5. Lint
npm run lint
```

---

## Environment variables

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase project → Settings → API (never expose to client) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe dashboard → Developers → API keys |
| `STRIPE_SECRET_KEY` | Stripe dashboard → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | `stripe listen --forward-to localhost:3000/api/webhooks/stripe` |
| `RESEND_API_KEY` | Resend dashboard → API Keys |

> Use `sk_test_*` Stripe keys until explicitly going live.

---

## Per-client deployment recipe

Each new client = a fork of this repo with three things changed:

1. **`client.config.ts`** — swap all business, brand, social, booking, admin, and SEO values
2. **`/content/`** — update `services.ts`, `faqs.ts`, `reviews.ts`, `about.ts` for this client
3. **`/public/images/`** — replace placeholder images with real photography

Then:

```bash
# Create a new Supabase project for the client
# Run migrations:
npx supabase db push

# Create a new Stripe account for the client (they own it)
# Add env vars to Vercel

# Deploy
vercel --prod
```

No code changes in `/components`, `/lib`, or `/app` — only config, content, and images.

---

## Free-to-start cost breakdown

| Item | Cost | Notes |
|---|---|---|
| Domain name | ~$12/year | Client buys it — never under your account |
| Vercel hosting | Free | Hobby tier handles normal salon traffic |
| Supabase (DB + auth) | Free | 500MB DB, 50k MAU, 5GB bandwidth |
| Stripe (payments) | 2.9% + 30¢/txn | Only on actual deposit revenue |
| Resend (emails) | Free | 3,000/month, 100/day |
| Google Fonts | Free | Self-hosted via `next/font` |
| **Monthly fixed cost** | **$0** | |

> **Note on Vercel free tier:** Technically for non-commercial use. Once the client is consistently booking, recommend upgrading to Vercel Pro ($20/mo) for ToS compliance. Still far cheaper than GlossGenius ($24–48/mo) with zero data portability.

**Realistic monthly Stripe fees** for 30 bookings at $50 avg deposit: ~$45 on $1,500 of deposit revenue — same fee structure as any platform, no subscription on top.

---

## Build sequence

See `MASTER_PROMPT.md` for the full sequential build prompts:

1. **PROMPT 1** — scaffold (this step) ✓
2. **PROMPT 2** — database schema + seed services
3. **PROMPT 3** — public marketing site (mobile-first)
4. **PROMPT 4** — admin panel
5. **PROMPT 5** — public booking flow + Stripe + webhook
6. **PROMPT 6** — polish, SEO, Lighthouse audit
