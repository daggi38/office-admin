"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Employee } from "@/lib/supabase/types";

import type { EmployeeFormState } from "./actions";

const initialState: EmployeeFormState = {};

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="border-t border-border pt-5 text-sm font-semibold">{children}</h3>;
}

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
    <form action={formAction} className="flex w-full max-w-xl flex-col gap-4">
      {employee && <input type="hidden" name="id" value={employee.id} />}

      <SectionHeading>Identity</SectionHeading>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" required defaultValue={employee?.name} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="first_name">First name</Label>
          <Input id="first_name" name="first_name" defaultValue={employee?.first_name ?? ""} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="middle_name">Middle name</Label>
          <Input id="middle_name" name="middle_name" defaultValue={employee?.middle_name ?? ""} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="last_name">Surname</Label>
          <Input id="last_name" name="last_name" defaultValue={employee?.last_name ?? ""} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="national_id">National ID</Label>
        <Input id="national_id" name="national_id" defaultValue={employee?.national_id ?? ""} />
      </div>

      <SectionHeading>Contact</SectionHeading>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="residential_address">Residential address</Label>
        <Input id="residential_address" name="residential_address" defaultValue={employee?.residential_address ?? ""} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="personal_phone">Personal phone</Label>
          <Input id="personal_phone" name="personal_phone" type="tel" defaultValue={employee?.personal_phone ?? ""} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="personal_email">Personal email</Label>
          <Input id="personal_email" name="personal_email" type="email" defaultValue={employee?.personal_email ?? ""} />
        </div>
      </div>

      <SectionHeading>Emergency contacts</SectionHeading>
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="emergency_contact_primary_name">Primary name</Label>
          <Input
            id="emergency_contact_primary_name"
            name="emergency_contact_primary_name"
            defaultValue={employee?.emergency_contact_primary_name ?? ""}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="emergency_contact_primary_phone">Primary phone</Label>
          <Input
            id="emergency_contact_primary_phone"
            name="emergency_contact_primary_phone"
            type="tel"
            defaultValue={employee?.emergency_contact_primary_phone ?? ""}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="emergency_contact_primary_relation">Relation</Label>
          <Input
            id="emergency_contact_primary_relation"
            name="emergency_contact_primary_relation"
            defaultValue={employee?.emergency_contact_primary_relation ?? ""}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="emergency_contact_secondary_name">Secondary name</Label>
          <Input
            id="emergency_contact_secondary_name"
            name="emergency_contact_secondary_name"
            defaultValue={employee?.emergency_contact_secondary_name ?? ""}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="emergency_contact_secondary_phone">Secondary phone</Label>
          <Input
            id="emergency_contact_secondary_phone"
            name="emergency_contact_secondary_phone"
            type="tel"
            defaultValue={employee?.emergency_contact_secondary_phone ?? ""}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="emergency_contact_secondary_relation">Relation</Label>
          <Input
            id="emergency_contact_secondary_relation"
            name="emergency_contact_secondary_relation"
            defaultValue={employee?.emergency_contact_secondary_relation ?? ""}
          />
        </div>
      </div>

      <SectionHeading>Employment &amp; role</SectionHeading>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="role">Job title</Label>
          <Input id="role" name="role" required defaultValue={employee?.role} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="department">Department</Label>
          <Input id="department" name="department" defaultValue={employee?.department ?? ""} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="supervisor_name">Supervisor</Label>
          <Input id="supervisor_name" name="supervisor_name" defaultValue={employee?.supervisor_name ?? ""} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="work_location">Work location</Label>
          <Input id="work_location" name="work_location" defaultValue={employee?.work_location ?? ""} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="employment_type">Classification</Label>
          <Select name="employment_type" defaultValue={employee?.employment_type ?? undefined}>
            <SelectTrigger id="employment_type" className="w-full">
              <SelectValue placeholder="Select classification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full_time">Full-time</SelectItem>
              <SelectItem value="part_time">Part-time</SelectItem>
              <SelectItem value="temporary">Temporary</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
            </SelectContent>
          </Select>
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
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="start_date">Start date</Label>
          <Input id="start_date" name="start_date" type="date" required defaultValue={employee?.start_date} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="hire_date">Hire date</Label>
          <Input id="hire_date" name="hire_date" type="date" defaultValue={employee?.hire_date ?? ""} />
        </div>
      </div>

      <SectionHeading>Compensation &amp; payroll</SectionHeading>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="salary">Salary</Label>
          <Input id="salary" name="salary" type="number" step="0.01" inputMode="decimal" defaultValue={employee?.salary ?? ""} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="allowances">Allowances</Label>
          <Input id="allowances" name="allowances" type="number" step="0.01" inputMode="decimal" defaultValue={employee?.allowances ?? ""} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pension_contribution">Pension contribution</Label>
          <Input
            id="pension_contribution"
            name="pension_contribution"
            type="number"
            step="0.01"
            inputMode="decimal"
            defaultValue={employee?.pension_contribution ?? ""}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="provident_fund">Provident fund</Label>
          <Input
            id="provident_fund"
            name="provident_fund"
            type="number"
            step="0.01"
            inputMode="decimal"
            defaultValue={employee?.provident_fund ?? ""}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="loan_deduction">Loan deduction</Label>
        <Input
          id="loan_deduction"
          name="loan_deduction"
          type="number"
          step="0.01"
          inputMode="decimal"
          defaultValue={employee?.loan_deduction ?? ""}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="bank_name">Bank name</Label>
          <Input id="bank_name" name="bank_name" defaultValue={employee?.bank_name ?? ""} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="bank_account_number">Bank account number</Label>
          <Input id="bank_account_number" name="bank_account_number" defaultValue={employee?.bank_account_number ?? ""} />
        </div>
      </div>

      <SectionHeading>Lifecycle</SectionHeading>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="next_review_date">Next review date</Label>
          <Input id="next_review_date" name="next_review_date" type="date" defaultValue={employee?.next_review_date ?? ""} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pto_balance">PTO balance (days)</Label>
          <Input id="pto_balance" name="pto_balance" type="number" step="0.5" defaultValue={employee?.pto_balance ?? ""} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="termination_date">Termination date</Label>
          <Input id="termination_date" name="termination_date" type="date" defaultValue={employee?.termination_date ?? ""} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="benefits_end_date">Benefits end date</Label>
          <Input id="benefits_end_date" name="benefits_end_date" type="date" defaultValue={employee?.benefits_end_date ?? ""} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="termination_reason">Termination reason</Label>
        <Input id="termination_reason" name="termination_reason" defaultValue={employee?.termination_reason ?? ""} />
      </div>

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
