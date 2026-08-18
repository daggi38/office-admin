import { createClient } from "@/lib/supabase/server";
import type { ResourceSchedule, ResourceScheduleUpsert } from "@/lib/supabase/types";

import { err, ok, type Result } from "./result";

export async function listSchedule(): Promise<Result<ResourceSchedule[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resource_schedule")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) return err(error.message);
  return ok(data);
}

// FAC-2: reference schedule only — no booking workflow (FAC-3).
export async function upsertScheduleEntry(
  data: ResourceScheduleUpsert
): Promise<Result<ResourceSchedule>> {
  const supabase = await createClient();
  const { data: row, error } = await supabase
    .from("resource_schedule")
    .upsert(data)
    .select()
    .single();
  if (error) return err(error.message);
  return ok(row);
}
