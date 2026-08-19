import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
        <p className="text-sm text-muted-foreground">You need to sign in to view the facilities schedule.</p>
        <Button variant="link" render={<Link href="/login" />}>
          Go to sign in
        </Button>
      </main>
    );
  }

  const { data: entries, error } = await listSchedule();

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Facilities</h1>
        <p className="text-sm text-muted-foreground">Resource schedule — view only, no booking requests.</p>
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {!error && entries && entries.length === 0 && (
        <p className="text-sm text-muted-foreground">No resource schedule entries yet.</p>
      )}

      {!error && entries && entries.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Resource</TableHead>
              <TableHead>Cycle</TableHead>
              <TableHead>Detail (EN)</TableHead>
              <TableHead>Detail (AM)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.resource}</TableCell>
                <TableCell>{entry.cycle_label ?? "—"}</TableCell>
                <TableCell>{entry.detail_en ?? "—"}</TableCell>
                <TableCell>{entry.detail_am ?? "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <section className="flex flex-col gap-4 border-t border-border pt-6">
        <h2 className="text-lg font-semibold tracking-tight">Add / update entry</h2>
        <ScheduleForm />
      </section>
    </main>
  );
}
