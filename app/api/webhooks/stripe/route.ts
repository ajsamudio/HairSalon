import { NextResponse, type NextRequest } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendBookingConfirmation } from "@/lib/email/sendBookingConfirmation";
import type Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook error";
    console.error("Stripe webhook signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const supabase = createAdminClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.booking_id;

    if (!bookingId) {
      console.error("checkout.session.completed: no booking_id in metadata");
      return NextResponse.json({ received: true });
    }

    const depositPaidCents = session.amount_total ?? 0;

    // Mark booking confirmed
    const { data: booking, error } = await supabase
      .from("bookings")
      .update({
        status: "confirmed",
        deposit_paid_cents: depositPaidCents,
        stripe_payment_intent:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : null,
      })
      .eq("id", bookingId)
      .select(
        "id, customer_name, customer_email, starts_at, service_id"
      )
      .single();

    if (error || !booking) {
      console.error("Failed to confirm booking:", error?.message);
      // Return 200 so Stripe doesn't retry — log for manual resolution
      return NextResponse.json({ received: true });
    }

    // Fetch service name for email
    const { data: service } = await supabase
      .from("services")
      .select("name")
      .eq("id", booking.service_id)
      .single();

    // Send confirmation email
    try {
      await sendBookingConfirmation({
        bookingId: booking.id,
        customerName: booking.customer_name,
        customerEmail: booking.customer_email,
        serviceName: service?.name ?? "your service",
        startsAt: booking.starts_at,
      });
    } catch (e) {
      console.error("Failed to send confirmation email:", e);
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.booking_id;

    if (bookingId) {
      await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", bookingId)
        .eq("status", "pending"); // only cancel if still pending
    }
  }

  return NextResponse.json({ received: true });
}
