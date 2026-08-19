"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createEmployee, deactivateEmployee, updateEmployee } from "@/lib/data/employees";
import { createClient } from "@/lib/supabase/server";
import type { EmploymentType } from "@/lib/supabase/types";

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

function optionalText(formData: FormData, key: string): string | null {
  const value = String(formData.get(key) ?? "").trim();
  return value || null;
}

function optionalNumber(formData: FormData, key: string): number | null {
  const value = formData.get(key);
  if (value === null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

const EMPLOYMENT_TYPES: EmploymentType[] = ["full_time", "part_time", "temporary", "contract"];

function parseEmploymentType(formData: FormData): EmploymentType | null {
  const value = formData.get("employment_type");
  return typeof value === "string" && (EMPLOYMENT_TYPES as string[]).includes(value)
    ? (value as EmploymentType)
    : null;
}

// Shared by create and update — everything beyond name/role/start_date
// (required) and employment_status (edit-only) is optional.
function parseOptionalEmployeeFields(formData: FormData) {
  return {
    first_name: optionalText(formData, "first_name"),
    middle_name: optionalText(formData, "middle_name"),
    last_name: optionalText(formData, "last_name"),
    national_id: optionalText(formData, "national_id"),
    residential_address: optionalText(formData, "residential_address"),
    personal_phone: optionalText(formData, "personal_phone"),
    personal_email: optionalText(formData, "personal_email"),
    emergency_contact_primary_name: optionalText(formData, "emergency_contact_primary_name"),
    emergency_contact_primary_phone: optionalText(formData, "emergency_contact_primary_phone"),
    emergency_contact_primary_relation: optionalText(formData, "emergency_contact_primary_relation"),
    emergency_contact_secondary_name: optionalText(formData, "emergency_contact_secondary_name"),
    emergency_contact_secondary_phone: optionalText(formData, "emergency_contact_secondary_phone"),
    emergency_contact_secondary_relation: optionalText(formData, "emergency_contact_secondary_relation"),
    work_location: optionalText(formData, "work_location"),
    employment_type: parseEmploymentType(formData),
    department: optionalText(formData, "department"),
    supervisor_name: optionalText(formData, "supervisor_name"),
    salary: optionalNumber(formData, "salary"),
    allowances: optionalNumber(formData, "allowances"),
    pension_contribution: optionalNumber(formData, "pension_contribution"),
    loan_deduction: optionalNumber(formData, "loan_deduction"),
    provident_fund: optionalNumber(formData, "provident_fund"),
    bank_name: optionalText(formData, "bank_name"),
    bank_account_number: optionalText(formData, "bank_account_number"),
    hire_date: optionalText(formData, "hire_date"),
    next_review_date: optionalText(formData, "next_review_date"),
    pto_balance: optionalNumber(formData, "pto_balance"),
    termination_date: optionalText(formData, "termination_date"),
    termination_reason: optionalText(formData, "termination_reason"),
    benefits_end_date: optionalText(formData, "benefits_end_date"),
  };
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
    ...parseOptionalEmployeeFields(formData),
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
    ...parseOptionalEmployeeFields(formData),
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
