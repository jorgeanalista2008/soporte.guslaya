import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { RoleGuard } from "@/components/auth/role-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { NewServiceRequestForm } from "@/components/orders/new-service-request-form"
import { clientSidebarItems } from "@/lib/config/sidebar-items"

export default async function ClientNewRequestPage() {
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
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Nueva Solicitud de Servicio</h1>
            <p className="text-muted-foreground">
              Completa el formulario para solicitar un servicio técnico para tu equipo
            </p>
          </div>

          <NewServiceRequestForm existingEquipments={equipments || []} />
        </div>
      </DashboardLayout>
    </RoleGuard>
  )
}
