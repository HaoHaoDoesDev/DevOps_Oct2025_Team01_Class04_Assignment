"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/complex-ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/stores/user-store";
import { Button } from "@/components/ui/button";
import user from "@/config/user-routes";
import Cookies from "js-cookie";
import { toast } from "sonner";

const navData = [
  {
    title: "Tools",
    items: [
      { title: "Dashboard", route: "dashboard" },
      { title: "AI-Assistant", route: "featured" },
    ],
  },
];

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { userId, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    Cookies.remove("token");
    router.push(user.authentication);
    toast.success("Logging Out");
  };

  return (
    <Sidebar {...props} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <SidebarHeader>
          <Image
            src="/assets/logo/devops-assignment-logo.png"
            alt="Logo"
            width={200}
            height={150}
            className="object-cover"
          />
        </SidebarHeader>

        <SidebarContent>
          {navData.map((group) => (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => {
                    const url =
                      item.route === "dashboard" ? `/${userId}` : item.route;

                    const isActive = pathname === url;

                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link href={url}>{item.title}</Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
      </div>

      {/* Logout button pinned to the bottom */}
      <div className="p-4 space-y-4">
        <Button variant="default" onClick={handleLogout} className="w-full">
          Logout
        </Button>
      </div>

      <SidebarRail />
    </Sidebar>
  );
}
