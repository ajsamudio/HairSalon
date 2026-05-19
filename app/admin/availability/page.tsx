import { createAdminClient } from "@/lib/supabase/admin";
import AvailabilityEditor from "@/components/admin/AvailabilityEditor";
import type { AvailabilityRuleRow, AvailabilityOverrideRow } from "@/types/database";

export default async function AvailabilityPage() {
  let rules: AvailabilityRuleRow[] = [];
  let overrides: AvailabilityOverrideRow[] = [];

  try {
    const supabase = createAdminClient();
    const today = new Date().toISOString().split("T")[0];

    const { data: rulesData } = await supabase
      .from("availability_rules")
      .select("*")
      .eq("is_active", true)
      .order("day_of_week")
      .order("start_time");

    const { data: overridesData } = await supabase
      .from("availability_overrides")
      .select("*")
      .gte("date", today)
      .order("date");

    rules = (rulesData as AvailabilityRuleRow[]) ?? [];
    overrides = (overridesData as AvailabilityOverrideRow[]) ?? [];
  } catch {
    // DB not connected yet — editor shows empty state
  }

  return (
    <div className="max-w-4xl">
      <h1 className="font-heading text-2xl md:text-3xl font-bold text-ink mb-1">
        Availability
      </h1>
      <p className="text-ink-soft text-sm mb-8">
        Set your weekly hours and block off specific dates.
      </p>
      <AvailabilityEditor rules={rules} overrides={overrides} />
    </div>
  );
}
