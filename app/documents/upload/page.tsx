import Link from "next/link";

import { Button } from "@/components/ui/button";
import { listCategories } from "@/lib/data/categories";
import { createClient } from "@/lib/supabase/server";

import { UploadForm } from "../upload-form";

export const dynamic = "force-dynamic";

export default async function UploadDocumentPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
        <p className="text-sm text-muted-foreground">You need to sign in to upload documents.</p>
        <Button variant="link" render={<Link href="/login" />}>
          Go to sign in
        </Button>
      </main>
    );
  }

  const { data: categories, error } = await listCategories();

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-8">
      <h1 className="text-xl font-semibold">Upload document</h1>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      {categories && <UploadForm categories={categories} />}
    </main>
  );
}
