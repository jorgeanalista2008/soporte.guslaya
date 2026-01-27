import { RoleGuard } from "@/components/auth/role-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ClientDetails } from "@/components/clients/client-details"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { clientSidebarItems } from "@/lib/config/sidebar-items"

export default async function ClientProfilePage() {
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

  // Get client details
  const { data: clientData } = await supabase.from("clients").select("*").eq("user_id", user.id).maybeSingle()

  const { data: orders } = await supabase
    .from("service_orders")
    .select(`
      id, 
      order_number, 
      status, 
      received_date, 
      final_cost,
      equipments (
        type,
        brand,
        model
      )
    `)
    .eq("client_id", user.id)
    .order("received_date", { ascending: false })

  const transformedOrders =
    orders?.map((order) => ({
      id: order.id,
      order_number: order.order_number,
      device_type: order.equipments
        ? `${order.equipments.type} ${order.equipments.brand} ${order.equipments.model}`.trim()
        : "Equipo no especificado",
      status: order.status,
      received_date: order.received_date,
      final_cost: order.final_cost,
    })) || []

  const clientDetails = {
    id: clientData?.id || "",
    user_id: user.id,
    full_name: profile.full_name,
    email: profile.email,
    phone: profile.phone,
    company_name: clientData?.company_name,
    address: clientData?.address,
    city: clientData?.city,
    postal_code: clientData?.postal_code,
    tax_id: clientData?.tax_id,
    notes: clientData?.notes,
    is_active: profile.is_active,
    created_at: profile.created_at,
  }

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
            <h1 className="text-3xl font-bold text-foreground">Mi Perfil</h1>
            <p className="text-muted-foreground">Información de tu cuenta y historial de servicios</p>
          </div>

          <ClientDetails client={clientDetails} orders={transformedOrders} />
        </div>
      </DashboardLayout>
    </RoleGuard>
  )
}
