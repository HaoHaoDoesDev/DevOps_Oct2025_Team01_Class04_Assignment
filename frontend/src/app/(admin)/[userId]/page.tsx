"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/admin-table";

export default function AdminDashboard() {
  type UserLog = {
    id: string;
    action: string;
    status: "success" | "failed";
    date: string;
  };

  const columns: ColumnDef<UserLog>[] = [
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "action",
      header: "Action",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <span
            className={status === "success" ? "text-green-600" : "text-red-600"}
          >
            {status}
          </span>
        );
      },
    },
  ];

  const data: UserLog[] = [
    { id: "1", action: "Login", status: "success", date: "2024-05-20" },
    { id: "2", action: "Update Profile", status: "failed", date: "2024-05-21" },
  ];
  return (
    <main>
      <div className="m-8">
        <div className="text-3xl font-bold">Dashboard</div>
        <div>
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </main>
  );
}
