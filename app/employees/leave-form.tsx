"use client";

import { useActionState } from "react";

import { createLeaveEntryAction, type LeaveFormState } from "./leave-actions";

const initialState: LeaveFormState = {};

const inputClass =
  "rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900";
const labelClass = "text-sm font-medium text-zinc-700 dark:text-zinc-300";

export function LeaveForm({ employeeId }: { employeeId: string }) {
  const [state, formAction, pending] = useActionState(createLeaveEntryAction, initialState);

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-4">
      <input type="hidden" name="employee_id" value={employeeId} />

      <div className="flex flex-col gap-1">
        <label htmlFor="type" className={labelClass}>
          Type
        </label>
        <select id="type" name="type" required defaultValue="leave" className={inputClass}>
          <option value="leave">Leave</option>
          <option value="absence">Absence</option>
        </select>
      </div>

      <div className="flex gap-3">
        <div className="flex flex-1 flex-col gap-1">
          <label htmlFor="start_date" className={labelClass}>
            Start date
          </label>
          <input id="start_date" name="start_date" type="date" required className={inputClass} />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <label htmlFor="end_date" className={labelClass}>
            End date
          </label>
          <input id="end_date" name="end_date" type="date" className={inputClass} />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="days" className={labelClass}>
          Days
        </label>
        <input id="days" name="days" type="number" step="0.5" min="0" className={inputClass} />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="note" className={labelClass}>
          Note (optional)
        </label>
        <input id="note" name="note" className={inputClass} />
      </div>

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
        {pending ? "Saving..." : "Log entry"}
      </button>
    </form>
  );
}
