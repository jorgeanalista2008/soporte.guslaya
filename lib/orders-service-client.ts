import { createClient } from "@/lib/supabase/client"

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
    commission_percentage: number | null
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
  const supabase = createClient()

  console.log("[v0] Fetching all orders with details...")

  const { data, error } = await supabase
    .from("service_orders")
    .select(`
      *,
      client:profiles!client_id(id, full_name, email, phone),
      technician:profiles!technician_id(id, full_name, email, commission_percentage),
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
  const supabase = createClient()

  console.log("[v0] Fetching orders statistics...")

  const { data: orders, error } = await supabase.from("service_orders").select("status, created_at")

  if (error) {
    console.error("[v0] Error fetching orders stats:", error)
    console.error("[v0] Stats error details:", JSON.stringify(error, null, 2))
    return {
      totalOrders: 0,
      receivedOrders: 0,
      diagnosisOrders: 0,
      waitingPartsOrders: 0,
      repairOrders: 0,
      testingOrders: 0,
      completedOrders: 0,
      deliveredOrders: 0,
    }
  }

  console.log(`[v0] Raw orders data for stats:`, orders)
  const totalOrders = orders?.length || 0

  const receivedOrders = orders?.filter((o) => o.status === "received").length || 0
  const diagnosisOrders = orders?.filter((o) => o.status === "diagnosis").length || 0
  const waitingPartsOrders = orders?.filter((o) => o.status === "waiting_parts").length || 0
  const repairOrders = orders?.filter((o) => o.status === "repair").length || 0
  const testingOrders = orders?.filter((o) => o.status === "testing").length || 0
  const completedOrders = orders?.filter((o) => o.status === "completed").length || 0
  const deliveredOrders = orders?.filter((o) => o.status === "delivered").length || 0

  console.log(`[v0] Orders stats - Total: ${totalOrders}`)
  console.log(
    `[v0] Status breakdown - Received: ${receivedOrders}, Diagnosis: ${diagnosisOrders}, Waiting Parts: ${waitingPartsOrders}, Repair: ${repairOrders}, Testing: ${testingOrders}, Completed: ${completedOrders}, Delivered: ${deliveredOrders}`,
  )

  return {
    totalOrders,
    receivedOrders,
    diagnosisOrders,
    waitingPartsOrders,
    repairOrders,
    testingOrders,
    completedOrders,
    deliveredOrders,
  }
}
