import { createClient } from "@/lib/supabase/server";
import type { DocumentCategory } from "@/lib/supabase/types";

import { err, ok, type Result } from "./result";

export async function listCategories(): Promise<Result<DocumentCategory[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("document_categories")
    .select("*")
    .order("label_en", { ascending: true });
  if (error) return err(error.message);
  return ok(data);
}
