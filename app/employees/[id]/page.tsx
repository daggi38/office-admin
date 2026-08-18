import Link from "next/link";
import { notFound } from "next/navigation";

import { getEmployee } from "@/lib/data/employees";
import { listLeaveForEmployee } from "@/lib/data/leave";
import { createClient } from "@/lib/supabase/server";

import { deactivateEmployeeAction, updateEmployeeAction } from "../actions";
import { EmployeeForm } from "../employee-form";
import { LeaveForm } from "../leave-form";

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

  const { data: leaveEntries, error: leaveError } = await listLeaveForEmployee(employee.id);

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

      <section className="flex flex-col gap-4 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <h2 className="text-lg font-semibold">Leave &amp; attendance history</h2>

        {leaveError && (
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            {leaveError}
          </p>
        )}

        {!leaveError && leaveEntries && leaveEntries.length === 0 && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">No leave or absences logged.</p>
        )}

        {!leaveError && leaveEntries && leaveEntries.length > 0 && (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-left text-xs uppercase text-zinc-500 dark:border-zinc-800">
                <th className="py-2 pr-4">Type</th>
                <th className="py-2 pr-4">Start</th>
                <th className="py-2 pr-4">End</th>
                <th className="py-2 pr-4">Days</th>
                <th className="py-2 pr-4">Note</th>
              </tr>
            </thead>
            <tbody>
              {leaveEntries.map((entry) => (
                <tr key={entry.id} className="border-b border-zinc-100 dark:border-zinc-900">
                  <td className="py-2 pr-4 capitalize">{entry.type}</td>
                  <td className="py-2 pr-4">{entry.start_date}</td>
                  <td className="py-2 pr-4">{entry.end_date ?? "—"}</td>
                  <td className="py-2 pr-4">{entry.days ?? "—"}</td>
                  <td className="py-2 pr-4">{entry.note ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <LeaveForm employeeId={employee.id} />
      </section>
    </main>
  );
}
