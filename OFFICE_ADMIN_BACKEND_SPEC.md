# Office Administration Platform — Backend Implementation Spec (for Claude Code)

**Target:** Implement the Phase 2 data layer for the Office Administration Platform (HR · Facilities · Document Archive) using **Supabase** as the backend, wired into the existing Next.js UI scaffold (Phase 1, already complete).

This document is the source of truth for the backend/data work. It resolves two of the SRS "Not yet decided" items: *data storage / backend approach* and *hosting for the data layer*.

---

## 1. Decision: Supabase

Use **Supabase** for the backend. Rationale, tied to the SRS:

- **Postgres** covers all structured records (employees, documents, categories, schedule entries, leave).
- **Supabase Storage** covers ARC-3 (upload and browse existing files) — no separate file host needed.
- **Supabase Auth** covers the v1 **shared login** requirement (SRS §7 Access: one shared account, no per-user separation). Do NOT build per-user accounts or role separation — explicitly out of scope for v1.
- **No server to run or host** — resolves the SRS open items on backend approach and hosting. Frontend (Next.js) + Supabase is the whole stack.
- The Supabase JS client is called **directly from the Next.js app**; no separate custom API layer for v1.

**Out of scope / not Supabase's job:** the `.docx` generation pipeline (HR letters, Nyala-font templating). Supabase stores the *data* and the *generated/uploaded files*; generation runs in the app (client-side or a Supabase Edge Function / serverless function). That is a separate task from this data layer.

### Auth model (v1)
- One shared Supabase Auth user (email + password) for all office staff.
- The Next.js app signs in with that shared credential and keeps the session.
- Because everyone shares one identity, **Row-Level Security (RLS) is not a meaningful access control here.** Still enable RLS on every table and add a single policy: "authenticated users can do everything." This prevents anonymous/public access while matching the shared-login model. Do not attempt per-user ownership policies.

---

## 2. Environment / Setup

- Add Supabase client deps: `@supabase/supabase-js` (and `@supabase/ssr` if using server components for data fetching).
- Env vars (never hardcode): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Server-only operations that need it use `SUPABASE_SERVICE_ROLE_KEY` (never expose to the client).
- Create a single shared client module (e.g. `lib/supabase/client.ts` for browser, `lib/supabase/server.ts` for server) — do not instantiate the client ad-hoc in components.
- Keep data-access functions in a dedicated layer (e.g. `lib/data/*.ts`), one file per entity, mirroring however the existing app already separates concerns. UI components call these functions, never the Supabase client directly.

---

## 3. Data model

All tables: `id uuid primary key default gen_random_uuid()`, `created_at timestamptz default now()`, `updated_at timestamptz default now()`. Enable RLS on all; single "authenticated can do all" policy on each.

### 3.1 employees  (HR-1)
Maintain employee records; deactivate, never hard-delete (HR-1 acceptance criteria).

| column | type | notes |
|---|---|---|
| name | text, not null | |
| role | text, not null | |
| start_date | date, not null | |
| employment_status | text, not null | e.g. `active` / `inactive`. Deactivation sets this to `inactive`. |
| salary | numeric(14,2) | manually entered; never auto-calculated (SRS Data integrity) |

Deactivation = set `employment_status = 'inactive'`. Never delete the row.

### 3.2 document_categories  (ARC-1)
Fixed category system: HR, Financial, Facilities, etc. Every document has exactly one category.

| column | type | notes |
|---|---|---|
| key | text, unique, not null | machine key e.g. `hr`, `financial`, `facilities` |
| label_en | text, not null | |
| label_am | text, not null | Amharic label (bilingual requirement) |

Seed with at least: HR, Financial, Facilities. Extendable.

### 3.3 documents  (ARC-1, ARC-2, ARC-3, HR-5)
Unified table for BOTH generated documents and uploaded files. `source` distinguishes them.

| column | type | notes |
|---|---|---|
| title | text, not null | |
| category_id | uuid, not null, fk → document_categories(id) | exactly one category (ARC-1) |
| source | text, not null | `generated` or `uploaded` |
| language | text | `en` / `am` / null — for generated docs |
| storage_path | text | path in Supabase Storage bucket (for uploaded files AND saved generated .docx) |
| mime_type | text | |
| related_employee_id | uuid, null, fk → employees(id) | e.g. an HR letter tied to an employee; nullable |
| metadata | jsonb, default '{}' | template name, entered figures, etc. — flexible |

