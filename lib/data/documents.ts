import { createClient } from "@/lib/supabase/server";
import type { Document, DocumentInsert, DocumentSource } from "@/lib/supabase/types";

import { err, ok, type Result } from "./result";

// Bucket created manually in the Supabase dashboard — see docs/SETUP.md.
const DOCUMENTS_BUCKET = "documents";
const SIGNED_URL_TTL_SECONDS = 60 * 60; // 1 hour

export interface DocumentFilter {
  categoryKey?: string;
  source?: DocumentSource;
  search?: string;
}

export async function listDocuments(filter: DocumentFilter = {}): Promise<Result<Document[]>> {
  const supabase = await createClient();
  let query = supabase
    .from("documents")
    .select(filter.categoryKey ? "*, category:document_categories!inner(key)" : "*")
    .order("created_at", { ascending: false });

  if (filter.categoryKey) {
    query = query.eq("category.key", filter.categoryKey);
  }
  if (filter.source) {
    query = query.eq("source", filter.source);
  }
  if (filter.search) {
    query = query.ilike("title", `%${filter.search}%`);
  }

  const { data, error } = await query;
  if (error) return err(error.message);
  return ok(data as unknown as Document[]);
}

export async function getDocument(id: string): Promise<Result<Document>> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("documents").select("*").eq("id", id).single();
  if (error) return err(error.message);
  return ok(data);
}

// For a generated doc already saved to Storage, or an uploaded file whose
// Storage object was written separately. Most uploads should go through
// uploadFile() instead, which does both steps together.
export async function createDocumentRecord(data: DocumentInsert): Promise<Result<Document>> {
  const supabase = await createClient();
  const { data: row, error } = await supabase.from("documents").insert(data).select().single();
  if (error) return err(error.message);
  return ok(row);
}

export async function uploadFile(
  file: File,
  categoryId: string,
  opts: { title?: string; relatedEmployeeId?: string } = {}
): Promise<Result<Document>> {
  const supabase = await createClient();
  const storagePath = `uploads/${crypto.randomUUID()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .upload(storagePath, file, { contentType: file.type || undefined });
  if (uploadError) return err(uploadError.message);

  const { data: row, error: insertError } = await supabase
    .from("documents")
    .insert({
      title: opts.title ?? file.name,
      category_id: categoryId,
      source: "uploaded",
      storage_path: storagePath,
      mime_type: file.type || null,
      related_employee_id: opts.relatedEmployeeId ?? null,
    })
    .select()
    .single();

  if (insertError) {
    // Row insert failed after the object was written — remove the orphaned
    // object so Storage doesn't accumulate files with no matching record.
    await supabase.storage.from(DOCUMENTS_BUCKET).remove([storagePath]);
    return err(insertError.message);
  }

  return ok(row);
}

export async function getDownloadUrl(storagePath: string): Promise<Result<string>> {
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .createSignedUrl(storagePath, SIGNED_URL_TTL_SECONDS);
  if (error) return err(error.message);
  return ok(data.signedUrl);
}
