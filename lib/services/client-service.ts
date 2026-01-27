import type { SupabaseClient } from "@supabase/supabase-js"

export interface ClientStats {
  totalOrders: number
  activeOrders: number
  completedOrders: number
  totalSpent: number
  averageResponseTime: number
  pendingPayments: number
  lastServiceDate?: string
  nextAppointment?: string
}

export interface ClientOrder {
  id: string
  order_number: string
  equipment_type: string
  brand?: string
  model?: string
  problem_description: string
  diagnosis?: string
  solution?: string
  status: string
  priority: string
  received_date: string
  estimated_completion?: string
  completed_date?: string
  delivered_date?: string
  estimated_cost?: number
  final_cost?: number
  advance_payment?: number
  technician_name?: string
  warranty_days?: number
  client_notes?: string
}

export interface ClientEquipment {
  id: string
  equipment_type: string
  brand: string
  model: string
  serial_number?: string
  purchase_date?: string
  warranty_expiry?: string
  status: string
  last_service_date?: string
  service_count: number
}

export interface ClientProfile {
  id: string
  full_name: string
  email: string
  phone?: string
  company_name?: string
  address?: string
  city?: string
  postal_code?: string
  tax_id?: string
  notes?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ServiceRequest {
  equipment_id?: string
  equipment_type: string
  brand?: string
  model?: string
  serial_number?: string
  problem_description: string
  priority: "low" | "medium" | "high" | "urgent"
  accessories?: string
  device_condition?: string
  client_notes?: string
}

export interface ClientService {
  // Dashboard and stats
  getDashboardStats: () => Promise<ClientStats>

  // Orders management
  getMyOrders: (limit?: number) => Promise<ClientOrder[]>
  getOrderById: (orderId: string) => Promise<ClientOrder | null>
  getOrdersByStatus: (status: string) => Promise<ClientOrder[]>
  createServiceRequest: (requestData: ServiceRequest) => Promise<{ success: boolean; orderId?: string; error?: string }>

  // Equipment management
  getMyEquipments: () => Promise<ClientEquipment[]>
  getEquipmentById: (equipmentId: string) => Promise<ClientEquipment | null>
  addEquipment: (equipmentData: any) => Promise<{ success: boolean; equipmentId?: string; error?: string }>
  updateEquipment: (equipmentId: string, equipmentData: any) => Promise<{ success: boolean; error?: string }>

  // Profile management
  getProfile: () => Promise<ClientProfile | null>
  updateProfile: (profileData: Partial<ClientProfile>) => Promise<{ success: boolean; error?: string }>

