"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Employee } from "@/lib/supabase/types";

import type { EmployeeFormState } from "./actions";

const initialState: EmployeeFormState = {};

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

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required defaultValue={employee?.name} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="role">Role</Label>
        <Input id="role" name="role" required defaultValue={employee?.role} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="start_date">Start date</Label>
        <Input id="start_date" name="start_date" type="date" required defaultValue={employee?.start_date} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="salary">Salary</Label>
        <Input
          id="salary"
          name="salary"
          type="number"
          step="0.01"
          inputMode="decimal"
          defaultValue={employee?.salary ?? ""}
        />
        <p className="text-xs text-muted-foreground">Entered manually — never calculated.</p>
      </div>

      {employee && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="employment_status">Status</Label>
          <Select name="employment_status" defaultValue={employee.employment_status}>
            <SelectTrigger id="employment_status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {state?.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
