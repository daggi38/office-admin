import { createClient } from "@/lib/supabase/server";
import type { Employee, EmployeeInsert, EmployeeUpdate, EmploymentStatus } from "@/lib/supabase/types";

import { err, ok, type Result } from "./result";

export interface EmployeeFilter {
  status?: EmploymentStatus;
  search?: string;
}

export async function listEmployees(filter: EmployeeFilter = {}): Promise<Result<Employee[]>> {
  const supabase = await createClient();
  let query = supabase.from("employees").select("*").order("name", { ascending: true });

  if (filter.status) {
    query = query.eq("employment_status", filter.status);
  }
  if (filter.search) {
    query = query.or(`name.ilike.%${filter.search}%,role.ilike.%${filter.search}%`);
  }

  const { data, error } = await query;
  if (error) return err(error.message);
  return ok(data);
}

export async function getEmployee(id: string): Promise<Result<Employee>> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("employees").select("*").eq("id", id).single();
  if (error) return err(error.message);
  return ok(data);
}

export async function createEmployee(data: EmployeeInsert): Promise<Result<Employee>> {
  const supabase = await createClient();
  const { data: row, error } = await supabase.from("employees").insert(data).select().single();
  if (error) return err(error.message);
  return ok(row);
}

export async function updateEmployee(id: string, data: EmployeeUpdate): Promise<Result<Employee>> {
  const supabase = await createClient();
  const { data: row, error } = await supabase
    .from("employees")
    .update(data)
    .eq("id", id)
    .select()
    .single();
  if (error) return err(error.message);
  return ok(row);
}

// HR-1: deactivate, never delete.
export async function deactivateEmployee(id: string): Promise<Result<Employee>> {
  return updateEmployee(id, { employment_status: "inactive" });
}
