import { ProtectedRoute } from "@/components/ProtectedRoute";
import DashboardLayout from "@/layouts/DashboardLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}
