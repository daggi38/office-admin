import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "./types";

// One browser client per module load; @supabase/ssr singletons this internally.
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
