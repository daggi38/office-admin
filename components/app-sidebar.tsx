"use client";

import { Briefcase, Building2, FileText, LogOut, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { signOut } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

const navItems = [
  { href: "/employees", label: "Employees", icon: Users },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/facilities", label: "Facilities", icon: Building2 },
];

export function AppSidebar({ userEmail }: { userEmail: string | null }) {
  const pathname = usePathname();
  const initial = userEmail?.trim().charAt(0).toUpperCase() ?? "?";

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="gap-3 px-3 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Briefcase className="size-4" />
          </div>
          <span className="text-sm font-semibold group-data-[collapsible=icon]:hidden">Office Admin</span>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="px-1 py-3">
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton isActive={isActive} tooltip={item.label} render={<Link href={item.href} />}>
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="px-3 py-3">
        <form action={signOut} className="flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
            {initial}
          </div>
          <div className="flex min-w-0 flex-1 flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate text-xs font-medium">{userEmail ?? "Signed in"}</span>
          </div>
          <Button
            type="submit"
            variant="ghost"
            size="icon-sm"
            className="shrink-0 text-muted-foreground group-data-[collapsible=icon]:hidden"
            aria-label="Sign out"
          >
            <LogOut />
          </Button>
        </form>
      </SidebarFooter>
    </Sidebar>
  );
}
