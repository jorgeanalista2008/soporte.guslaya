import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { ClientsPageClient } from "./clients-client"

export default async function AdminClientsPage() {
  const supabase = await createClient()

  if (!supabase) {
    console.error("Supabase client is not configured. Please check environment variables.")
    redirect("/auth/login")
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

  const { data: clients } = await supabase
    .from("profiles")
    .select(`
      *,
      clients(*)
    `)
    .eq("role", "client")
    .order("created_at", { ascending: false })

  const { data: serviceOrdersCount } = await supabase.from("service_orders").select("client_id")

  const ordersCountByClient =
    serviceOrdersCount?.reduce(
      (acc, order) => {
        acc[order.client_id] = (acc[order.client_id] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    ) || {}

  const clientsData =
    clients?.map((client) => ({
      id: client.id,
      user_id: client.id,
      full_name: client.full_name || "N/A",
      email: client.email || "N/A",
      phone: client.phone || undefined,
      company_name: client.clients?.[0]?.company_name || undefined,
      address: client.clients?.[0]?.address || undefined,
      city: client.clients?.[0]?.city || undefined,
      is_active: client.is_active,
      created_at: client.created_at,
      _count: {
        service_orders: ordersCountByClient[client.id] || 0,
      },
    })) || []

  const stats = {
    total: clientsData.length,
    active: clientsData.filter((client) => client.is_active).length,
    inactive: clientsData.filter((client) => !client.is_active).length,
    withOrders: clientsData.filter((client) => (client._count?.service_orders || 0) > 0).length,
    newThisMonth: clientsData.filter((client) => {
      const clientDate = new Date(client.created_at)
      const now = new Date()
      return clientDate.getMonth() === now.getMonth() && clientDate.getFullYear() === now.getFullYear()
    }).length,
  }

  return (
    <AdminLayout
      userInfo={{
        name: profile.full_name || "Usuario",
        email: profile.email || "",
        role: profile.role,
      }}
    >
      <ClientsPageClient clients={clientsData} stats={stats} />
    </AdminLayout>
  )
}
