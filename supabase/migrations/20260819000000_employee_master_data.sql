-- Expand the employee master record per the fuller HR-1 field list:
-- personal/identification data, employment & role details, compensation
-- & payroll metrics, and lifecycle/milestone tracking. All additive —
-- existing columns (name, role, start_date, employment_status, salary)
-- and every other table are untouched.
--
-- Not included here: logged hours worked / overtime calculations.
-- Those are periodic timesheet data, not master-record fields, and
-- would need their own table + entry workflow (a separate feature,
-- not an extension of this one). pto_balance is included as a
-- manually-maintained running balance, matching the "manual entry,
-- never auto-calculated" rule already applied to salary.

-- ---------------------------------------------------------------------------
-- Core personal & identification data
-- ---------------------------------------------------------------------------
alter table employees
  add column first_name  text,
  add column middle_name text,
  add column last_name   text,
  add column national_id text,
  add column residential_address text,
  add column personal_phone      text,
  add column personal_email      text,
  add column emergency_contact_primary_name     text,
  add column emergency_contact_primary_phone    text,
  add column emergency_contact_primary_relation text,
  add column emergency_contact_secondary_name     text,
  add column emergency_contact_secondary_phone    text,
  add column emergency_contact_secondary_relation text;

-- ---------------------------------------------------------------------------
-- Employment & role details
-- ---------------------------------------------------------------------------
alter table employees
  add column work_location    text,
  add column employment_type  text,  -- 'full_time' | 'part_time' | 'temporary' | 'contract'
  add column department       text,
  add column supervisor_name  text;

alter table employees
  add constraint employees_employment_type_check
  check (employment_type is null or employment_type in ('full_time', 'part_time', 'temporary', 'contract'));

-- ---------------------------------------------------------------------------
-- Compensation & payroll metrics (manual entry, never auto-calculated)
-- ---------------------------------------------------------------------------
alter table employees
  add column allowances           numeric(14,2),
  add column pension_contribution numeric(14,2),
  add column loan_deduction       numeric(14,2),
  add column provident_fund       numeric(14,2),
  add column bank_name            text,
  add column bank_account_number  text;

-- ---------------------------------------------------------------------------
-- Lifecycle & milestone tracking
-- ---------------------------------------------------------------------------
alter table employees
  add column hire_date         date,   -- date of hire/offer, distinct from start_date (first working day)
  add column next_review_date  date,
  add column pto_balance       numeric(6,1),  -- manually maintained accrual balance
  add column termination_date  date,
  add column termination_reason text,
  add column benefits_end_date date;

-- ---------------------------------------------------------------------------
-- employee_training_records — repeatable, so a child table (mirrors
-- leave_entries). Covers safety compliance, certifications, courses.
-- ---------------------------------------------------------------------------
create table employee_training_records (
  id              uuid primary key default gen_random_uuid(),
  employee_id     uuid not null references employees(id),
  training_name   text not null,
  completed_date  date,
  expiration_date date,   -- null = does not expire
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index employee_training_records_employee_idx on employee_training_records(employee_id);
create trigger employee_training_records_set_updated_at
  before update on employee_training_records
  for each row execute function set_updated_at();

alter table employee_training_records enable row level security;
create policy "authenticated full access" on employee_training_records
  for all to authenticated using (true) with check (true);
