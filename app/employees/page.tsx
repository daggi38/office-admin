import Link from "next/link";

import { listEmployees } from "@/lib/data/employees";
import { createClient } from "@/lib/supabase/server";
import type { EmploymentStatus } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

function isEmploymentStatus(value: string | undefined): value is EmploymentStatus {
  return value === "active" || value === "inactive";
}

export default async function EmployeesPage(props: PageProps<"/employees">) {
  const searchParams = await props.searchParams;
  const search = typeof searchParams.q === "string" ? searchParams.q : undefined;
  const statusParam = typeof searchParams.status === "string" ? searchParams.status : undefined;
  const status = isEmploymentStatus(statusParam) ? statusParam : undefined;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          You need to sign in to view employee records.
        </p>
        <Link href="/login" className="text-sm font-medium underline">
          Go to sign in
        </Link>
      </main>
    );
  }

  const { data: employees, error } = await listEmployees({ search, status });

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Employees</h1>
      </div>

      <form method="GET" className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="q" className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Search name or role
          </label>
          <input
            id="q"
            name="q"
            defaultValue={search ?? ""}
            className="rounded border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="status" className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={status ?? ""}
            className="rounded border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button
          type="submit"
          className="rounded border border-zinc-300 px-3 py-1.5 text-sm font-medium dark:border-zinc-700"
        >
          Filter
        </button>
      </form>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}

      {!error && employees && employees.length === 0 && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">No employees found.</p>
      )}

      {!error && employees && employees.length > 0 && (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-left text-xs uppercase text-zinc-500 dark:border-zinc-800">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Role</th>
              <th className="py-2 pr-4">Start date</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Salary</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id} className="border-b border-zinc-100 dark:border-zinc-900">
                <td className="py-2 pr-4">{employee.name}</td>
                <td className="py-2 pr-4">{employee.role}</td>
                <td className="py-2 pr-4">{employee.start_date}</td>
                <td className="py-2 pr-4">
                  <span
                    className={
                      employee.employment_status === "active"
                        ? "rounded bg-green-100 px-2 py-0.5 text-xs text-green-800 dark:bg-green-900/40 dark:text-green-300"
                        : "rounded bg-zinc-200 px-2 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                    }
                  >
                    {employee.employment_status}
                  </span>
                </td>
                <td className="py-2 pr-4">{employee.salary ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
