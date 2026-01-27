import { RoleGuard } from "@/components/auth/role-guard"
import TechnicianInventoryClient from "./inventory-client"

export default function TechnicianInventoryPage() {
  return (
    <RoleGuard allowedRoles={["technician"]}>
      <TechnicianInventoryClient />
    </RoleGuard>
  )
}
