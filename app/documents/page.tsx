import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listCategories } from "@/lib/data/categories";
import { listDocuments } from "@/lib/data/documents";
import { createClient } from "@/lib/supabase/server";
import type { DocumentSource } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

function isDocumentSource(value: string | undefined): value is DocumentSource {
  return value === "generated" || value === "uploaded";
}

export default async function DocumentsPage(props: PageProps<"/documents">) {
  const searchParams = await props.searchParams;
  const search = typeof searchParams.q === "string" ? searchParams.q : undefined;
  const categoryParam = typeof searchParams.category === "string" ? searchParams.category : undefined;
  const categoryKey = categoryParam && categoryParam !== "all" ? categoryParam : undefined;
  const sourceParam = typeof searchParams.source === "string" ? searchParams.source : undefined;
  const source = isDocumentSource(sourceParam) ? sourceParam : undefined;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
        <p className="text-sm text-muted-foreground">You need to sign in to view the document archive.</p>
        <Button variant="link" render={<Link href="/login" />}>
          Go to sign in
        </Button>
      </main>
    );
  }

  const [{ data: categories, error: categoriesError }, { data: documents, error: documentsError }] =
    await Promise.all([listCategories(), listDocuments({ categoryKey, source, search })]);

  const categoryLabelById = new Map((categories ?? []).map((c) => [c.id, c.label_en]));

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Documents</h1>
        <Button render={<Link href="/documents/upload" />}>Upload</Button>
      </div>

      <form method="GET" className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="q" className="text-xs text-muted-foreground">
            Search title
          </Label>
          <Input id="q" name="q" defaultValue={search ?? ""} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="category" className="text-xs text-muted-foreground">
            Category
          </Label>
          <Select name="category" defaultValue={categoryKey ?? "all"}>
            <SelectTrigger id="category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.key}>
                  {category.label_en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="source" className="text-xs text-muted-foreground">
            Source
          </Label>
          <Select name="source" defaultValue={source ?? "all"}>
            <SelectTrigger id="source">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="uploaded">Uploaded</SelectItem>
              <SelectItem value="generated">Generated</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" variant="outline">
          Filter
        </Button>
      </form>

      {(categoriesError || documentsError) && (
        <p className="text-sm text-destructive" role="alert">
          {categoriesError ?? documentsError}
        </p>
      )}

      {!documentsError && documents && documents.length === 0 && (
        <p className="text-sm text-muted-foreground">No documents found.</p>
      )}

      {!documentsError && documents && documents.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Uploaded</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((document) => (
              <TableRow key={document.id}>
                <TableCell>
                  {document.storage_path ? (
                    <a href={`/documents/${document.id}/download`} className="underline">
                      {document.title}
                    </a>
                  ) : (
                    document.title
                  )}
                </TableCell>
                <TableCell>{categoryLabelById.get(document.category_id) ?? "—"}</TableCell>
                <TableCell>{document.source}</TableCell>
                <TableCell>{new Date(document.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </main>
  );
}