  // Service history
  getServiceHistory: () => Promise<ClientOrder[]>
  rateService: (orderId: string, rating: number, feedback?: string) => Promise<{ success: boolean; error?: string }>
}

export async function createClientService(supabase: SupabaseClient): Promise<ClientService | null> {
  if (!supabase) {
    console.error("[client-service] Supabase client not available")
    return null
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    console.error("[client-service] User not authenticated")
    return null
  }

  console.log("[client-service] Service initialized for user:", user.id)

  return {
    // Dashboard stats implementation
    getDashboardStats: async (): Promise<ClientStats> => {
      try {
        console.log("[client-service] Fetching dashboard stats...")

        const { data: orders, error } = await supabase
          .from("service_orders")
          .select("status, final_cost, advance_payment, received_date, completed_date")
          .eq("client_id", user.id)

        if (error) {
          console.error("[client-service] Error fetching orders for stats:", error)
          return {
            totalOrders: 0,
            activeOrders: 0,
            completedOrders: 0,
            totalSpent: 0,
            averageResponseTime: 0,
            pendingPayments: 0,
          }
        }

        if (!orders) {
          return {
            totalOrders: 0,
            activeOrders: 0,
            completedOrders: 0,
            totalSpent: 0,
            averageResponseTime: 0,
            pendingPayments: 0,
          }
        }

        const totalOrders = orders.length
        const activeOrders = orders.filter((o) => !["completed", "delivered", "cancelled"].includes(o.status)).length
        const completedOrders = orders.filter((o) => ["completed", "delivered"].includes(o.status)).length

        // Calculate total spent (final costs of completed orders)
        const totalSpent = orders
          .filter((o) => ["completed", "delivered"].includes(o.status) && o.final_cost)
          .reduce((sum, o) => sum + (o.final_cost || 0), 0)

        // Calculate pending payments (orders with balance due)
        const pendingPayments = orders
          .filter((o) => o.final_cost && o.advance_payment && o.final_cost > o.advance_payment)
          .reduce((sum, o) => sum + ((o.final_cost || 0) - (o.advance_payment || 0)), 0)

        // Calculate average response time (from received to completed)
        const completedOrdersWithDates = orders.filter(
          (o) => o.completed_date && o.received_date && ["completed", "delivered"].includes(o.status),
        )

        let averageResponseTime = 0
        if (completedOrdersWithDates.length > 0) {
          const totalResponseTime = completedOrdersWithDates.reduce((sum, o) => {
            const received = new Date(o.received_date).getTime()
            const completed = new Date(o.completed_date!).getTime()
            return sum + (completed - received)
          }, 0)
          averageResponseTime = Math.round(totalResponseTime / completedOrdersWithDates.length / (1000 * 60 * 60 * 24)) // days
        }

        // Get last service date
        const lastServiceDate = orders
          .filter((o) => o.completed_date)
          .sort(
            (a, b) => new Date(b.completed_date!).getTime() - new Date(a.completed_date!).getTime(),
          )[0]?.completed_date

        console.log("[client-service] Dashboard stats calculated successfully")

        return {
          totalOrders,
          activeOrders,
          completedOrders,
          totalSpent,
          averageResponseTime,
          pendingPayments,
          lastServiceDate,
        }
      } catch (error) {
        console.error("[client-service] Error fetching dashboard stats:", error)
        return {
          totalOrders: 0,
          activeOrders: 0,
          completedOrders: 0,
          totalSpent: 0,
          averageResponseTime: 0,
          pendingPayments: 0,
        }
      }
    },

    // Get client's orders
    getMyOrders: async (limit?: number): Promise<ClientOrder[]> => {
      try {
        console.log(`[client-service] Fetching orders for client ${user.id}`)

        let query = supabase
          .from("service_orders")
          .select(`
            *,
            technician:profiles!technician_id(full_name),
            equipment:equipments!equipment_id(equipment_type, brand, model)
          `)
          .eq("client_id", user.id)
          .order("created_at", { ascending: false })

        if (limit) {
          query = query.limit(limit)
        }

        const { data, error } = await query

        if (error) {
          console.error("[client-service] Error fetching orders:", error)
          return []
        }

        const orders: ClientOrder[] =
          data?.map((order) => ({
            id: order.id,
            order_number: order.order_number,
            equipment_type: order.equipment?.equipment_type || "Equipo",
            brand: order.equipment?.brand,
            model: order.equipment?.model,
            problem_description: order.problem_description,
            diagnosis: order.diagnosis,
            solution: order.solution,
            status: order.status,
            priority: order.priority,
            received_date: order.received_date,
            estimated_completion: order.estimated_completion,
            completed_date: order.completed_date,
            delivered_date: order.delivered_date,
            estimated_cost: order.estimated_cost,
            final_cost: order.final_cost,
            advance_payment: order.advance_payment,
            technician_name: order.technician?.full_name,
            warranty_days: order.warranty_days,
            client_notes: order.client_notes,
          })) || []

        console.log(`[client-service] Fetched ${orders.length} orders`)
        return orders
      } catch (error) {
        console.error("[client-service] Error in getMyOrders:", error)
        return []
      }
    },

    // Get order by ID
    getOrderById: async (orderId: string): Promise<ClientOrder | null> => {
      try {
        console.log(`[client-service] Fetching order ${orderId}`)

        const { data, error } = await supabase
          .from("service_orders")
          .select(`
            *,
            technician:profiles!technician_id(full_name),
            equipment:equipments!equipment_id(equipment_type, brand, model)
          `)
          .eq("id", orderId)
          .eq("client_id", user.id) // Ensure client can only access their own orders
          .single()

        if (error || !data) {
          console.error("[client-service] Error fetching order:", error)
          return null
        }

        return {
          id: data.id,
          order_number: data.order_number,
          equipment_type: data.equipment?.equipment_type || "Equipo",
          brand: data.equipment?.brand,
          model: data.equipment?.model,
          problem_description: data.problem_description,
          diagnosis: data.diagnosis,
          solution: data.solution,
          status: data.status,
          priority: data.priority,
          received_date: data.received_date,
          estimated_completion: data.estimated_completion,
          completed_date: data.completed_date,
          delivered_date: data.delivered_date,
          estimated_cost: data.estimated_cost,
          final_cost: data.final_cost,
          advance_payment: data.advance_payment,
          technician_name: data.technician?.full_name,
          warranty_days: data.warranty_days,
          client_notes: data.client_notes,
        }
      } catch (error) {
        console.error("[client-service] Error in getOrderById:", error)
        return null
      }
    },

    // Get orders by status
    getOrdersByStatus: async (status: string): Promise<ClientOrder[]> => {
      try {
        console.log(`[client-service] Fetching orders with status: ${status}`)

        const { data, error } = await supabase
          .from("service_orders")
          .select(`
            *,
            technician:profiles!technician_id(full_name),
            equipment:equipments!equipment_id(equipment_type, brand, model)
          `)
          .eq("client_id", user.id)
          .eq("status", status)
          .order("created_at", { ascending: false })

        if (error) {
          console.error("[client-service] Error fetching orders by status:", error)
          return []
        }

        const orders: ClientOrder[] =
          data?.map((order) => ({
            id: order.id,
            order_number: order.order_number,
            equipment_type: order.equipment?.equipment_type || "Equipo",
            brand: order.equipment?.brand,
            model: order.equipment?.model,
            problem_description: order.problem_description,
            diagnosis: order.diagnosis,
            solution: order.solution,
            status: order.status,
            priority: order.priority,
            received_date: order.received_date,
            estimated_completion: order.estimated_completion,
            completed_date: order.completed_date,
            delivered_date: order.delivered_date,
            estimated_cost: order.estimated_cost,
            final_cost: order.final_cost,
            advance_payment: order.advance_payment,
            technician_name: order.technician?.full_name,
            warranty_days: order.warranty_days,
            client_notes: order.client_notes,
          })) || []

        console.log(`[client-service] Fetched ${orders.length} orders with status ${status}`)
        return orders
      } catch (error) {
        console.error("[client-service] Error in getOrdersByStatus:", error)
        return []
      }
    },

    // Create service request
    createServiceRequest: async (requestData: ServiceRequest) => {
      try {
        console.log("[v0] Creating service request:", requestData)

        // Generate order number
        const orderNumber = `ORD-${Date.now()}`

        // First, create or find equipment
        let equipmentId = requestData.equipment_id

        if (!equipmentId) {
          if (requestData.serial_number) {
            console.log("[v0] Checking for existing equipment with serial:", requestData.serial_number)

            const { data: existing, error: checkError } = await supabase
              .from("equipments")
              .select("id, client_id")
              .eq("serial_number", requestData.serial_number)
              .maybeSingle()

            if (checkError) {
              console.error("[v0] Error checking existing equipment:", checkError)
            }

            if (existing) {
              console.log("[v0] Found existing equipment:", existing)
              // If equipment exists and belongs to this client, use it
              if (existing.client_id === user.id) {
                equipmentId = existing.id
                console.log("[v0] Using existing equipment:", equipmentId)
              } else {
                // Serial number belongs to another client, generate a unique one
                const timestamp = Date.now()
                const randomSuffix = Math.floor(Math.random() * 1000)
                requestData.serial_number = `${requestData.serial_number}-${timestamp}-${randomSuffix}`
                console.log("[v0] Serial exists for another client, using new serial:", requestData.serial_number)
              }
            }
          }

          if (!equipmentId) {
            if (!requestData.serial_number) {
              const timestamp = Date.now()
              const randomSuffix = Math.floor(Math.random() * 1000)
              const equipmentType = requestData.equipment_type.substring(0, 3).toUpperCase()
              requestData.serial_number = `${equipmentType}-${timestamp}-${randomSuffix}`
              console.log("[v0] Generated new serial number:", requestData.serial_number)
            }

            console.log("[v0] Creating new equipment with data:", {
              client_id: user.id,
              equipment_type: requestData.equipment_type,
              brand: requestData.brand || "Sin especificar",
              model: requestData.model || "Sin especificar",
              serial_number: requestData.serial_number,
              status: "active",
            })

            const { data: equipment, error: equipmentError } = await supabase
              .from("equipments")
              .insert([
                {
                  client_id: user.id,
                  assigned_to: user.id, // Also set assigned_to for compatibility
                  equipment_type: requestData.equipment_type,
                  brand: requestData.brand || "Sin especificar",
                  model: requestData.model || "Sin especificar",
                  serial_number: requestData.serial_number,
                  status: "active",
                },
              ])
              .select()
              .single()

            if (equipmentError) {
              console.error("[v0] Error creating equipment:", equipmentError)
              return { success: false, error: `Error al registrar el equipo: ${equipmentError.message}` }
            }

            equipmentId = equipment.id
            console.log("[v0] Equipment created successfully:", equipmentId)
          }
        }

        console.log("[v0] About to create service order with:")
        console.log("[v0] - user.id (auth.uid()):", user.id)
        console.log("[v0] - client_id will be set to:", user.id)
        console.log("[v0] - equipmentId:", equipmentId)

        // Check if user profile exists and has correct role
        const { data: profileCheck, error: profileError } = await supabase
          .from("profiles")
          .select("id, role")
          .eq("id", user.id)
          .single()

        console.log("[v0] Profile check result:", profileCheck)
        console.log("[v0] Profile check error:", profileError)

        // Create service order
        const serviceOrderData = {
          order_number: orderNumber,
          client_id: user.id,
          equipment_id: equipmentId,
          problem_description: requestData.problem_description,
          priority: requestData.priority,
          device_condition: requestData.device_condition,
          accessories: requestData.accessories,
          client_notes: requestData.client_notes,
          status: "received",
          received_date: new Date().toISOString(),
        }

        console.log("[v0] Service order data to insert:", serviceOrderData)

        const { data: order, error: orderError } = await supabase
          .from("service_orders")
          .insert([serviceOrderData])
          .select()
          .single()

        if (orderError) {
          console.error("[v0] Error creating order:", orderError)
          console.error("[v0] Full error details:", JSON.stringify(orderError, null, 2))
          return { success: false, error: "Error al crear la solicitud de servicio" }
        }

        console.log("[v0] Service request created successfully:", order.id)
        return { success: true, orderId: order.id }
      } catch (error) {
        console.error("[v0] Error in createServiceRequest:", error)
        return { success: false, error: "Error inesperado al crear la solicitud" }
      }
    },

    // Get client's equipments
    getMyEquipments: async (): Promise<ClientEquipment[]> => {
      try {
        console.log(`[client-service] Fetching equipments for client ${user.id}`)

        const { data, error } = await supabase
          .from("equipments")
          .select("*")
          .eq("client_id", user.id)
          .order("created_at", { ascending: false })

        if (error) {
          console.error("[client-service] Error fetching equipments:", error)
          return []
        }

        // Get service counts for each equipment
        const { data: serviceCounts } = await supabase
          .from("service_orders")
          .select("equipment_id")
          .eq("client_id", user.id)

        const serviceCountMap =
          serviceCounts?.reduce(
            (acc, order) => {
              acc[order.equipment_id] = (acc[order.equipment_id] || 0) + 1
              return acc
            },
            {} as Record<string, number>,
          ) || {}

        const equipments: ClientEquipment[] =
          data?.map((equipment) => ({
            id: equipment.id,
            equipment_type: equipment.equipment_type,
            brand: equipment.brand,
            model: equipment.model,
            serial_number: equipment.serial_number,
            purchase_date: equipment.purchase_date,
            warranty_expiry: equipment.warranty_expiry,
            status: equipment.status,
            last_service_date: equipment.last_service_date,
            service_count: serviceCountMap[equipment.id] || 0,
          })) || []

        console.log(`[client-service] Fetched ${equipments.length} equipments`)
        return equipments
      } catch (error) {
        console.error("[client-service] Error in getMyEquipments:", error)
        return []
      }
    },

    // Get equipment by ID
    getEquipmentById: async (equipmentId: string): Promise<ClientEquipment | null> => {
      try {
        console.log(`[client-service] Fetching equipment ${equipmentId}`)

        const { data, error } = await supabase
          .from("equipments")
          .select("*")
          .eq("id", equipmentId)
          .eq("client_id", user.id) // Ensure client can only access their own equipment
          .single()

        if (error || !data) {
          console.error("[client-service] Error fetching equipment:", error)
          return null
        }

        // Get service count for this equipment
        const { data: services } = await supabase.from("service_orders").select("id").eq("equipment_id", equipmentId)

        return {
          id: data.id,
          equipment_type: data.equipment_type,
          brand: data.brand,
          model: data.model,
          serial_number: data.serial_number,
          purchase_date: data.purchase_date,
          warranty_expiry: data.warranty_expiry,
          status: data.status,
          last_service_date: data.last_service_date,
          service_count: services?.length || 0,
        }
      } catch (error) {
        console.error("[client-service] Error in getEquipmentById:", error)
        return null
      }
    },

    // Add equipment
    addEquipment: async (equipmentData: any) => {
      try {
        console.log("[client-service] Adding equipment:", equipmentData)

        const { data, error } = await supabase
          .from("equipments")
          .insert([
            {
              ...equipmentData,
              client_id: user.id,
              assigned_to: user.id, // Also set assigned_to for compatibility
              status: "active",
            },
          ])
          .select()
          .single()

        if (error) {
          console.error("[client-service] Error adding equipment:", error)
          return { success: false, error: error.message }
        }

        console.log("[client-service] Equipment added successfully:", data.id)
        return { success: true, equipmentId: data.id }
      } catch (error) {
        console.error("[client-service] Error in addEquipment:", error)
        return { success: false, error: "Error inesperado al agregar el equipo" }
      }
    },

    // Update equipment
    updateEquipment: async (equipmentId: string, equipmentData: any) => {
      try {
        console.log(`[client-service] Updating equipment ${equipmentId}:`, equipmentData)

        const { error } = await supabase
          .from("equipments")
          .update({
            ...equipmentData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", equipmentId)
          .eq("client_id", user.id) // Ensure client can only update their own equipment

        if (error) {
          console.error("[client-service] Error updating equipment:", error)
          return { success: false, error: error.message }
        }

        console.log("[client-service] Equipment updated successfully")
        return { success: true }
      } catch (error) {
        console.error("[client-service] Error in updateEquipment:", error)
        return { success: false, error: "Error inesperado al actualizar el equipo" }
      }
    },

    // Get profile
    getProfile: async (): Promise<ClientProfile | null> => {
      try {
        console.log(`[client-service] Fetching profile for user ${user.id}`)

        const { data: profile, error } = await supabase
          .from("profiles")
          .select(`
            *,
            clients(*)
          `)
          .eq("id", user.id)
          .single()

        if (error || !profile) {
          console.error("[client-service] Error fetching profile:", error)
          return null
        }

        const clientInfo = profile.clients?.[0]

        return {
          id: profile.id,
          full_name: profile.full_name,
          email: profile.email,
          phone: profile.phone,
          company_name: clientInfo?.company_name,
          address: clientInfo?.address,
          city: clientInfo?.city,
          postal_code: clientInfo?.postal_code,
          tax_id: clientInfo?.tax_id,
          notes: clientInfo?.notes,
          is_active: profile.is_active,
          created_at: profile.created_at,
          updated_at: profile.updated_at,
        }
      } catch (error) {
        console.error("[client-service] Error in getProfile:", error)
        return null
      }
    },

    // Update profile
    updateProfile: async (profileData: Partial<ClientProfile>) => {
      try {
        console.log("[client-service] Updating profile:", profileData)

        // Update profile table
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            full_name: profileData.full_name,
            phone: profileData.phone,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id)

        if (profileError) {
          console.error("[client-service] Error updating profile:", profileError)
          return { success: false, error: profileError.message }
        }

        // Update or create client details
        if (
          profileData.company_name ||
          profileData.address ||
          profileData.city ||
          profileData.postal_code ||
          profileData.tax_id
        ) {
          const { error: clientError } = await supabase.from("clients").upsert([
            {
              user_id: user.id,
              company_name: profileData.company_name,
              address: profileData.address,
              city: profileData.city,
              postal_code: profileData.postal_code,
              tax_id: profileData.tax_id,
              notes: profileData.notes,
            },
          ])

          if (clientError) {
            console.error("[client-service] Error updating client details:", clientError)
            return { success: false, error: "Error al actualizar información adicional" }
          }
        }

        console.log("[client-service] Profile updated successfully")
        return { success: true }
      } catch (error) {
        console.error("[client-service] Error in updateProfile:", error)
        return { success: false, error: "Error inesperado al actualizar el perfil" }
      }
    },

    // Get service history
    getServiceHistory: async (): Promise<ClientOrder[]> => {
      try {
        console.log(`[client-service] Fetching service history for client ${user.id}`)

        const { data, error } = await supabase
          .from("service_orders")
          .select(`
            *,
            technician:profiles!technician_id(full_name),
            equipment:equipments!equipment_id(equipment_type, brand, model)
          `)
          .eq("client_id", user.id)
          .in("status", ["completed", "delivered"])
          .order("completed_date", { ascending: false })

        if (error) {
          console.error("[client-service] Error fetching service history:", error)
          return []
        }

        const history: ClientOrder[] =
          data?.map((order) => ({
            id: order.id,
            order_number: order.order_number,
            equipment_type: order.equipment?.equipment_type || "Equipo",
            brand: order.equipment?.brand,
            model: order.equipment?.model,
            problem_description: order.problem_description,
            diagnosis: order.diagnosis,
            solution: order.solution,
            status: order.status,
            priority: order.priority,
            received_date: order.received_date,
            estimated_completion: order.estimated_completion,
            completed_date: order.completed_date,
            delivered_date: order.delivered_date,
            estimated_cost: order.estimated_cost,
            final_cost: order.final_cost,
            advance_payment: order.advance_payment,
            technician_name: order.technician?.full_name,
            warranty_days: order.warranty_days,
            client_notes: order.client_notes,
          })) || []

        console.log(`[client-service] Fetched ${history.length} completed services`)
        return history
      } catch (error) {
        console.error("[client-service] Error in getServiceHistory:", error)
        return []
      }
    },

    // Rate service
    rateService: async (orderId: string, rating: number, feedback?: string) => {
      try {
        console.log(`[client-service] Rating service ${orderId}: ${rating} stars`)

        // In a real implementation, this would update a ratings table
        // For now, we'll add the rating to the order's client_notes
        const { error } = await supabase
          .from("service_orders")
          .update({
            client_notes: feedback ? `Calificación: ${rating}/5 - ${feedback}` : `Calificación: ${rating}/5`,
            updated_at: new Date().toISOString(),
          })
          .eq("id", orderId)
          .eq("client_id", user.id) // Ensure client can only rate their own orders

        if (error) {
          console.error("[client-service] Error rating service:", error)
          return { success: false, error: error.message }
        }

        console.log("[client-service] Service rated successfully")
        return { success: true }
      } catch (error) {
        console.error("[client-service] Error in rateService:", error)
        return { success: false, error: "Error inesperado al calificar el servicio" }
      }
    },
  }
}

// Utility functions for external use
export async function getClientStats(supabase: SupabaseClient) {
  const service = await createClientService(supabase)
  if (!service) return null
  return service.getDashboardStats()
}

export async function getClientOrders(supabase: SupabaseClient, limit?: number) {
  const service = await createClientService(supabase)
  if (!service) return []
  return service.getMyOrders(limit)
}

export async function getClientEquipments(supabase: SupabaseClient) {
  const service = await createClientService(supabase)
  if (!service) return []
  return service.getMyEquipments()
}

export async function getClientProfile(supabase: SupabaseClient) {
  const service = await createClientService(supabase)
  if (!service) return null
  return service.getProfile()
}

export async function createServiceRequest(supabase: SupabaseClient, requestData: ServiceRequest) {
  const service = await createClientService(supabase)
  if (!service) return { success: false, error: "Service not available" }
  return service.createServiceRequest(requestData)
}
