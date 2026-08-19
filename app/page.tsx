import { Building2, FileText, Users } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { listEmployees } from "@/lib/data/employees";
import { listDocuments } from "@/lib/data/documents";
import { listSchedule } from "@/lib/data/schedule";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
        <p className="text-sm text-muted-foreground">Sign in to access the office administration platform.</p>
        <Button render={<Link href="/login" />}>Go to sign in</Button>
      </main>
    );
  }

  const [{ data: employees }, { data: documents }, { data: schedule }] = await Promise.all([
    listEmployees({ status: "active" }),
    listDocuments(),
    listSchedule(),
  ]);

  const modules = [
    {
      href: "/employees",
      icon: Users,
      title: "Employees",
      description: "Records, leave & attendance",
      stat: `${employees?.length ?? 0} active`,
    },
    {
      href: "/documents",
      icon: FileText,
      title: "Documents",
      description: "Archive of uploaded & generated files",
      stat: `${documents?.length ?? 0} on file`,
    },
    {
      href: "/facilities",
      icon: Building2,
      title: "Facilities",
      description: "Shared resource schedule",
      stat: `${schedule?.length ?? 0} entries`,
    },
  ];

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-8">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        {modules.map((mod) => (
          <Card key={mod.href}>
            <CardHeader>
              <mod.icon className="size-5 text-muted-foreground" />
              <CardTitle>{mod.title}</CardTitle>
              <CardDescription>{mod.description}</CardDescription>
              <CardAction>
                <Button variant="outline" size="sm" render={<Link href={mod.href} />}>
                  Open
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="text-sm font-medium">{mod.stat}</CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
