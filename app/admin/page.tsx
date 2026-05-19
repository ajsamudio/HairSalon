import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { clientConfig } from "@/client.config";

function formatDate(date: Date, timeZone: string) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone,
  });
}

function formatTime(isoString: string, timeZone: string) {
  return new Date(isoString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone,
  });
}

function formatDayHeading(isoString: string, timeZone: string) {
  return new Date(isoString).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    timeZone,
  });
}

export default async function AdminDashboard() {
  const tz = clientConfig.business.timezone;
  const now = new Date();

  const todayStart = new Date(
    now.toLocaleDateString("en-CA", { timeZone: tz }) + "T00:00:00"
  );
  const todayEnd = new Date(
    now.toLocaleDateString("en-CA", { timeZone: tz }) + "T23:59:59"
  );
  const weekEnd = new Date(todayStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  let todayBookings: {
    id: string;
    customer_name: string;
    starts_at: string;
    status: string;
    services: { name: string } | null;
  }[] = [];
  let upcomingBookings: typeof todayBookings = [];

  try {
    const supabase = createAdminClient();

    const { data: todayData } = await supabase
      .from("bookings")
      .select("id, customer_name, starts_at, status, services(name)")
      .gte("starts_at", todayStart.toISOString())
      .lte("starts_at", todayEnd.toISOString())
      .in("status", ["pending", "confirmed"])
      .order("starts_at");

    const { data: upcomingData } = await supabase
      .from("bookings")
      .select("id, customer_name, starts_at, status, services(name)")
      .gt("starts_at", todayEnd.toISOString())
      .lte("starts_at", weekEnd.toISOString())
      .in("status", ["pending", "confirmed"])
      .order("starts_at");

    todayBookings = (todayData as typeof todayBookings) ?? [];
    upcomingBookings = (upcomingData as typeof upcomingBookings) ?? [];
  } catch {
    // DB not connected yet — show empty state
  }

  // Group upcoming by day label
  const upcomingByDay = upcomingBookings.reduce<
    Record<string, typeof upcomingBookings>
  >((acc, b) => {
    const day = formatDayHeading(b.starts_at, tz);
    (acc[day] ??= []).push(b);
    return acc;
  }, {});

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      confirmed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      cancelled: "bg-gray-100 text-gray-600",
      completed: "bg-blue-100 text-blue-800",
      no_show: "bg-red-100 text-red-800",
    };
    return map[status] ?? "bg-gray-100 text-gray-600";
  };

  return (
    <div className="max-w-3xl">
      <h1 className="font-heading text-2xl md:text-3xl font-bold text-ink mb-1">
        Dashboard
      </h1>
      <p className="text-ink-soft text-sm mb-8">{formatDate(now, tz)}</p>

      {/* Today card */}
      <section className="mb-8">
        <h2 className="text-base font-semibold text-ink mb-3">
          Today
          <span className="ml-2 text-ink-soft font-normal text-sm">
            {todayBookings.length} booking{todayBookings.length !== 1 ? "s" : ""}
          </span>
        </h2>
        {todayBookings.length === 0 ? (
          <p className="text-ink-soft text-sm py-4 border border-line rounded-xl px-4">
            No bookings today.
          </p>
        ) : (
          <div className="rounded-xl border border-line overflow-hidden">
            {todayBookings.map((b, i) => (
              <div
                key={b.id}
                className={`flex items-center justify-between gap-4 px-4 py-3 ${
                  i !== 0 ? "border-t border-line" : ""
                }`}
              >
                <div>
                  <p className="font-medium text-ink text-sm">{b.customer_name}</p>
                  <p className="text-xs text-ink-soft">
                    {b.services?.name} · {formatTime(b.starts_at, tz)}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusBadge(b.status)}`}
                >
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Upcoming section */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-ink mb-3">Next 7 days</h2>
        {Object.keys(upcomingByDay).length === 0 ? (
          <p className="text-ink-soft text-sm py-4 border border-line rounded-xl px-4">
            No upcoming bookings in the next 7 days.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {Object.entries(upcomingByDay).map(([day, bookings]) => (
              <div key={day}>
                <p className="text-xs font-semibold text-ink-soft uppercase tracking-wide mb-2">
                  {day}
                </p>
                <div className="rounded-xl border border-line overflow-hidden">
                  {bookings.map((b, i) => (
                    <div
                      key={b.id}
                      className={`flex items-center justify-between gap-4 px-4 py-3 ${
                        i !== 0 ? "border-t border-line" : ""
                      }`}
                    >
                      <div>
                        <p className="font-medium text-ink text-sm">{b.customer_name}</p>
                        <p className="text-xs text-ink-soft">
                          {b.services?.name} · {formatTime(b.starts_at, tz)}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusBadge(b.status)}`}
                      >
                        {b.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/availability"
          className="min-h-[44px] px-5 rounded-xl border border-accent text-accent font-semibold text-sm flex items-center hover:bg-accent/5 transition-colors"
        >
          Manage Availability
        </Link>
        <Link
          href="/admin/services"
          className="min-h-[44px] px-5 rounded-xl border border-accent text-accent font-semibold text-sm flex items-center hover:bg-accent/5 transition-colors"
        >
          Manage Services
        </Link>
      </div>
    </div>
  );
}
