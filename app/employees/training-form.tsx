"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { createTrainingRecordAction, type TrainingFormState } from "./training-actions";

const initialState: TrainingFormState = {};

export function TrainingForm({ employeeId }: { employeeId: string }) {
  const [state, formAction, pending] = useActionState(createTrainingRecordAction, initialState);

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-4">
      <input type="hidden" name="employee_id" value={employeeId} />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="training_name">Training / certification</Label>
        <Input id="training_name" name="training_name" required placeholder="e.g. Fire safety" />
      </div>

      <div className="flex gap-3">
        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor="completed_date">Completed</Label>
          <Input id="completed_date" name="completed_date" type="date" />
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor="expiration_date">Expires</Label>
          <Input id="expiration_date" name="expiration_date" type="date" />
        </div>
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Log record"}
      </Button>
    </form>
  );
}
