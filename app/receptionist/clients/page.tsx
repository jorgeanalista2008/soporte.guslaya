import { RoleGuard } from "@/components/auth/role-guard"
import { ReceptionistLayout } from "@/components/receptionist/receptionist-layout"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ClientsClient } from "./clients-client"

export default async function ReceptionistClientsPage() {
  console.log("[v0] Starting ReceptionistClientsPage")

  const supabase = await createClient()

  if (!supabase) {
    console.log("[v0] No supabase client, redirecting to login")
    redirect("/auth/login")
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    console.log("[v0] No user found, redirecting to login")
    redirect("/auth/login")
  }

  console.log("[v0] User found:", user.id)

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) {
    console.log("[v0] No profile found, redirecting to login")
    redirect("/auth/login")
  }

  console.log("[v0] Profile found:", profile.role)

  try {
    const { data: clients = [], error: clientsError } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false })

    if (clientsError) {
      console.log("[v0] Error fetching clients:", clientsError)
      throw clientsError
    }

    console.log("[v0] Clients fetched:", clients.length)

    const userIds = clients.map((client) => client.user_id).filter(Boolean)
    const { data: profiles = [], error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name, email, phone")
      .in("id", userIds)

    if (profilesError) {
      console.log("[v0] Error fetching profiles:", profilesError)
    }

    console.log("[v0] Profiles fetched:", profiles.length)

    const { data: serviceOrderCounts = [], error: ordersError } = await supabase
      .from("service_orders")
      .select("client_id")
      .in("client_id", userIds)

    if (ordersError) {
      console.log("[v0] Error fetching service orders:", ordersError)
    }

    console.log("[v0] Service orders fetched:", serviceOrderCounts.length)

    // Calcular estadísticas
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const stats = {
      total: clients.length,
      active: clients.filter((client) => client.is_active !== false).length,
      inactive: clients.filter((client) => client.is_active === false).length,
      withOrders: serviceOrderCounts.length,
      withEquipments: 0, // Por ahora 0 hasta que tengamos la relación correcta
      newThisMonth: clients.filter((client) => new Date(client.created_at) >= startOfMonth).length,
    }

    console.log("[v0] Stats calculated:", stats)

    const transformedClients = clients.map((client) => {
      const profile = profiles.find((p) => p.id === client.user_id)
      const orderCount = serviceOrderCounts.filter((order) => order.client_id === client.user_id).length

      return {
        ...client,
        full_name: profile?.full_name || client.full_name || "Sin nombre",
        email: profile?.email || client.email || "Sin email",
        phone: profile?.phone || client.phone || "",
        _count: {
          service_orders: orderCount,
          equipments: 0, // Por ahora 0 hasta que tengamos la relación correcta
        },
      }
    })

    console.log("[v0] Transformed clients:", transformedClients.length)

    const userInfo = {
      id: user.id,
      email: user.email || "",
      name: profile.full_name || user.email || "",
      role: profile.role || "receptionist",
    }

    console.log("[v0] Rendering page with data")

    return (
      <RoleGuard allowedRoles={["receptionist", "admin"]}>
        <ReceptionistLayout userInfo={userInfo}>
          <ClientsClient clients={transformedClients} stats={stats} />
        </ReceptionistLayout>
      </RoleGuard>
    )
  } catch (error) {
    console.log("[v0] Error in ReceptionistClientsPage:", error)

    const userInfo = {
      id: user.id,
      email: user.email || "",
      name: profile.full_name || user.email || "",
      role: profile.role || "receptionist",
    }

    const emptyStats = {
      total: 0,
      active: 0,
      inactive: 0,
      withOrders: 0,
      withEquipments: 0,
      newThisMonth: 0,
    }

    return (
      <RoleGuard allowedRoles={["receptionist", "admin"]}>
        <ReceptionistLayout userInfo={userInfo}>
          <ClientsClient clients={[]} stats={emptyStats} />
        </ReceptionistLayout>
      </RoleGuard>
    )
  }
}
