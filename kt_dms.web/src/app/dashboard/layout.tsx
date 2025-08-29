import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/layouts/DashboardLayout";
import { redirect } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  return (
    <div>
      {isAuthenticated && user ? (
        <DashboardLayout>{children}</DashboardLayout>
      ) : (
        redirect("/login")
      )}
    </div>
  );
}
