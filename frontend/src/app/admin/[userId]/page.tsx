"use client";

import { useEffect, useState, useCallback } from "react";
import { DataTable } from "@/components/ui/admin-table";
import { UserManagementColumns } from "./_components/user-management-table-columns";
import { User } from "@/types/user";
import Cookies from "js-cookie";
import { AddUserDialog } from "./_components/create-user-dialog";

export default function AdminDashboard() {
  const token = Cookies.get("token");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    if (!token) return;
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
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <main className="p-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">Manage your application users and their roles.</p>
          </div>
          <AddUserDialog onUserAdded={fetchUsers} />
        </div>
        <div className="rounded-md border p-4 bg-white shadow-sm">
          {isLoading ? (
            <p className="p-8 text-center text-sm text-muted-foreground">Loading users...</p>
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