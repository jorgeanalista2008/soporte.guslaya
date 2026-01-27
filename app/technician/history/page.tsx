import { RoleGuard } from "@/components/auth/role-guard"
import TechnicianHistoryClient from "./history-client"

export default function TechnicianHistoryPage() {
  return (
    <RoleGuard allowedRoles={["technician"]}>
      <TechnicianHistoryClient />
    </RoleGuard>
  )
}
