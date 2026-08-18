import Link from "next/link";
import { notFound } from "next/navigation";

import { getEmployee } from "@/lib/data/employees";
import { createClient } from "@/lib/supabase/server";

import { deactivateEmployeeAction, updateEmployeeAction } from "../actions";
import { EmployeeForm } from "../employee-form";

export const dynamic = "force-dynamic";

export default async function EmployeeDetailPage(props: PageProps<"/employees/[id]">) {
  const { id } = await props.params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">You need to sign in to view this record.</p>
        <Link href="/login" className="text-sm font-medium underline">
          Go to sign in
        </Link>
      </main>
    );
  }

  const { data: employee, error } = await getEmployee(id);
  if (error || !employee) notFound();

  const deactivate = deactivateEmployeeAction.bind(null, employee.id);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/employees" className="text-sm underline">
            ← Employees
          </Link>
          <h1 className="text-xl font-semibold">{employee.name}</h1>
        </div>
        {employee.employment_status === "active" && (
          <form action={deactivate}>
            <button
              type="submit"
              className="rounded border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 dark:border-red-900 dark:text-red-400"
            >
              Deactivate
            </button>
          </form>
        )}
      </div>

      <EmployeeForm action={updateEmployeeAction} employee={employee} submitLabel="Save changes" />
    </main>
  );
}
