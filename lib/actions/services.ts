"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

const ServiceSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  description: z.string().optional().nullable(),
  category: z.enum([
    "cuts",
    "color",
    "treatments",
    "styling",
    "extensions",
    "add-ons",
  ]),
  duration_min: z.number().int().positive(),
  price_cents: z.number().int().nonnegative(),
  deposit_cents: z.number().int().nonnegative(),
  requires_consult: z.boolean().default(false),
});

export async function createService(
  data: z.infer<typeof ServiceSchema>
): Promise<{ success?: true; error?: string }> {
  const parsed = ServiceSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("services")
    .insert({ ...parsed.data, is_active: true });

  if (error) return { error: error.message };
  revalidatePath("/admin/services");
  return { success: true };
}

export async function updateService(
  id: string,
  data: z.infer<typeof ServiceSchema>
): Promise<{ success?: true; error?: string }> {
  const parsed = ServiceSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("services")
    .update(parsed.data)
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/services");
  return { success: true };
}

export async function toggleServiceActive(
  id: string,
  isActive: boolean
): Promise<{ success?: true; error?: string }> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("services")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/services");
  return { success: true };
}
