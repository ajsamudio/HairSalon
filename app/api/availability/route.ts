import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { generateSlots } from "@/lib/booking/availability";
import { clientConfig } from "@/client.config";
import type { Database } from "@/types/database";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const serviceId = searchParams.get("service_id");
  const from = searchParams.get("from"); // YYYY-MM-DD
  const to = searchParams.get("to");     // YYYY-MM-DD

  if (!serviceId || !from || !to) {
    return NextResponse.json(
      { error: "service_id, from, and to are required" },
      { status: 400 }
    );
  }

  // Validate date format
  const dateRe = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRe.test(from) || !dateRe.test(to)) {
    return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  // Fetch service
  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("duration_min, deposit_cents, price_cents, is_active")
    .eq("id", serviceId)
    .single();

  if (serviceError || !service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  if (!service.is_active) {
    return NextResponse.json({ error: "Service not available" }, { status: 400 });
  }

  // Fetch availability rules (active only)
  const { data: rules } = await supabase
    .from("availability_rules")
    .select("day_of_week, start_time, end_time")
    .eq("is_active", true);

  // Fetch overrides in the date range
  const { data: overrides } = await supabase
    .from("availability_overrides")
    .select("date, start_time, end_time")
    .gte("date", from)
    .lte("date", to);

  // Fetch existing bookings in the range (pending or confirmed)
  const fromUTC = new Date(`${from}T00:00:00Z`).toISOString();
  const toUTC = new Date(`${to}T23:59:59Z`).toISOString();

  const { data: existingBookings } = await supabase
    .from("bookings")
    .select("starts_at, ends_at")
    .gte("starts_at", fromUTC)
    .lte("starts_at", toUTC)
    .in("status", ["pending", "confirmed"]);

  const { booking } = clientConfig;

  const slots = generateSlots({
    durationMin: service.duration_min,
    slotStepMinutes: booking.slotStepMinutes,
    minNoticeMs: booking.minNoticeHours * 60 * 60 * 1000,
    timezone: clientConfig.business.timezone,
    fromDate: new Date(`${from}T00:00:00Z`),
    toDate: new Date(`${to}T23:59:59Z`),
    rules: rules ?? [],
    overrides: overrides ?? [],
    existingBookings: existingBookings ?? [],
  });

  return NextResponse.json({ slots }, { status: 200 });
}
