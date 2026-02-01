"use client";

import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/complex-ui/sidebar";
import { AdminAppSidebar } from "@/components/complex-ui/admin-sidebar";
import { Separator } from "@/components/ui/separator";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminAppSidebar />
      <SidebarInset className="flex flex-col min-h-screen overflow-x-hidden">
        <div className="flex flex-col min-h-screen">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </header>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
