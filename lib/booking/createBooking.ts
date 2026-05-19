"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { clientConfig } from "@/client.config";
import { stripe } from "@/lib/stripe/client";

const BookingInputSchema = z.object({
  service_id: z.string().uuid(),
  starts_at: z.string().datetime(),
  ends_at: z.string().datetime(),
  customer_name: z.string().min(1).max(200),
  customer_email: z.string().email(),
  customer_phone: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export type BookingInput = z.infer<typeof BookingInputSchema>;

export type CreateBookingResult =
  | { success: true; checkoutUrl: string; bookingId: string }
  | { success: true; confirmed: true; bookingId: string }
  | { success: false; error: string; slotTaken?: boolean };

export async function createBooking(
  input: BookingInput
): Promise<CreateBookingResult> {
  // 1. Validate input
  const parsed = BookingInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid booking data",
    };
  }
  const data = parsed.data;

  const supabase = createAdminClient();

  // 2. Fetch the service
  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("id, name, price_cents, deposit_cents, duration_min, is_active")
    .eq("id", data.service_id)
    .single();

  if (serviceError || !service) {
    return { success: false, error: "Service not found." };
  }
  if (!service.is_active) {
    return { success: false, error: "This service is no longer available." };
  }

  // 3. Re-check slot availability server-side
  const { data: overlapping } = await supabase
    .from("bookings")
    .select("id")
    .in("status", ["pending", "confirmed"])
    .lt("starts_at", data.ends_at)
    .gt("ends_at", data.starts_at);

  if (overlapping && overlapping.length > 0) {
    return {
      success: false,
      error: "That slot was just taken — please pick another.",
      slotTaken: true,
    };
  }

  // 4. Insert booking as 'pending'
  const { data: booking, error: insertError } = await supabase
    .from("bookings")
    .insert({
      service_id: data.service_id,
      starts_at: data.starts_at,
      ends_at: data.ends_at,
      customer_name: data.customer_name,
      customer_email: data.customer_email,
      customer_phone: data.customer_phone ?? null,
      notes: data.notes ?? null,
      status: "pending",
      deposit_paid_cents: 0,
    })
    .select("id")
    .single();

  if (insertError || !booking) {
    // GIST exclusion constraint fires here if there's a race condition
    if (insertError?.code === "23P01") {
      return {
        success: false,
        error: "That slot was just taken — please pick another.",
        slotTaken: true,
      };
    }
    return { success: false, error: "Failed to create booking. Please try again." };
  }

  // 5. Compute deposit
  const depositCents =
    service.deposit_cents > 0
      ? service.deposit_cents
      : Math.round(
          (service.price_cents * clientConfig.booking.defaultDepositPercent) / 100
        );

  // 6. Free consult — confirm immediately, skip Stripe
  if (depositCents === 0) {
    await supabase
      .from("bookings")
      .update({ status: "confirmed" })
      .eq("id", booking.id);

    // Send confirmation email (fire-and-forget; errors logged but not surfaced)
    try {
      const { sendBookingConfirmation } = await import("@/lib/email/sendBookingConfirmation");
      await sendBookingConfirmation({
        bookingId: booking.id,
        customerName: data.customer_name,
        customerEmail: data.customer_email,
        serviceName: service.name,
        startsAt: data.starts_at,
      });
    } catch (e) {
      console.error("Failed to send confirmation email:", e);
    }

    return { success: true, confirmed: true, bookingId: booking.id };
  }

  // 7. Create Stripe Checkout session
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: depositCents,
          product_data: {
            name: `${service.name} — Deposit`,
            description: `Appointment deposit. Remaining balance due at appointment.`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      booking_id: booking.id,
    },
    success_url: `${origin}/booking/confirm?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/#book?cancelled=1`,
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 min
  });

  // 8. Store stripe_session_id on the booking
  await supabase
    .from("bookings")
    .update({ stripe_session_id: session.id })
    .eq("id", booking.id);

  return {
    success: true,
    checkoutUrl: session.url!,
    bookingId: booking.id,
  };
}
