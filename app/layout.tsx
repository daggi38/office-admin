import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
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

  const cookieStore = await cookies();
  const sidebarOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full">
        <TooltipProvider>
          {user ? (
            <SidebarProvider defaultOpen={sidebarOpen}>
              <AppSidebar userEmail={user.email ?? null} />
              <SidebarInset>
                <header className="sticky top-0 z-10 flex items-center gap-2 border-b border-border bg-background/80 px-6 py-4 backdrop-blur">
                  <SidebarTrigger />
                </header>
                <div className="flex flex-1 flex-col">{children}</div>
              </SidebarInset>
            </SidebarProvider>
          ) : (
            <div className="flex min-h-svh flex-1 flex-col">{children}</div>
          )}
        </TooltipProvider>
      </body>
    </html>
  );
}
