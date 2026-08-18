import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { ThemeProvider } from "next-themes";
import "./globals.css";

import { signOut } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
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
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <header className="flex items-center justify-between border-b border-border px-6 py-3">
            <nav className="flex items-center gap-4 text-sm font-medium">
              <Link href="/employees" className="text-muted-foreground transition-colors hover:text-foreground">
                Employees
              </Link>
              <Link href="/documents" className="text-muted-foreground transition-colors hover:text-foreground">
                Documents
              </Link>
              <Link href="/facilities" className="text-muted-foreground transition-colors hover:text-foreground">
                Facilities
              </Link>
            </nav>
            {user ? (
              <form action={signOut} className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">{user.email}</span>
                <Button type="submit" variant="ghost" size="sm">
                  Sign out
                </Button>
              </form>
            ) : (
              <Button variant="link" size="sm" render={<Link href="/login" />}>
                Sign in
              </Button>
            )}
          </header>
          <div className="flex flex-1 flex-col">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
