import { createClient } from "@/lib/supabase/server";
import type { TrainingRecord, TrainingRecordInsert } from "@/lib/supabase/types";

import { err, ok, type Result } from "./result";

// Safety compliance, certifications, course completions — newest first.
export async function listTrainingForEmployee(employeeId: string): Promise<Result<TrainingRecord[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("employee_training_records")
    .select("*")
    .eq("employee_id", employeeId)
    .order("completed_date", { ascending: false });
  if (error) return err(error.message);
  return ok(data);
}

export async function createTrainingRecord(data: TrainingRecordInsert): Promise<Result<TrainingRecord>> {
  const supabase = await createClient();
  const { data: row, error } = await supabase
    .from("employee_training_records")
    .insert(data)
    .select()
    .single();
  if (error) return err(error.message);
  return ok(row);
}
