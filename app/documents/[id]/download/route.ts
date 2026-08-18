import { NextResponse } from "next/server";

import { getDocument, getDownloadUrl } from "@/lib/data/documents";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request, ctx: RouteContext<"/documents/[id]/download">) {
  const { id } = await ctx.params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { data: document, error: docError } = await getDocument(id);
  if (docError || !document || !document.storage_path) {
    return NextResponse.json(
      { error: docError ?? "This document has no file to download." },
      { status: 404 }
    );
  }

  const { data: url, error } = await getDownloadUrl(document.storage_path);
  if (error || !url) {
    return NextResponse.json({ error: error ?? "Could not generate a download link." }, { status: 500 });
  }

  return NextResponse.redirect(url);
}
