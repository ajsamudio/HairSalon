"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function cancelBooking(
  bookingId: string
): Promise<{ success?: true; error?: string }> {
  const supabase = createAdminClient();

  // Fetch booking details before cancelling (for email)
  const { data: booking } = await supabase
    .from("bookings")
    .select("customer_name, customer_email, starts_at, services(name)")
    .eq("id", bookingId)
    .single();

  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId);

  if (error) return { error: error.message };

  // Send cancellation email
  if (booking) {
    try {
      const { sendBookingCancellation } = await import(
        "@/lib/email/sendBookingConfirmation"
      );
      const b = booking as typeof booking & { services: { name: string } | null };
      await sendBookingCancellation({
        customerName: b.customer_name,
        customerEmail: b.customer_email,
        serviceName: b.services?.name ?? "your appointment",
        startsAt: b.starts_at,
      });
    } catch (e) {
      console.error("Failed to send cancellation email:", e);
    }
  }

  revalidatePath("/admin/bookings");
  return { success: true };
}
