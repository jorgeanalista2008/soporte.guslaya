import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { RoleGuard } from "@/components/auth/role-guard"
import { AdminLayout } from "@/components/admin/admin-layout"
import { EquipmentsPageClient } from "./equipments-client"

export default async function EquipmentsPage() {
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

  if (!profile || profile.role !== "admin") {
    redirect("/unauthorized")
  }

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <AdminLayout
        userInfo={{
          name: profile.full_name || "Usuario",
          email: profile.email || "",
          role: profile.role,
        }}
      >
        <EquipmentsPageClient />
      </AdminLayout>
    </RoleGuard>
  )
}
