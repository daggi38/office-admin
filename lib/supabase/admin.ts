import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./types";

// Uses SUPABASE_SECRET_KEY — bypasses RLS entirely. Never import this from a
// "use client" component or anything bundled for the browser: the secret key
// would end up in client JS. Reach for the request-scoped client in
// server.ts first; this is only for privileged operations that must run
// outside a user session (e.g. scheduled jobs, admin scripts).
export function createAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error("createAdminClient must not be called from the browser.");
  }

  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
