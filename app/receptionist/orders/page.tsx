import { RoleGuard } from "@/components/auth/role-guard"
import { ReceptionistLayout } from "@/components/receptionist/receptionist-layout"
import { OrdersClient } from "./orders-client"
import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function ReceptionistOrdersPage() {
  const supabase = await createClient()

  if (!supabase) {
    redirect("/auth/login")
  }

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error("Authentication error:", userError)
      redirect("/auth/login")
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      console.error("Profile error:", profileError)
      redirect("/auth/login")
    }

    if (!["receptionist", "admin"].includes(profile.role)) {
      redirect("/unauthorized")
    }

    const userInfo = {
      name: profile.full_name || profile.email || "Usuario",
      email: profile.email || user.email || "",
      role: profile.role || "receptionist",
    }

    return (
      <RoleGuard allowedRoles={["receptionist", "admin"]}>
        <ReceptionistLayout userInfo={userInfo}>
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Órdenes de Servicio</h1>
              <p className="text-gray-600">Gestiona todas las órdenes de servicio</p>
            </div>

            <Suspense
              fallback={
                <div className="flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Cargando órdenes...</p>
                  </div>
                </div>
              }
            >
              <OrdersClient />
            </Suspense>
          </div>
        </ReceptionistLayout>
      </RoleGuard>
    )
  } catch (error) {
    console.error("Error loading user data:", error)
    redirect("/auth/login")
  }
}