Staffing proposals & job descriptions (HR-5) are `documents` rows under the HR category — no separate table needed.

### 3.4 leave_entries  (HR-6)
Leave/attendance logged against an employee, viewable as running history.

| column | type | notes |
|---|---|---|
| employee_id | uuid, not null, fk → employees(id) | |
| type | text, not null | e.g. `leave`, `absence` |
| start_date | date, not null | |
| end_date | date | null = single day |
| days | numeric(5,1) | number of days logged |
| note | text | |

History view = all `leave_entries` for an employee, ordered by `start_date desc`.

### 3.5 resource_schedule  (FAC-2)
Reference schedule for supplies/resources across the supply cycle (stationery, sanitary, water allocation, etc.). Reference/documentation only — no booking workflow (FAC-3).

| column | type | notes |
|---|---|---|
| resource | text, not null | e.g. "Water allocation", "Stationery" |
| cycle_label | text | e.g. which program day / event / cycle window |
| detail_en | text | |
| detail_am | text | |
| sort_order | int, default 0 | for stable display ordering |

### Facilities policy (FAC-1)
Kitchen/hall/compound usage policy is **static bilingual content**, not necessarily DB-backed. Either store as `documents` (category = facilities) or as static in-app content. Prefer static content in v1 unless the team wants to edit it without a deploy — flag this as a small open choice, default to static.

---

## 4. SQL migration

Provide this as a Supabase migration (`supabase/migrations/xxxx_office_admin_init.sql`). See `office_admin_schema.sql` (generated alongside this doc) for the full DDL — apply it as-is, then seed `document_categories`.

---

## 5. Data-access layer to build (one file per entity)

Mirror the existing app's separation (models / server-calls / hooks) if it has one. Functions needed:

- **employees**: `listEmployees(filter?)`, `getEmployee(id)`, `createEmployee(data)`, `updateEmployee(id, data)`, `deactivateEmployee(id)` (sets status inactive — no delete).
- **documents**: `listDocuments({ categoryKey?, source?, search? })`, `getDocument(id)`, `createDocumentRecord(data)` (for a generated or uploaded doc), `uploadFile(file, categoryId)` (Storage upload + row insert), `getDownloadUrl(storage_path)` (signed URL from Storage).
- **categories**: `listCategories()`.
- **leave**: `listLeaveForEmployee(employeeId)`, `createLeaveEntry(data)`.
- **schedule**: `listSchedule()`, `upsertScheduleEntry(data)`.

Each wraps the Supabase client, returns typed results, and surfaces errors consistently (match the app's existing error-handling convention).

---

## 6. Storage

- Create one bucket, e.g. `documents`.
- Uploaded files (ARC-3) and saved generated `.docx` files (ARC-2/HR-2/HR-3) both live here; the `documents.storage_path` column points at the object.
- Downloads use **signed URLs** generated via the Supabase client (`createSignedUrl`) — do not rely on public bucket URLs, and do not expose the service role key to the browser.
- Bucket access: authenticated-only, matching the shared-login model.

---

## 7. Guardrails (from the SRS — do not violate)

- **Never auto-calculate salary or severance.** These are manually entered and stored verbatim. No computed severance under Labour Proclamation 1156/2011 in v1 (SRS §6, Data integrity).
- **No per-user accounts / permissions.** Shared login only.
- **No request/booking workflow** for Facilities. Facilities data is reference-only (FAC-3).
- **Bilingual is structural, not just labels.** Any user-facing text stored in the DB that appears in both languages needs `_en` and `_am` columns (as in categories and schedule), so the interface can switch language without losing data.
- **Deactivate, don't delete** employees.

---

## 8. What this task does NOT include

- The `.docx` generation pipeline (Nyala templating) — separate task.
- Facilities scheduling content authoring in both languages (Phase 4).
- Any analytics/reporting dashboards (out of scope v1).
- Financial/budget module (possible later phase).

Build the schema, storage, and data-access layer; wire it to the existing Phase 1 UI. Stop there.
