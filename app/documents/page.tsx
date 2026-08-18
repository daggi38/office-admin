import Link from "next/link";

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
  const categoryKey = typeof searchParams.category === "string" ? searchParams.category : undefined;
  const sourceParam = typeof searchParams.source === "string" ? searchParams.source : undefined;
  const source = isDocumentSource(sourceParam) ? sourceParam : undefined;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          You need to sign in to view the document archive.
        </p>
        <Link href="/login" className="text-sm font-medium underline">
          Go to sign in
        </Link>
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
        <Link
          href="/documents/upload"
          className="rounded bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white dark:bg-zinc-50 dark:text-zinc-900"
        >
          Upload
        </Link>
      </div>

      <form method="GET" className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="q" className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Search title
          </label>
          <input
            id="q"
            name="q"
            defaultValue={search ?? ""}
            className="rounded border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="category" className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Category
          </label>
          <select
            id="category"
            name="category"
            defaultValue={categoryKey ?? ""}
            className="rounded border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="">All</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.key}>
                {category.label_en}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="source" className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Source
          </label>
          <select
            id="source"
            name="source"
            defaultValue={source ?? ""}
            className="rounded border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="">All</option>
            <option value="uploaded">Uploaded</option>
            <option value="generated">Generated</option>
          </select>
        </div>
        <button
          type="submit"
          className="rounded border border-zinc-300 px-3 py-1.5 text-sm font-medium dark:border-zinc-700"
        >
          Filter
        </button>
      </form>

      {(categoriesError || documentsError) && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {categoriesError ?? documentsError}
        </p>
      )}

      {!documentsError && documents && documents.length === 0 && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">No documents found.</p>
      )}

      {!documentsError && documents && documents.length > 0 && (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-left text-xs uppercase text-zinc-500 dark:border-zinc-800">
              <th className="py-2 pr-4">Title</th>
              <th className="py-2 pr-4">Category</th>
              <th className="py-2 pr-4">Source</th>
              <th className="py-2 pr-4">Uploaded</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((document) => (
              <tr key={document.id} className="border-b border-zinc-100 dark:border-zinc-900">
                <td className="py-2 pr-4">
                  {document.storage_path ? (
                    <a href={`/documents/${document.id}/download`} className="underline">
                      {document.title}
                    </a>
                  ) : (
                    document.title
                  )}
                </td>
                <td className="py-2 pr-4">{categoryLabelById.get(document.category_id) ?? "—"}</td>
                <td className="py-2 pr-4">{document.source}</td>
                <td className="py-2 pr-4">{new Date(document.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
