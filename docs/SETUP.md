# Backend setup (manual steps)

These steps aren't scriptable from here (need dashboard/CLI login) — do them once per Supabase project.

## 1. Apply the migration

Run `supabase/migrations/20260817000000_office_admin_init.sql` against the project (SQL Editor, or `supabase db push` if the project is linked via CLI). It creates all 5 tables, RLS policies, and seeds `document_categories`.

## 2. Create the shared auth user

v1 uses one shared login for all office staff (SRS §7). In the Supabase dashboard:

- Authentication → Users → Add user
- Enter the shared email + password the office will use
- Confirm the user immediately (skip email confirmation) so it can sign in right away

The Next.js app signs in with this one credential; do not create per-user accounts.

## 3. Create the Storage bucket

- Storage → New bucket → name it `documents` (matches `DOCUMENTS_BUCKET` in `lib/data/documents.ts`)
- **Not** public — downloads go through signed URLs (`getDownloadUrl`), never public bucket URLs
- Add a storage policy restricting access to the `authenticated` role, matching the table RLS policies:

```sql
create policy "authenticated full access to documents bucket"
on storage.objects for all
to authenticated
using (bucket_id = 'documents')
with check (bucket_id = 'documents');
```

## 4. Verify env vars

`.env.local` should already have (new key format):

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...
```

`SUPABASE_SECRET_KEY` is read only by `lib/supabase/admin.ts` (server-only, bypasses RLS) — never expose it to the client.
