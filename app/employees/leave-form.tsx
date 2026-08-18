"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { createLeaveEntryAction, type LeaveFormState } from "./leave-actions";

const initialState: LeaveFormState = {};

export function LeaveForm({ employeeId }: { employeeId: string }) {
  const [state, formAction, pending] = useActionState(createLeaveEntryAction, initialState);

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-4">
      <input type="hidden" name="employee_id" value={employeeId} />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="type">Type</Label>
        <Select name="type" defaultValue="leave">
          <SelectTrigger id="type" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="leave">Leave</SelectItem>
            <SelectItem value="absence">Absence</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-3">
        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor="start_date">Start date</Label>
          <Input id="start_date" name="start_date" type="date" required />
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor="end_date">End date</Label>
          <Input id="end_date" name="end_date" type="date" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="days">Days</Label>
        <Input id="days" name="days" type="number" step="0.5" min="0" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="note">Note (optional)</Label>
        <Input id="note" name="note" />
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Log entry"}
      </Button>
    </form>
  );
}
