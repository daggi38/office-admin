"use server";

import { revalidatePath } from "next/cache";

import { upsertScheduleEntry } from "@/lib/data/schedule";
import { createClient } from "@/lib/supabase/server";

export interface ScheduleFormState {
  error?: string;
}

function parseSortOrder(value: FormDataEntryValue | null): number | undefined {
  if (value === null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export async function upsertScheduleEntryAction(
  _prevState: ScheduleFormState,
  formData: FormData
): Promise<ScheduleFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to sign in." };

  const resource = String(formData.get("resource") ?? "").trim();
  const cycleLabel = String(formData.get("cycle_label") ?? "").trim();
  const detailEn = String(formData.get("detail_en") ?? "").trim();
  const detailAm = String(formData.get("detail_am") ?? "").trim();

  if (!resource) {
    return { error: "Resource name is required." };
  }

  const { error } = await upsertScheduleEntry({
    resource,
    cycle_label: cycleLabel || null,
    detail_en: detailEn || null,
    detail_am: detailAm || null,
    sort_order: parseSortOrder(formData.get("sort_order")),
  });
  if (error) return { error };

  revalidatePath("/facilities");
  return {};
}
