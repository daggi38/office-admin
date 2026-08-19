import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getEmployee } from "@/lib/data/employees";
import { listLeaveForEmployee } from "@/lib/data/leave";
import { listTrainingForEmployee } from "@/lib/data/training";
import { createClient } from "@/lib/supabase/server";

import { deactivateEmployeeAction, updateEmployeeAction } from "../actions";
import { EmployeeForm } from "../employee-form";
import { LeaveForm } from "../leave-form";
import { TrainingForm } from "../training-form";

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
        <p className="text-sm text-muted-foreground">You need to sign in to view this record.</p>
        <Button variant="link" render={<Link href="/login" />}>
          Go to sign in
        </Button>
      </main>
    );
  }

  const { data: employee, error } = await getEmployee(id);
  if (error || !employee) notFound();

  const { data: leaveEntries, error: leaveError } = await listLeaveForEmployee(employee.id);
  const { data: trainingRecords, error: trainingError } = await listTrainingForEmployee(employee.id);

  const deactivate = deactivateEmployeeAction.bind(null, employee.id);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/employees" className="text-sm text-muted-foreground underline">
            ← Employees
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">{employee.name}</h1>
        </div>
        {employee.employment_status === "active" && (
          <form action={deactivate}>
            <Button type="submit" variant="destructive">
              Deactivate
            </Button>
          </form>
        )}
      </div>

      <EmployeeForm action={updateEmployeeAction} employee={employee} submitLabel="Save changes" />

      <section className="flex flex-col gap-4 border-t border-border pt-6">
        <h2 className="text-lg font-semibold tracking-tight">Leave &amp; attendance history</h2>

        {leaveError && (
          <p className="text-sm text-destructive" role="alert">
            {leaveError}
          </p>
        )}

        {!leaveError && leaveEntries && leaveEntries.length === 0 && (
          <p className="text-sm text-muted-foreground">No leave or absences logged.</p>
        )}

        {!leaveError && leaveEntries && leaveEntries.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Note</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="capitalize">{entry.type}</TableCell>
                  <TableCell>{entry.start_date}</TableCell>
                  <TableCell>{entry.end_date ?? "—"}</TableCell>
                  <TableCell>{entry.days ?? "—"}</TableCell>
                  <TableCell>{entry.note ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <LeaveForm employeeId={employee.id} />
      </section>

      <section className="flex flex-col gap-4 border-t border-border pt-6">
        <h2 className="text-lg font-semibold tracking-tight">Training &amp; certification records</h2>

        {trainingError && (
          <p className="text-sm text-destructive" role="alert">
            {trainingError}
          </p>
        )}

        {!trainingError && trainingRecords && trainingRecords.length === 0 && (
          <p className="text-sm text-muted-foreground">No training records logged.</p>
        )}

        {!trainingError && trainingRecords && trainingRecords.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Training</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead>Expires</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trainingRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.training_name}</TableCell>
                  <TableCell>{record.completed_date ?? "—"}</TableCell>
                  <TableCell>{record.expiration_date ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <TrainingForm employeeId={employee.id} />
      </section>
    </main>
  );
}
