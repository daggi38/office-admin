"use client";

import { Building2, FileText, Users } from "lucide-react";
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
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navItems = [
  { href: "/employees", label: "Employees", icon: Users },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/facilities", label: "Facilities", icon: Building2 },
];

export function AppSidebar({ userEmail }: { userEmail: string | null }) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="px-2 py-1 text-sm font-semibold">Office Admin</div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
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
      <SidebarFooter>
        {userEmail ? (
          <form action={signOut} className="flex flex-col gap-2 px-2 py-1">
            <span className="truncate text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
              {userEmail}
            </span>
            <Button type="submit" variant="outline" size="sm" className="group-data-[collapsible=icon]:hidden">
              Sign out
            </Button>
          </form>
        ) : (
          <Button variant="outline" size="sm" className="mx-2 group-data-[collapsible=icon]:hidden" render={<Link href="/login" />}>
            Sign in
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
