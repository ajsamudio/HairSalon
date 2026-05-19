import Stripe from "stripe";

// Lazy-initialized so the module doesn't throw at build time when env vars aren't set.
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY environment variable is not set.");
    }
    _stripe = new Stripe(key, { apiVersion: "2026-04-22.dahlia" });
  }
  return _stripe;
}

// Named export for backward compat — use getStripe() in server-only code.
// This will throw at module evaluation time if the key is missing,
// so prefer getStripe() in route handlers and Server Actions.
export const stripe = {
  get checkout() { return getStripe().checkout; },
  get webhooks() { return getStripe().webhooks; },
  get paymentIntents() { return getStripe().paymentIntents; },
} as unknown as Stripe;
