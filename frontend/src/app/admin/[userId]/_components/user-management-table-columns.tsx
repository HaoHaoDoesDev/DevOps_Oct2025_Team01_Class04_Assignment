"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/types/user";
import Cookies from "js-cookie";
import { toast } from "sonner";

export const getUserColumns = (
  onUserDeleted: () => void,
): ColumnDef<User>[] => [
  {
    accessorKey: "id",
    header: "User ID",
  },
  {
    accessorKey: "email",
    header: "User Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;
      const token = Cookies.get("token");

      const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${user.email}?`)) return;
        try {
          const response = await fetch(
            `http://localhost:5001/users/${user.id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to delete user");
          }

          toast.success("User deleted successfully");
          onUserDeleted();
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : "Error deleting user";
          toast.error(message);
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDelete}
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
