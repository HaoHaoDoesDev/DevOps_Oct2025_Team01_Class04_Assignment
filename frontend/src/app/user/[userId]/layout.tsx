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

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = useAuthStore();
  const userNavigation = [
    {
      title: "My Account",
      items: [
        {
          title: "My Dashboard",
          route: userId ? userRoutes.userDashboard(userId) : "#",
        },
      ],
    },
  ];

  return (
    <SidebarProvider>
      <AppSidebar navigation={userNavigation} />

      <SidebarInset className="flex flex-col min-h-screen overflow-x-hidden">
        <div className="flex flex-col min-h-screen">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </header>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
