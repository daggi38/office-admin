"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { upsertScheduleEntryAction, type ScheduleFormState } from "./actions";

const initialState: ScheduleFormState = {};

export function ScheduleForm() {
  const [state, formAction, pending] = useActionState(upsertScheduleEntryAction, initialState);

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="resource">Resource</Label>
        <Input id="resource" name="resource" required placeholder="e.g. Water allocation" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="cycle_label">Cycle</Label>
        <Input id="cycle_label" name="cycle_label" placeholder="e.g. which program day / event" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="detail_en">Detail (English)</Label>
        <Input id="detail_en" name="detail_en" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="detail_am">Detail (Amharic)</Label>
        <Input id="detail_am" name="detail_am" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="sort_order">Sort order</Label>
        <Input id="sort_order" name="sort_order" type="number" step="1" />
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Add entry"}
      </Button>
    </form>
  );
}
