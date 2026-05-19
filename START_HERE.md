# START_HERE.md

> Read this first. It tells you what's in this folder and exactly what to do when you open Claude Code.

## What this is

A complete planning kit for the Monty's Media **hair salon site template** — a reusable Next.js project you'll deploy across multiple solo-stylist clients. Free to start, mobile-first, custom admin-managed booking with Stripe deposits.

## How to use

1. **Drop every `.md` file in this folder into the root of your new Claude Code project.**
2. Open Claude Code in that directory.
3. Set `/model opusplan` (Opus plans, Sonnet executes — recommended).
4. Paste **The First Prompt** below.
5. After Claude Code confirms it's read everything, walk through prompts in `MASTER_PROMPT.md` in order.

## The First Prompt (paste this into a fresh Claude Code session)

```
I'm starting a new project: a hair salon site template for solo stylists,
built by Monty's Media. The full spec is in the markdown files in this
repo root.

Read these files in order, then confirm:

1. CLAUDE.md — project rules and conventions
2. PLAN.md — master spec (what we're building and why)
3. STRUCTURE.md — page sections, components, routes
4. BOOKING.md — custom booking system spec (schema, flow, Stripe)
5. DESIGN.md — vibe presets, mobile-first design system, approved free tools
6. SERVICES.md — service menu + pricing
7. CONTENT.md — all site copy
8. IMAGES.md — image slot briefs and placeholder strategy
9. FEATURES.md — feature priorities (MVP / P2 / Later)
10. MASTER_PROMPT.md — the build sequence

After reading, tell me:
- Which docs you loaded and a one-line summary of each
- Any inconsistencies or open questions you spotted
- Whether the scope is clear enough to start building

Don't write any code yet. Once you confirm, I'll paste PROMPT 1 from
MASTER_PROMPT.md to scaffold the project.
```

## File map

| File | What it's for | Read when |
|---|---|---|
| `START_HERE.md` | **This file.** Quick reference. | Once, right now |
| `CLAUDE.md` | Conventions, hard rules, "done" definition | Every session (Claude Code auto-loads) |
| `PLAN.md` | Master spec, strategy, scope | Every session bootstrap |
| `STRUCTURE.md` | Page sections, components, routes | Building site shell or layout work |
| `BOOKING.md` | Booking flow, DB schema, Stripe webhook | Building anything booking-related |
| `DESIGN.md` | Vibe presets, mobile-first system, approved tools | Styling work, design decisions |
| `SERVICES.md` | Service menu + LA pricing | Seeding DB, building service cards |
| `CONTENT.md` | All copy: headlines, CTAs, FAQs | Wiring text anywhere |
| `IMAGES.md` | Image slot briefs (Pinterest placeholders) | Adding any `<img>` |
| `FEATURES.md` | MVP / P2 / Later feature priorities | Scope discussions, "should we add X?" |
| `MASTER_PROMPT.md` | Sequential build prompts | At the start of each build session |

## Workflow at a glance

1. **First Prompt** (above) → Claude Code reads docs and confirms understanding
2. **PROMPT 1** from MASTER_PROMPT.md → scaffold Next.js + Tailwind + Supabase + Stripe
3. **PROMPT 2** → database schema + seed services
4. **PROMPT 3** → public marketing site (mobile-first)
5. **PROMPT 4** → admin panel (so you can seed availability)
6. **PROMPT 5** → public booking flow + Stripe Checkout + webhook
7. **PROMPT 6** → polish, SEO, Lighthouse audit
8. **PROMPT N** (in MASTER_PROMPT.md) → per-client deployment recipe (reuse forever)

Commit after each prompt. Run `/clear` between prompts so context stays fresh.

## What you need before starting

- Node 20+ installed locally
- A new GitHub repo (empty)
- A Supabase project (free tier — supabase.com)
- A Stripe account in test mode (stripe.com)
- A Resend account (free tier — resend.com)
- A Vercel account (you'll deploy here when ready)

Set up the accounts first, then keep the API keys handy for `.env.local` later. PROMPT 1 will tell you exactly which env vars you need.

## Quick reminders

- **Mobile-first.** Design at 375px width first. 70% of salon traffic is phones.
- **Free tier only.** No paid services in the MVP stack. Stripe is the only paid thing and it's per-transaction.
- **One stylist.** Solo target. Multi-stylist is a future paid upgrade, not in scope now.
- **No code without a plan.** Plan mode for anything touching >2 files.
- **One task per session.** `/clear` between major prompts.
