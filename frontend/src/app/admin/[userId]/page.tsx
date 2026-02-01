"use client";

import { DataTable } from "@/components/ui/admin-table";
import { DummyDataADminDashboard } from "./_components/dummy-table-data";
import { UserManagementColumns } from "./_components/user-management-table-columns";

export default function AdminDashboard() {
  return (
    <main className="p-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">User Management</h1>
        <div className="rounded-md border p-4 bg-white shadow-sm">
          <DataTable
            columns={UserManagementColumns}
            data={DummyDataADminDashboard}
          />
        </div>
      </div>
    </main>
  );
}
