"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/admin-table";
import { UserManagementColumns } from "./_components/user-management-table-columns";
import { User } from "@/types/user";
import Cookies from "js-cookie";

export default function AdminDashboard() {
  const token = Cookies.get("token");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5001/users", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch users");
        
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  return (
    <main className="p-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">User Management</h1>
        <div className="rounded-md border p-4 bg-white shadow-sm">
          {isLoading ? (
            <p>Loading users...</p>
          ) : (
            <DataTable
              columns={UserManagementColumns}
              data={users}
            />
          )}
        </div>
      </div>
    </main>
  );
}