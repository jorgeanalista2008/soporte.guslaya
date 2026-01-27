import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { RoleGuard } from "@/components/auth/role-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { clientSidebarItems } from "@/lib/config/sidebar-items"
import { ClientEquipmentsPageClient } from "./equipments-client"

export default async function ClientEquipmentsPage() {
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

  if (!profile || profile.role !== "client") {
    redirect("/unauthorized")
  }

  return (
    <RoleGuard allowedRoles={["client"]}>
      <DashboardLayout
        sidebarItems={clientSidebarItems}
        userInfo={{
          name: profile.full_name || "Cliente",
          email: profile.email || "",
          role: profile.role,
        }}
      >
        <ClientEquipmentsPageClient />
      </DashboardLayout>
    </RoleGuard>
  )
}
