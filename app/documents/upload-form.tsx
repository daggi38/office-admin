"use client";

import { useActionState } from "react";

import type { DocumentCategory } from "@/lib/supabase/types";

import { uploadDocumentAction, type UploadFormState } from "./actions";

const initialState: UploadFormState = {};

const inputClass =
  "rounded border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900";
const labelClass = "text-sm font-medium text-zinc-700 dark:text-zinc-300";

export function UploadForm({ categories }: { categories: DocumentCategory[] }) {
  const [state, formAction, pending] = useActionState(uploadDocumentAction, initialState);

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="category_id" className={labelClass}>
          Category
        </label>
        <select id="category_id" name="category_id" required defaultValue="" className={inputClass}>
          <option value="" disabled>
            Choose a category
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label_en}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="title" className={labelClass}>
          Title (optional)
        </label>
        <input id="title" name="title" placeholder="Defaults to the file name" className={inputClass} />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="file" className={labelClass}>
          File
        </label>
        <input id="file" name="file" type="file" required className={inputClass} />
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
        {pending ? "Uploading..." : "Upload"}
      </button>
    </form>
  );
}
