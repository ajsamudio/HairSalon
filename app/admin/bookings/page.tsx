import { createAdminClient } from "@/lib/supabase/admin";
import BookingsList from "@/components/admin/BookingsList";
import type { BookingRow, ServiceRow } from "@/types/database";

export type BookingWithService = BookingRow & {
  service_name: string | null;
};

export default async function BookingsPage() {
  let bookings: BookingWithService[] = [];

  try {
    const supabase = createAdminClient();

    const { data: bookingData } = await supabase
      .from("bookings")
      .select("*")
      .order("starts_at", { ascending: false });

    const { data: serviceData } = await supabase
      .from("services")
      .select("id, name");

    const serviceMap = new Map<string, string>(
      ((serviceData as Pick<ServiceRow, "id" | "name">[]) ?? []).map((s) => [
        s.id,
        s.name,
      ])
    );

    bookings = ((bookingData as BookingRow[]) ?? []).map((b) => ({
      ...b,
      service_name: serviceMap.get(b.service_id) ?? null,
    }));
  } catch {
    // DB not connected yet
  }

  return (
    <div className="max-w-4xl">
      <h1 className="font-heading text-2xl md:text-3xl font-bold text-ink mb-1">
        Bookings
      </h1>
      <p className="text-ink-soft text-sm mb-8">
        View and manage all client bookings.
      </p>
      <BookingsList bookings={bookings} />
    </div>
  );
}
