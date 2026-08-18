"use client";

import { useActionState } from "react";

import type { Employee } from "@/lib/supabase/types";

import type { EmployeeFormState } from "./actions";

const initialState: EmployeeFormState = {};

const inputClass =
  "rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900";
const labelClass = "text-sm font-medium text-zinc-700 dark:text-zinc-300";

export function EmployeeForm({
  action,
  employee,
  submitLabel,
}: {
  action: (prevState: EmployeeFormState, formData: FormData) => Promise<EmployeeFormState>;
  employee?: Employee;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-4">
      {employee && <input type="hidden" name="id" value={employee.id} />}

      <div className="flex flex-col gap-1">
        <label htmlFor="name" className={labelClass}>
          Name
        </label>
        <input id="name" name="name" required defaultValue={employee?.name} className={inputClass} />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="role" className={labelClass}>
          Role
        </label>
        <input id="role" name="role" required defaultValue={employee?.role} className={inputClass} />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="start_date" className={labelClass}>
          Start date
        </label>
        <input
          id="start_date"
          name="start_date"
          type="date"
          required
          defaultValue={employee?.start_date}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="salary" className={labelClass}>
          Salary
        </label>
        <input
          id="salary"
          name="salary"
          type="number"
          step="0.01"
          inputMode="decimal"
          defaultValue={employee?.salary ?? ""}
          className={inputClass}
        />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Entered manually — never calculated.</p>
      </div>

      {employee && (
        <div className="flex flex-col gap-1">
          <label htmlFor="employment_status" className={labelClass}>
            Status
          </label>
          <select
            id="employment_status"
            name="employment_status"
            defaultValue={employee.employment_status}
            className={inputClass}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      )}

      {state?.error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900"
      >
        {pending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
