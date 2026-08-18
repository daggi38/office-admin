-- Office Administration Platform — Phase 2 data layer
-- Supabase / Postgres schema. Apply as a migration, then seed document_categories.
-- v1: shared-login model. RLS enabled on every table with a single
-- "authenticated can do everything" policy (no per-user ownership).

-- ---------------------------------------------------------------------------
-- Helper: keep updated_at fresh
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- employees  (HR-1)
-- ---------------------------------------------------------------------------
create table employees (
  id                 uuid primary key default gen_random_uuid(),
  name               text not null,
  role               text not null,
  start_date         date not null,
  employment_status  text not null default 'active',   -- 'active' | 'inactive'
  salary             numeric(14,2),                     -- manually entered, never auto-calculated
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create trigger employees_set_updated_at
  before update on employees
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- document_categories  (ARC-1)
-- ---------------------------------------------------------------------------
create table document_categories (
  id          uuid primary key default gen_random_uuid(),
  key         text not null unique,      -- 'hr' | 'financial' | 'facilities' | ...
  label_en    text not null,
  label_am    text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger document_categories_set_updated_at
  before update on document_categories
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- documents  (ARC-1/2/3, HR-5) — generated AND uploaded, unified
-- ---------------------------------------------------------------------------
create table documents (
  id                   uuid primary key default gen_random_uuid(),
  title                text not null,
  category_id          uuid not null references document_categories(id),
  source               text not null,          -- 'generated' | 'uploaded'
  language             text,                    -- 'en' | 'am' | null
  storage_path         text,                    -- object path in Storage bucket
  mime_type            text,
  related_employee_id  uuid references employees(id),
  metadata             jsonb not null default '{}'::jsonb,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);
create index documents_category_idx on documents(category_id);
create index documents_source_idx   on documents(source);
create index documents_employee_idx on documents(related_employee_id);
create trigger documents_set_updated_at
  before update on documents
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- leave_entries  (HR-6)
-- ---------------------------------------------------------------------------
create table leave_entries (
  id           uuid primary key default gen_random_uuid(),
  employee_id  uuid not null references employees(id),
  type         text not null,            -- 'leave' | 'absence' | ...
  start_date   date not null,
  end_date     date,                     -- null = single day
  days         numeric(5,1),
  note         text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index leave_entries_employee_idx on leave_entries(employee_id);
create trigger leave_entries_set_updated_at
  before update on leave_entries
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- resource_schedule  (FAC-2) — reference only, no booking (FAC-3)
-- ---------------------------------------------------------------------------
create table resource_schedule (
  id          uuid primary key default gen_random_uuid(),
  resource    text not null,
  cycle_label text,
  detail_en   text,
  detail_am   text,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger resource_schedule_set_updated_at
  before update on resource_schedule
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS: enable on all, single authenticated-can-do-everything policy each.
-- Shared-login model: no per-user ownership. This only blocks anonymous access.
-- ---------------------------------------------------------------------------
alter table employees          enable row level security;
alter table document_categories enable row level security;
alter table documents          enable row level security;
alter table leave_entries      enable row level security;
alter table resource_schedule  enable row level security;

create policy "authenticated full access" on employees
  for all to authenticated using (true) with check (true);
create policy "authenticated full access" on document_categories
  for all to authenticated using (true) with check (true);
create policy "authenticated full access" on documents
  for all to authenticated using (true) with check (true);
create policy "authenticated full access" on leave_entries
  for all to authenticated using (true) with check (true);
create policy "authenticated full access" on resource_schedule
  for all to authenticated using (true) with check (true);

-- ---------------------------------------------------------------------------
-- Seed: base categories (bilingual). Extend as needed.
-- ---------------------------------------------------------------------------
insert into document_categories (key, label_en, label_am) values
  ('hr',         'HR',         'የሰው ኃይል'),
  ('financial',  'Financial',  'ፋይናንስ'),
  ('facilities', 'Facilities', 'ተቋማት')
on conflict (key) do nothing;
