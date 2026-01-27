import { RoleGuard } from "@/components/auth/role-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { OrdersTable } from "@/components/orders/orders-table"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { clientSidebarItems } from "@/lib/config/sidebar-items"

export default async function ClientOrdersPage() {
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

  const { data: orders } = await supabase
    .from("service_orders")
    .select(`
      *,
      equipments (
        equipment_type,
        brand,
        model
      )
    `)
    .eq("client_id", user.id)
    .order("received_date", { ascending: false })

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
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mis Órdenes de Servicio</h1>
            <p className="text-muted-foreground">Seguimiento del estado de tus equipos</p>
          </div>

          <OrdersTable orders={orders || []} showClientInfo={false} userRole="client" />
        </div>
      </DashboardLayout>
    </RoleGuard>
  )
}
