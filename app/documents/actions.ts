"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { uploadFile } from "@/lib/data/documents";
import { createClient } from "@/lib/supabase/server";

export interface UploadFormState {
  error?: string;
}

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
}

export async function uploadDocumentAction(
  _prevState: UploadFormState,
  formData: FormData
): Promise<UploadFormState> {
  await requireUser();

  const file = formData.get("file");
  const categoryId = String(formData.get("category_id") ?? "");
  const title = String(formData.get("title") ?? "").trim();

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a file to upload." };
  }
  if (!categoryId) {
    return { error: "Choose a category." };
  }

  const { error } = await uploadFile(file, categoryId, { title: title || undefined });
  if (error) return { error };

  revalidatePath("/documents");
  redirect("/documents");
}
