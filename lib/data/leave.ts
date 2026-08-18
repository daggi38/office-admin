import { createClient } from "@/lib/supabase/server";
import type { LeaveEntry, LeaveEntryInsert } from "@/lib/supabase/types";

import { err, ok, type Result } from "./result";

// History view: all leave_entries for an employee, newest first (HR-6).
export async function listLeaveForEmployee(employeeId: string): Promise<Result<LeaveEntry[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leave_entries")
    .select("*")
    .eq("employee_id", employeeId)
    .order("start_date", { ascending: false });
  if (error) return err(error.message);
  return ok(data);
}

export async function createLeaveEntry(data: LeaveEntryInsert): Promise<Result<LeaveEntry>> {
  const supabase = await createClient();
  const { data: row, error } = await supabase.from("leave_entries").insert(data).select().single();
  if (error) return err(error.message);
  return ok(row);
}
