"use client";

import { useActionState } from "react";

import { upsertScheduleEntryAction, type ScheduleFormState } from "./actions";

const initialState: ScheduleFormState = {};

const inputClass =
  "rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900";
const labelClass = "text-sm font-medium text-zinc-700 dark:text-zinc-300";

export function ScheduleForm() {
  const [state, formAction, pending] = useActionState(upsertScheduleEntryAction, initialState);

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="resource" className={labelClass}>
          Resource
        </label>
        <input
          id="resource"
          name="resource"
          required
          placeholder="e.g. Water allocation"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="cycle_label" className={labelClass}>
          Cycle
        </label>
        <input
          id="cycle_label"
          name="cycle_label"
          placeholder="e.g. which program day / event"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="detail_en" className={labelClass}>
          Detail (English)
        </label>
        <input id="detail_en" name="detail_en" className={inputClass} />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="detail_am" className={labelClass}>
          Detail (Amharic)
        </label>
        <input id="detail_am" name="detail_am" className={inputClass} />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="sort_order" className={labelClass}>
          Sort order
        </label>
        <input id="sort_order" name="sort_order" type="number" step="1" className={inputClass} />
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
        {pending ? "Saving..." : "Add entry"}
      </button>
    </form>
  );
}
