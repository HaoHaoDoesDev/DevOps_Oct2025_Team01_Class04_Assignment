import ProtectedRoute from "@/components/auth/protected-routes";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="admin-container">
        <nav>Admin Sidebar</nav>
        <main>{children}</main>
      </div>
    </ProtectedRoute>
  );
}
