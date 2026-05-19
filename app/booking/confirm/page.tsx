import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { clientConfig } from "@/client.config";

interface Props {
  searchParams: { session_id?: string; booking_id?: string };
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: clientConfig.business.timezone,
  });
}

export default async function BookingConfirmPage({ searchParams }: Props) {
  const { session_id, booking_id } = searchParams;

  let booking: {
    id: string;
    customer_name: string;
    customer_email: string;
    starts_at: string;
    service_name: string | null;
    deposit_paid_cents: number;
    status: string;
  } | null = null;

  try {
    const supabase = createAdminClient();

    if (session_id) {
      const { data } = await supabase
        .from("bookings")
        .select(
          "id, customer_name, customer_email, starts_at, deposit_paid_cents, status, services(name)"
        )
        .eq("stripe_session_id", session_id)
        .single();

      if (data) {
        const b = data as typeof data & { services: { name: string } | null };
        booking = {
          id: b.id,
          customer_name: b.customer_name,
          customer_email: b.customer_email,
          starts_at: b.starts_at,
          service_name: b.services?.name ?? null,
          deposit_paid_cents: b.deposit_paid_cents,
          status: b.status,
        };
      }
    } else if (booking_id) {
      const { data } = await supabase
        .from("bookings")
        .select(
          "id, customer_name, customer_email, starts_at, deposit_paid_cents, status, services(name)"
        )
        .eq("id", booking_id)
        .single();

      if (data) {
        const b = data as typeof data & { services: { name: string } | null };
        booking = {
          id: b.id,
          customer_name: b.customer_name,
          customer_email: b.customer_email,
          starts_at: b.starts_at,
          service_name: b.services?.name ?? null,
          deposit_paid_cents: b.deposit_paid_cents,
          status: b.status,
        };
      }
    }
  } catch {
    // DB not connected — show generic confirmation
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle
            className="w-16 h-16 text-green-500"
            aria-hidden
          />
        </div>

        <h1 className="font-heading text-2xl md:text-3xl font-bold text-ink mb-2">
          You&apos;re booked!
        </h1>

        {booking ? (
          <>
            <p className="text-ink-soft mb-6">
              See you{" "}
              <span className="text-ink font-medium">
                {formatDateTime(booking.starts_at)}
              </span>
              .
            </p>

            <div className="rounded-2xl border border-line bg-surface p-5 text-left mb-6 flex flex-col gap-3">
              {booking.service_name && (
                <div>
                  <p className="text-xs text-ink-soft">Service</p>
                  <p className="font-medium text-ink">{booking.service_name}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-ink-soft">Date & time</p>
                <p className="font-medium text-ink">
                  {formatDateTime(booking.starts_at)}
                </p>
              </div>
              <div>
                <p className="text-xs text-ink-soft">Location</p>
                <p className="font-medium text-ink">
                  {clientConfig.business.address}
                </p>
              </div>
              <div>
                <p className="text-xs text-ink-soft">Confirmation to</p>
                <p className="font-medium text-ink">{booking.customer_email}</p>
              </div>
              {booking.deposit_paid_cents > 0 && (
                <div>
                  <p className="text-xs text-ink-soft">Deposit paid</p>
                  <p className="font-medium text-ink">
                    ${(booking.deposit_paid_cents / 100).toFixed(0)}
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <p className="text-ink-soft mb-6">
            A confirmation email is on its way to you.
          </p>
        )}

        <p className="text-sm text-ink-soft mb-6">
          Questions? Contact us at{" "}
          <a
            href={`tel:${clientConfig.business.phone.replace(/\D/g, "")}`}
            className="text-accent hover:underline"
          >
            {clientConfig.business.phone}
          </a>{" "}
          or{" "}
          <a
            href={`mailto:${clientConfig.business.email}`}
            className="text-accent hover:underline"
          >
            {clientConfig.business.email}
          </a>
          .
        </p>

        <Link
          href="/"
          className="inline-flex items-center min-h-[48px] px-6 rounded-xl bg-accent text-white font-semibold hover:brightness-95 transition-all"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
