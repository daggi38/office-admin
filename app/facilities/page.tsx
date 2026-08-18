import Link from "next/link";

import { listSchedule } from "@/lib/data/schedule";
import { createClient } from "@/lib/supabase/server";

import { ScheduleForm } from "./schedule-form";

export const dynamic = "force-dynamic";

export default async function FacilitiesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          You need to sign in to view the facilities schedule.
        </p>
        <Link href="/login" className="text-sm font-medium underline">
          Go to sign in
        </Link>
      </main>
    );
  }

  const { data: entries, error } = await listSchedule();

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-8">
      <div>
        <h1 className="text-xl font-semibold">Facilities — resource schedule</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Reference schedule for shared supplies and resources. Documentation only — there is no
          request or booking workflow here.
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}

      {!error && entries && entries.length === 0 && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">No resource schedule entries yet.</p>
      )}

      {!error && entries && entries.length > 0 && (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-left text-xs uppercase text-zinc-500 dark:border-zinc-800">
              <th className="py-2 pr-4">Resource</th>
              <th className="py-2 pr-4">Cycle</th>
              <th className="py-2 pr-4">Detail (EN)</th>
              <th className="py-2 pr-4">Detail (AM)</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-b border-zinc-100 dark:border-zinc-900">
                <td className="py-2 pr-4">{entry.resource}</td>
                <td className="py-2 pr-4">{entry.cycle_label ?? "—"}</td>
                <td className="py-2 pr-4">{entry.detail_en ?? "—"}</td>
                <td className="py-2 pr-4">{entry.detail_am ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <section className="flex flex-col gap-4 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <h2 className="text-lg font-semibold">Add / update entry</h2>
        <ScheduleForm />
      </section>
    </main>
  );
}
