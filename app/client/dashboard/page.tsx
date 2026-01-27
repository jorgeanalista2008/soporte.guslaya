import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { RoleGuard } from "@/components/auth/role-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { createClientService } from "@/lib/services/client-service"
import { clientSidebarItems } from "@/lib/config/sidebar-items"
import { ClientDashboardClient } from "./client-dashboard-client"

export default async function ClientDashboard() {
  const supabase = await createClient()

  if (!supabase) {
    redirect("/auth/login")
    return
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) {
    redirect("/auth/login")
  }

  const clientService = await createClientService(supabase)

  // Obtener estadísticas del dashboard
  const stats = clientService
    ? await clientService.getDashboardStats()
    : {
        totalOrders: 0,
        activeOrders: 0,
        completedOrders: 0,
        totalSpent: 0,
        averageResponseTime: 0,
        pendingPayments: 0,
      }

  // Obtener órdenes activas recientes
  const activeOrders = clientService ? await clientService.getMyOrders(5) : []
  const recentActiveOrders = activeOrders.filter(
    (order) => !["completed", "delivered", "cancelled"].includes(order.status),
  )

  const { data: equipments } = await supabase
    .from("equipments")
    .select("id, equipment_type, brand, model, serial_number")
    .eq("assigned_to", user.id)
    .eq("status", "active")

  return (
    <RoleGuard allowedRoles={["client"]}>
      <DashboardLayout
        sidebarItems={clientSidebarItems}
        userInfo={{
          name: profile.full_name,
          email: profile.email,
          role: profile.role,
        }}
      >
        <ClientDashboardClient
          stats={stats}
          recentActiveOrders={recentActiveOrders}
          existingEquipments={equipments || []}
        />
      </DashboardLayout>
    </RoleGuard>
  )
}
