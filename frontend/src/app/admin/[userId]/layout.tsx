"use client";

import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/complex-ui/sidebar";
import { AppSidebar } from "@/components/complex-ui/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/stores/user-store";
import userRoutes from "@/config/user-routes";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = useAuthStore();

  const adminNavigation = [
    {
      title: "Tools",
      items: [
        {
          title: "Dashboard",
          route: userId ? userRoutes.adminDashboard(userId) : "#",
        },
      ],
    },
    {
      title: "System",
      items: [
        {
          title: "Program Logs",
          route: userId ? userRoutes.systemLogs(userId) : "#",
        },
      ],
    },
  ];

  return (
    <SidebarProvider>
      <AppSidebar navigation={adminNavigation} />

      <SidebarInset className="flex flex-col min-h-screen overflow-x-hidden">
        <div className="flex flex-col min-h-screen">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </header>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
