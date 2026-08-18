import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

import { signOut } from "@/app/login/actions";
import { createClient } from "@/lib/supabase/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Office Admin",
  description: "Office Administration Platform",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="flex items-center justify-between border-b border-zinc-200 px-6 py-3 dark:border-zinc-800">
          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link href="/employees">Employees</Link>
            <Link href="/documents">Documents</Link>
          </nav>
          {user ? (
            <form action={signOut} className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
              <span>{user.email}</span>
              <button type="submit" className="underline">
                Sign out
              </button>
            </form>
          ) : (
            <Link href="/login" className="text-sm font-medium underline">
              Sign in
            </Link>
          )}
        </header>
        <div className="flex flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
