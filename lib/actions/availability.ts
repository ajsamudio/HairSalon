"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function addAvailabilityRule(data: {
  day_of_week: number;
  start_time: string;
  end_time: string;
}): Promise<{ success?: true; error?: string }> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("availability_rules")
    .insert({ ...data, is_active: true });

  if (error) return { error: error.message };
  revalidatePath("/admin/availability");
  return { success: true };
}

export async function removeAvailabilityRule(
  id: string
): Promise<{ success?: true; error?: string }> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("availability_rules")
    .update({ is_active: false })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/availability");
  return { success: true };
}

export async function addBlackoutDate(data: {
  date: string;
  start_time?: string | null;
  end_time?: string | null;
  reason?: string | null;
}): Promise<{ success?: true; error?: string }> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("availability_overrides").insert({
    date: data.date,
    start_time: data.start_time ?? null,
    end_time: data.end_time ?? null,
    reason: data.reason ?? null,
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/availability");
  return { success: true };
}

export async function removeBlackoutDate(
  id: string
): Promise<{ success?: true; error?: string }> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("availability_overrides")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/availability");
  return { success: true };
}
