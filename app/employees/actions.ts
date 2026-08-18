"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createEmployee, deactivateEmployee, updateEmployee } from "@/lib/data/employees";
import { createClient } from "@/lib/supabase/server";

export interface EmployeeFormState {
  error?: string;
}

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
}

function parseSalary(value: FormDataEntryValue | null): number | null {
  if (value === null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function createEmployeeAction(
  _prevState: EmployeeFormState,
  formData: FormData
): Promise<EmployeeFormState> {
  await requireUser();

  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const startDate = String(formData.get("start_date") ?? "").trim();

  if (!name || !role || !startDate) {
    return { error: "Name, role, and start date are required." };
  }

  const { error } = await createEmployee({
    name,
    role,
    start_date: startDate,
    salary: parseSalary(formData.get("salary")),
  });
  if (error) return { error };

  revalidatePath("/employees");
  redirect("/employees");
}

export async function updateEmployeeAction(
  _prevState: EmployeeFormState,
  formData: FormData
): Promise<EmployeeFormState> {
  await requireUser();

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const startDate = String(formData.get("start_date") ?? "").trim();
  const employmentStatus = formData.get("employment_status") === "inactive" ? "inactive" : "active";

  if (!id || !name || !role || !startDate) {
    return { error: "Name, role, and start date are required." };
  }

  const { error } = await updateEmployee(id, {
    name,
    role,
    start_date: startDate,
    employment_status: employmentStatus,
    salary: parseSalary(formData.get("salary")),
  });
  if (error) return { error };

  revalidatePath("/employees");
  revalidatePath(`/employees/${id}`);
  redirect("/employees");
}

// HR-1: deactivate, never delete — this is the only removal path exposed in the UI.
export async function deactivateEmployeeAction(id: string): Promise<void> {
  await requireUser();
  await deactivateEmployee(id);
  revalidatePath("/employees");
  revalidatePath(`/employees/${id}`);
}
