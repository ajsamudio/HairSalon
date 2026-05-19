import { createAdminClient } from "@/lib/supabase/admin";
import ServicesManager from "@/components/admin/ServicesManager";
import type { ServiceRow } from "@/types/database";

export default async function ServicesPage() {
  let services: ServiceRow[] = [];

  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("services")
      .select("*")
      .order("category")
      .order("sort_order");
    services = (data as ServiceRow[]) ?? [];
  } catch {
    // DB not connected yet
  }

  return (
    <div className="max-w-4xl">
      <h1 className="font-heading text-2xl md:text-3xl font-bold text-ink mb-1">
        Services
      </h1>
      <p className="text-ink-soft text-sm mb-8">
        Manage your service menu, pricing, and availability.
      </p>
      <ServicesManager services={services} />
    </div>
  );
}
