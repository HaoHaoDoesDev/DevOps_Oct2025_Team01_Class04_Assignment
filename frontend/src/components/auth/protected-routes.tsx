"use client";
import { useAuthStore } from "@/stores/user-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import userRoutes from "@/config/user-routes";

export default function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: "ADMIN" | "USER";
}) {
  const { token, role, userId } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push(userRoutes.authentication);
    } else if (requiredRole && role !== requiredRole) {
      router.push(
        role === "ADMIN" ? userRoutes.adminDashboard(userId!) : "/user",
      );
    }
  }, [token, role, router, userId, requiredRole]);

  return token ? <>{children}</> : null;
}
