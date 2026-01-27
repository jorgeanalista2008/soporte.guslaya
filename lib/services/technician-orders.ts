import { createClient } from "@/lib/supabase/server"

export interface TechnicianOrdersService {
  getAllOrders: () => Promise<any[]>
  getActiveOrders: (limit?: number) => Promise<any[]>
  getOrderById: (orderId: string) => Promise<any>
  updateOrderStatus: (orderId: string, status: string, notes?: string) => Promise<boolean>
}

export async function createTechnicianOrdersService(): Promise<TechnicianOrdersService | null> {
  const supabase = await createClient()

  if (!supabase) {
    return null
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  return {
    async getAllOrders() {
      console.log("[v0] Getting all orders for technician:", user.id)

      const { data, error } = await supabase
        .from("service_orders")
        .select(`
          *,
          client:clients(*),
          equipment:equipments(*)
        `)
        .eq("technician_id", user.id)
        .order("received_date", { ascending: false })

      if (error) {
        console.error("[v0] Error fetching orders:", error)
        return []
      }

      console.log("[v0] Found orders:", data?.length || 0)
      return data || []
    },

    async getActiveOrders(limit = 5) {
      console.log("[v0] Getting active orders for technician:", user.id)

      const { data, error } = await supabase
        .from("service_orders")
        .select(`
          *,
          client:clients(*),
          equipment:equipments(*)
        `)
        .eq("technician_id", user.id)
        .not("status", "in", '("completed","delivered","cancelled")')
        .order("received_date", { ascending: false })
        .limit(limit)

      if (error) {
        console.error("[v0] Error fetching active orders:", error)
        return []
      }

      console.log("[v0] Found active orders:", data?.length || 0)
      return data || []
    },

    async getOrderById(orderId: string) {
      console.log("[v0] Getting order by ID:", orderId)

      const { data, error } = await supabase
        .from("service_orders")
        .select(`
          *,
          client:clients(*),
          equipment:equipments(*)
        `)
        .eq("id", orderId)
        .eq("technician_id", user.id)
        .single()

      if (error) {
        console.error("[v0] Error fetching order:", error)
        return null
      }

      return data
    },

    async updateOrderStatus(orderId: string, status: string, notes?: string) {
      console.log("[v0] Updating order status:", orderId, status)

      const updateData: any = {
        status,
        updated_at: new Date().toISOString(),
      }

      if (status === "completed") {
        updateData.completed_date = new Date().toISOString()
      }

      if (notes) {
        updateData.technician_notes = notes
      }

      const { error } = await supabase
        .from("service_orders")
        .update(updateData)
        .eq("id", orderId)
        .eq("technician_id", user.id)

      if (error) {
        console.error("[v0] Error updating order:", error)
        return false
      }

      return true
    },
  }
}
