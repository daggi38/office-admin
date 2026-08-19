import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
        <p className="text-sm text-muted-foreground">You need to sign in to view employee records.</p>
        <Button variant="link" render={<Link href="/login" />}>
          Go to sign in
        </Button>
      </main>
    );
  }

  const { data: employees, error } = await listEmployees({ search, status });

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Employees</h1>
        <Button render={<Link href="/employees/new" />}>Add employee</Button>
      </div>

      <form method="GET" className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="q" className="text-xs text-muted-foreground">
            Search name or role
          </Label>
          <Input id="q" name="q" defaultValue={search ?? ""} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="status" className="text-xs text-muted-foreground">
            Status
          </Label>
          <Select name="status" defaultValue={status ?? "all"}>
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" variant="outline">
          Filter
        </Button>
      </form>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {!error && employees && employees.length === 0 && (
        <p className="text-sm text-muted-foreground">No employees found.</p>
      )}

      {!error && employees && employees.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Start date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Salary</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>
                  <Link href={`/employees/${employee.id}`} className="underline">
                    {employee.name}
                  </Link>
                </TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>{employee.department ?? "—"}</TableCell>
                <TableCell>{employee.start_date}</TableCell>
                <TableCell>
                  <Badge variant={employee.employment_status === "active" ? "default" : "secondary"}>
                    {employee.employment_status}
                  </Badge>
                </TableCell>
                <TableCell>{employee.salary ?? "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </main>
  );
}
