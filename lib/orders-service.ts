import { createClient } from "@/lib/supabase/server"

export interface OrderWithDetails {
  id: string
  order_number: string
  description: string
  problem_description: string
  device_condition: string
  status: string
  priority: string
  total_amount: number | null
  created_at: string
  updated_at: string
  client: {
    id: string
    full_name: string
    email: string
    phone: string | null
  } | null
  technician: {
    id: string
    full_name: string
    email: string
  } | null
  receptionist: {
    id: string
    full_name: string
    email: string
  } | null
  equipment: {
    id: string
    equipment_type: string
    brand: string
    model: string
  } | null
}

export async function fetchAllOrders(): Promise<OrderWithDetails[]> {
  const supabase = await createClient()

  console.log("[v0] Fetching all orders with details...")

  const { data, error } = await supabase
    .from("service_orders")
    .select(`
      *,
      client:profiles!client_id(id, full_name, email, phone),
      technician:profiles!technician_id(id, full_name, email),
      receptionist:profiles!receptionist_id(id, full_name, email),
      equipment:equipments!equipment_id(id, equipment_type, brand, model)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching orders:", error)
    console.error("[v0] Error details:", JSON.stringify(error, null, 2))
    return []
  }

  console.log(`[v0] Successfully fetched ${data?.length || 0} orders`)
  console.log("[v0] Sample order data:", data?.[0] ? JSON.stringify(data[0], null, 2) : "No orders found")
  return data || []
}

export async function fetchOrdersStats() {
  const supabase = await createClient()

  console.log("[v0] Fetching orders statistics...")

  const { data: simpleOrders, error: simpleError } = await supabase.from("service_orders").select("*")

  console.log("[v0] Simple query result:", simpleOrders?.length || 0, "orders found")
  console.log("[v0] Simple query error:", simpleError)

  if (simpleOrders && simpleOrders.length > 0) {
    console.log("[v0] Sample raw order:", JSON.stringify(simpleOrders[0], null, 2))
  }

  const { data: orders, error } = await supabase.from("service_orders").select("status, created_at")

  if (error) {
    console.error("[v0] Error fetching orders stats:", error)
    console.error("[v0] Stats error details:", JSON.stringify(error, null, 2))
    return {
      totalOrders: 0,
      activeOrders: 0,
      pendingOrders: 0,
      inProgressOrders: 0,
      completedOrders: 0,
      deliveredOrders: 0,
    }
  }

  console.log(`[v0] Raw orders data for stats:`, orders)
  const totalOrders = orders?.length || 0
  const activeOrders = orders?.filter((o) => !["completed", "delivered", "cancelled"].includes(o.status)).length || 0
  const pendingOrders = orders?.filter((o) => o.status === "pending").length || 0
  const inProgressOrders = orders?.filter((o) => o.status === "in_progress").length || 0
  const completedOrders = orders?.filter((o) => o.status === "completed").length || 0
  const deliveredOrders = orders?.filter((o) => o.status === "delivered").length || 0

  console.log(`[v0] Orders stats - Total: ${totalOrders}, Active: ${activeOrders}`)

  return {
    totalOrders,
    activeOrders,
    pendingOrders,
    inProgressOrders,
    completedOrders,
    deliveredOrders,
  }
}

export async function fetchRecentOrders(limit = 10): Promise<OrderWithDetails[]> {
  const supabase = await createClient()

  console.log(`[v0] Fetching ${limit} recent orders...`)

  const { data: simpleData, error: simpleError } = await supabase
    .from("service_orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)

  console.log("[v0] Simple recent orders query:", simpleData?.length || 0, "orders found")
  console.log("[v0] Simple recent orders error:", simpleError)

  const { data, error } = await supabase
    .from("service_orders")
    .select(`
      *,
      client:profiles!client_id(id, full_name, email, phone),
      technician:profiles!technician_id(id, full_name, email),
      equipment:equipments!equipment_id(id, equipment_type, brand, model)
    `)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("[v0] Error fetching recent orders:", error)
    console.error("[v0] Recent orders error details:", JSON.stringify(error, null, 2))

    if (simpleData && simpleData.length > 0) {
      console.log("[v0] Returning simple data without joins")
      return simpleData.map((order) => ({
        ...order,
        description: order.problem_description || "",
        total_amount: order.final_cost || order.estimated_cost || null,
        client: null,
        technician: null,
        receptionist: null,
        equipment: null,
      }))
    }

    return []
  }

  console.log(`[v0] Successfully fetched ${data?.length || 0} recent orders`)
  return data || []
}
