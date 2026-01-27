import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { RoleGuard } from "@/components/auth/role-guard"
import TechnicianOrdersClient from "./orders-client"

export default async function TechnicianOrdersPage() {
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

  const { data: orders, error: ordersError } = await supabase
    .from("service_orders")
    .select(`
      *,
      client:profiles!service_orders_client_id_fkey(full_name, email, phone),
      technician:profiles!service_orders_technician_id_fkey(id, full_name, email),
      equipment:equipments(equipment_type, brand, model)
    `)
    .eq("technician_id", user.id)
    .order("received_date", { ascending: false })

  console.log("[DEBUG] User ID:", user.id)
  console.log("[DEBUG] Profile found:", profile)
  console.log("[DEBUG] Orders query error:", ordersError)
  console.log("[DEBUG] Orders found:", orders?.length || 0)
  console.log("[DEBUG] Sample order:", orders?.[0])

  return (
    <RoleGuard allowedRoles={["technician"]}>
      <TechnicianOrdersClient initialOrders={orders || []} profile={profile} />
    </RoleGuard>
  )
}
