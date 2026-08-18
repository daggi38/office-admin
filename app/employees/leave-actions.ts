"use server";

import { revalidatePath } from "next/cache";

import { createLeaveEntry } from "@/lib/data/leave";
import { createClient } from "@/lib/supabase/server";

export interface LeaveFormState {
  error?: string;
}

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

function parseDays(value: FormDataEntryValue | null): number | null {
  if (value === null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function createLeaveEntryAction(
  _prevState: LeaveFormState,
  formData: FormData
): Promise<LeaveFormState> {
  const user = await requireUser();
  if (!user) return { error: "You need to sign in." };

  const employeeId = String(formData.get("employee_id") ?? "");
  const type = String(formData.get("type") ?? "").trim();
  const startDate = String(formData.get("start_date") ?? "").trim();
  const endDate = String(formData.get("end_date") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();

  if (!employeeId || !type || !startDate) {
    return { error: "Type and start date are required." };
  }

  const { error } = await createLeaveEntry({
    employee_id: employeeId,
    type,
    start_date: startDate,
    end_date: endDate || null,
    days: parseDays(formData.get("days")),
    note: note || null,
  });
  if (error) return { error };

  revalidatePath(`/employees/${employeeId}`);
  return {};
}
