import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

import { createEmployeeAction } from "../actions";
import { EmployeeForm } from "../employee-form";

export const dynamic = "force-dynamic";

export default async function NewEmployeePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">You need to sign in to add employees.</p>
        <Link href="/login" className="text-sm font-medium underline">
          Go to sign in
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-8">
      <h1 className="text-xl font-semibold">Add employee</h1>
      <EmployeeForm action={createEmployeeAction} submitLabel="Create employee" />
    </main>
  );
}
