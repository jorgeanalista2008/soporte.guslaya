import { ClientRoleGuard } from "@/components/auth/client-role-guard"
import { AdminDashboardClient } from "./admin-dashboard-client"

export default function AdminDashboard() {
  return (
    <ClientRoleGuard allowedRoles={["admin"]}>
      <AdminDashboardClient />
    </ClientRoleGuard>
  )
}
