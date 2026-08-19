"use server";

import { revalidatePath } from "next/cache";

import { createTrainingRecord } from "@/lib/data/training";
import { createClient } from "@/lib/supabase/server";

export interface TrainingFormState {
  error?: string;
}

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function createTrainingRecordAction(
  _prevState: TrainingFormState,
  formData: FormData
): Promise<TrainingFormState> {
  const user = await requireUser();
  if (!user) return { error: "You need to sign in." };

  const employeeId = String(formData.get("employee_id") ?? "");
  const trainingName = String(formData.get("training_name") ?? "").trim();
  const completedDate = String(formData.get("completed_date") ?? "").trim();
  const expirationDate = String(formData.get("expiration_date") ?? "").trim();

  if (!employeeId || !trainingName) {
    return { error: "Training name is required." };
  }

  const { error } = await createTrainingRecord({
    employee_id: employeeId,
    training_name: trainingName,
    completed_date: completedDate || null,
    expiration_date: expirationDate || null,
  });
  if (error) return { error };

  revalidatePath(`/employees/${employeeId}`);
  return {};
}
