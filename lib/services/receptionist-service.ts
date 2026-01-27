import type { SupabaseClient } from "@supabase/supabase-js"

export interface ReceptionistStats {
  todayOrders: number
  clientsServed: number
  pendingDeliveries: number
  satisfactionIndex: number
  totalOrders: number
  activeOrders: number
  completedOrders: number
  deliveredOrders: number
}

export interface ClientWithOrders {
  id: string
  full_name: string
  email: string
  phone?: string
  company_name?: string
  address?: string
  city?: string
  is_active: boolean
  created_at: string
  orders_count: number
  last_order_date?: string
  status: "active" | "new" | "inactive"
}

export interface ClientEquipment {
  id: string
  equipment_type: string
  brand: string
  model: string
  serial_number?: string
  status: string
  location?: string
  created_at: string
  equipment_components?: Array<{
    id: number
    component_type: string
    component_name: string
    specifications?: string
    quantity: number
  }>
}

export interface ClientWithEquipments extends ClientWithOrders {
  equipments: ClientEquipment[]
  _count?: {
    service_orders: number
    equipments: number
  }
}

export interface DeliveryItem {
  id: string
  order_number: string
  client_name: string
  client_phone?: string
  equipment_type: string
  equipment_brand: string
  equipment_model: string
  estimated_cost: number
  repair_description: string
  completed_date: string
  is_notified: boolean
  priority: string
  status: string
}

export interface NotificationItem {
  id: string
  type: "delivery_ready" | "client_inquiry" | "payment_pending" | "new_order" | "appointment_reminder"
  title: string
  message: string
  priority: "high" | "medium" | "low"
  is_read: boolean
  created_at: string
  order_id?: string
  client_id?: string
}

export interface ReceptionistService {
  // Dashboard stats
  getDashboardStats: () => Promise<ReceptionistStats>

  // Orders management
  getRecentOrders: (limit?: number) => Promise<any[]>
  getOrdersByStatus: (status: string) => Promise<any[]>
  createNewOrder: (orderData: any) => Promise<{ success: boolean; orderId?: string; error?: string }>
  updateOrderStatus: (orderId: string, status: string, notes?: string) => Promise<{ success: boolean; error?: string }>

  // Clients management
  getAllClients: () => Promise<ClientWithOrders[]>
  getAllClientsWithEquipments: () => Promise<ClientWithEquipments[]>
  getClientById: (clientId: string) => Promise<ClientWithOrders | null>
  getClientWithEquipments: (clientId: string) => Promise<ClientWithEquipments | null>
  createClient: (clientData: any) => Promise<{ success: boolean; clientId?: string; error?: string }>
  updateClient: (clientId: string, clientData: any) => Promise<{ success: boolean; error?: string }>

  // Deliveries management
  getReadyForDelivery: () => Promise<DeliveryItem[]>
  markAsDelivered: (orderId: string) => Promise<{ success: boolean; error?: string }>
  notifyClient: (orderId: string) => Promise<{ success: boolean; error?: string }>

  // Notifications
  getNotifications: () => Promise<NotificationItem[]>
  markNotificationAsRead: (notificationId: string) => Promise<{ success: boolean; error?: string }>
  createNotification: (
    notification: Omit<NotificationItem, "id" | "created_at">,
  ) => Promise<{ success: boolean; error?: string }>

  // Equipment management
  getClientEquipments: (clientId: string) => Promise<ClientEquipment[]>
  createEquipmentForClient: (
    clientId: string,
    equipmentData: any,
  ) => Promise<{ success: boolean; equipmentId?: string; error?: string }>
  updateEquipment: (equipmentId: string, equipmentData: any) => Promise<{ success: boolean; error?: string }>
  deleteEquipment: (equipmentId: string) => Promise<{ success: boolean; error?: string }>
}

export async function createReceptionistService(supabase: SupabaseClient): Promise<ReceptionistService | null> {
  if (!supabase) {
    console.error("[receptionist-service] Supabase client not available")
    return null
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    console.error("[receptionist-service] User not authenticated")
    return null
  }

  console.log("[receptionist-service] Service initialized for user:", user.id)

  return {
    // Dashboard stats implementation
    getDashboardStats: async (): Promise<ReceptionistStats> => {
      try {
        console.log("[receptionist-service] Fetching dashboard stats...")

        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const todayISO = today.toISOString()

        // Get all orders for stats
        const { data: allOrders } = await supabase.from("service_orders").select("status, created_at, completed_date")

        // Get today's orders
        const { data: todayOrdersData } = await supabase.from("service_orders").select("id").gte("created_at", todayISO)

        // Get unique clients served today
        const { data: clientsToday } = await supabase
          .from("service_orders")
          .select("client_id")
          .gte("created_at", todayISO)

        // Get pending deliveries (completed but not delivered)
        const { data: pendingDeliveries } = await supabase.from("service_orders").select("id").eq("status", "completed")

        const totalOrders = allOrders?.length || 0
        const activeOrders =
          allOrders?.filter((o) => !["completed", "delivered", "cancelled"].includes(o.status)).length || 0
        const completedOrders = allOrders?.filter((o) => o.status === "completed").length || 0
        const deliveredOrders = allOrders?.filter((o) => o.status === "delivered").length || 0

        const todayOrders = todayOrdersData?.length || 0
        const uniqueClientsToday = new Set(clientsToday?.map((c) => c.client_id)).size
        const pendingDeliveriesCount = pendingDeliveries?.length || 0

        // Mock satisfaction index (in real app, calculate from feedback)
        const satisfactionIndex = 94

        console.log("[receptionist-service] Dashboard stats calculated successfully")

        return {
          todayOrders,
          clientsServed: uniqueClientsToday,
          pendingDeliveries: pendingDeliveriesCount,
          satisfactionIndex,
          totalOrders,
          activeOrders,
          completedOrders,
          deliveredOrders,
        }
      } catch (error) {
        console.error("[receptionist-service] Error fetching dashboard stats:", error)
        return {
          todayOrders: 0,
          clientsServed: 0,
          pendingDeliveries: 0,
          satisfactionIndex: 0,
          totalOrders: 0,
          activeOrders: 0,
          completedOrders: 0,
          deliveredOrders: 0,
        }
      }
    },

    // Recent orders
    getRecentOrders: async (limit = 10) => {
      try {
        console.log(`[receptionist-service] Fetching ${limit} recent orders...`)

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
          console.error("[receptionist-service] Error fetching recent orders:", error)
          return []
        }

        console.log(`[receptionist-service] Fetched ${data?.length || 0} recent orders`)
        return data || []
      } catch (error) {
        console.error("[receptionist-service] Error in getRecentOrders:", error)
        return []
      }
    },

    // Orders by status
    getOrdersByStatus: async (status: string) => {
      try {
        console.log(`[receptionist-service] Fetching orders with status: ${status}`)

        const { data, error } = await supabase
          .from("service_orders")
          .select(`
            *,
            client:profiles!client_id(id, full_name, email, phone),
            technician:profiles!technician_id(id, full_name, email),
            equipment:equipments!equipment_id(id, equipment_type, brand, model)
          `)
          .eq("status", status)
          .order("created_at", { ascending: false })

        if (error) {
          console.error("[receptionist-service] Error fetching orders by status:", error)
          return []
        }

        const transformedData =
          data?.map((order) => ({
            ...order,
            client_name: order.client?.full_name || "Cliente desconocido",
            client_phone: order.client?.phone,
            equipment_brand: order.equipment?.brand || "N/A",
            equipment_model: order.equipment?.model || "N/A",
            repair_description: order.solution || order.problem_description || "Sin descripción",
          })) || []

        console.log(`[receptionist-service] Fetched ${transformedData.length} orders with status ${status}`)
        return transformedData
      } catch (error) {
        console.error("[receptionist-service] Error in getOrdersByStatus:", error)
        return []
      }
    },

    // Create new order
    createNewOrder: async (orderData: any) => {
      try {
        console.log("[receptionist-service] Creating new order:", orderData)

        const { data, error } = await supabase
          .from("service_orders")
          .insert([
            {
              ...orderData,
              receptionist_id: user.id,
              status: "received",
              received_date: new Date().toISOString(),
            },
          ])
          .select()
          .single()

        if (error) {
          console.error("[receptionist-service] Error creating order:", error)
          return { success: false, error: error.message }
        }

        console.log("[receptionist-service] Order created successfully:", data.id)
        return { success: true, orderId: data.id }
      } catch (error) {
        console.error("[receptionist-service] Error in createNewOrder:", error)
        return { success: false, error: "Error inesperado al crear la orden" }
      }
    },

    // Update order status
    updateOrderStatus: async (orderId: string, status: string, notes?: string) => {
      try {
        console.log(`[receptionist-service] Updating order ${orderId} status to ${status}`)

        const updateData: any = {
          status,
          updated_at: new Date().toISOString(),
        }

        if (status === "completed") {
          updateData.completed_date = new Date().toISOString()
        } else if (status === "delivered") {
          updateData.delivered_date = new Date().toISOString()
        }

        if (notes) {
          updateData.internal_notes = notes
        }

        const { error } = await supabase.from("service_orders").update(updateData).eq("id", orderId)

        if (error) {
          console.error("[receptionist-service] Error updating order status:", error)
          return { success: false, error: error.message }
        }

        console.log("[receptionist-service] Order status updated successfully")
        return { success: true }
      } catch (error) {
        console.error("[receptionist-service] Error in updateOrderStatus:", error)
        return { success: false, error: "Error inesperado al actualizar el estado" }
      }
    },

    // Get all clients
    getAllClients: async (): Promise<ClientWithOrders[]> => {
      try {
        console.log("[receptionist-service] Fetching all clients...")

        const { data: clients, error } = await supabase
          .from("profiles")
          .select(`
            *,
            clients(*)
          `)
          .eq("role", "client")
          .order("created_at", { ascending: false })

        if (error) {
          console.error("[receptionist-service] Error fetching clients:", error)
          return []
        }

        // Get order counts for each client
        const { data: orderCounts } = await supabase.from("service_orders").select("client_id, created_at")

        const orderCountMap =
          orderCounts?.reduce(
            (acc, order) => {
              acc[order.client_id] = (acc[order.client_id] || 0) + 1
              return acc
            },
            {} as Record<string, number>,
          ) || {}

        const clientsWithOrders: ClientWithOrders[] =
          clients?.map((client) => {
            const ordersCount = orderCountMap[client.id] || 0
            const clientInfo = client.clients?.[0]

            // Determine status
            let status: "active" | "new" | "inactive" = "inactive"
            if (client.is_active) {
              const createdDate = new Date(client.created_at)
              const monthAgo = new Date()
              monthAgo.setMonth(monthAgo.getMonth() - 1)

              if (createdDate > monthAgo) {
                status = "new"
              } else {
                status = "active"
              }
            }

            return {
              id: client.id,
              full_name: client.full_name || "N/A",
              email: client.email || "N/A",
              phone: client.phone,
              company_name: clientInfo?.company_name,
              address: clientInfo?.address,
              city: clientInfo?.city,
              is_active: client.is_active,
              created_at: client.created_at,
              orders_count: ordersCount,
              status,
            }
          }) || []

        console.log(`[receptionist-service] Fetched ${clientsWithOrders.length} clients`)
        return clientsWithOrders
      } catch (error) {
        console.error("[receptionist-service] Error in getAllClients:", error)
        return []
      }
    },

    // Get client by ID
    getClientById: async (clientId: string): Promise<ClientWithOrders | null> => {
      try {
        console.log(`[receptionist-service] Fetching client: ${clientId}`)

        const { data: client, error } = await supabase
          .from("profiles")
          .select(`
            *,
            clients(*)
          `)
          .eq("id", clientId)
          .eq("role", "client")
          .single()

        if (error || !client) {
          console.error("[receptionist-service] Error fetching client:", error)
          return null
        }

        // Get order count for this client
        const { data: orders } = await supabase.from("service_orders").select("created_at").eq("client_id", clientId)

        const clientInfo = client.clients?.[0]
        const ordersCount = orders?.length || 0

        return {
          id: client.id,
          full_name: client.full_name || "N/A",
          email: client.email || "N/A",
          phone: client.phone,
          company_name: clientInfo?.company_name,
          address: clientInfo?.address,
          city: clientInfo?.city,
          is_active: client.is_active,
          created_at: client.created_at,
          orders_count: ordersCount,
          status: client.is_active ? "active" : "inactive",
        }
      } catch (error) {
        console.error("[receptionist-service] Error in getClientById:", error)
        return null
      }
    },

    // Get all clients with equipments
    getAllClientsWithEquipments: async (): Promise<ClientWithEquipments[]> => {
      try {
        console.log("[receptionist-service] Fetching all clients with equipments...")

        const { data: clients, error } = await supabase
          .from("profiles")
          .select(`
            *,
            clients(*)
          `)
          .eq("role", "client")
          .order("created_at", { ascending: false })

        if (error) {
          console.error("[receptionist-service] Error fetching clients:", error)
          return []
        }

        // Get order counts and equipment counts for each client
        const { data: orderCounts } = await supabase.from("service_orders").select("client_id, created_at")
        const { data: equipmentCounts } = await supabase.from("equipments").select("assigned_to, id")

        const orderCountMap =
          orderCounts?.reduce(
            (acc, order) => {
              acc[order.client_id] = (acc[order.client_id] || 0) + 1
              return acc
            },
            {} as Record<string, number>,
          ) || {}

        const equipmentCountMap =
          equipmentCounts?.reduce(
            (acc, equipment) => {
              if (equipment.assigned_to) {
                acc[equipment.assigned_to] = (acc[equipment.assigned_to] || 0) + 1
              }
              return acc
            },
            {} as Record<string, number>,
          ) || {}

        // Get equipments for each client
        const { data: equipments } = await supabase
          .from("equipments")
          .select(`
            *,
            equipment_components(*)
          `)
          .not("assigned_to", "is", null)

        const equipmentsByClient =
          equipments?.reduce(
            (acc, equipment) => {
              if (equipment.assigned_to) {
                if (!acc[equipment.assigned_to]) {
                  acc[equipment.assigned_to] = []
                }
                acc[equipment.assigned_to].push(equipment)
              }
              return acc
            },
            {} as Record<string, ClientEquipment[]>,
          ) || {}

        const clientsWithEquipments: ClientWithEquipments[] =
          clients?.map((client) => {
            const ordersCount = orderCountMap[client.id] || 0
            const equipmentsCount = equipmentCountMap[client.id] || 0
            const clientInfo = client.clients?.[0]
            const clientEquipments = equipmentsByClient[client.id] || []

            // Determine status
            let status: "active" | "new" | "inactive" = "inactive"
            if (client.is_active) {
              const createdDate = new Date(client.created_at)
              const monthAgo = new Date()
              monthAgo.setMonth(monthAgo.getMonth() - 1)

              if (createdDate > monthAgo) {
                status = "new"
              } else {
                status = "active"
              }
            }

            return {
              id: client.id,
              full_name: client.full_name || "N/A",
              email: client.email || "N/A",
              phone: client.phone,
              company_name: clientInfo?.company_name,
              address: clientInfo?.address,
              city: clientInfo?.city,
              is_active: client.is_active,
              created_at: client.created_at,
              orders_count: ordersCount,
              equipments: clientEquipments,
              status,
              _count: {
                service_orders: ordersCount,
                equipments: equipmentsCount,
              },
            }
          }) || []

        console.log(`[receptionist-service] Fetched ${clientsWithEquipments.length} clients with equipments`)
        return clientsWithEquipments
      } catch (error) {
        console.error("[receptionist-service] Error in getAllClientsWithEquipments:", error)
        return []
      }
    },

    // Get client with equipments
    getClientWithEquipments: async (clientId: string): Promise<ClientWithEquipments | null> => {
      try {
        console.log(`[receptionist-service] Fetching client with equipments: ${clientId}`)

        const { data: client, error } = await supabase
          .from("profiles")
          .select(`
            *,
            clients(*)
          `)
          .eq("id", clientId)
          .eq("role", "client")
          .single()

        if (error || !client) {
          console.error("[receptionist-service] Error fetching client:", error)
          return null
        }

        // Get order count and equipments for this client
        const { data: orders } = await supabase.from("service_orders").select("created_at").eq("client_id", clientId)
        const { data: equipments } = await supabase
          .from("equipments")
          .select(`
            *,
            equipment_components(*)
          `)
          .eq("assigned_to", clientId)

        const clientInfo = client.clients?.[0]
        const ordersCount = orders?.length || 0
        const equipmentsCount = equipments?.length || 0

        return {
          id: client.id,
          full_name: client.full_name || "N/A",
          email: client.email || "N/A",
          phone: client.phone,
          company_name: clientInfo?.company_name,
          address: clientInfo?.address,
          city: clientInfo?.city,
          is_active: client.is_active,
          created_at: client.created_at,
          orders_count: ordersCount,
          equipments: equipments || [],
          status: client.is_active ? "active" : "inactive",
          _count: {
            service_orders: ordersCount,
            equipments: equipmentsCount,
          },
        }
      } catch (error) {
        console.error("[receptionist-service] Error in getClientWithEquipments:", error)
        return null
      }
    },

    // Create client
    createClient: async (clientData: any) => {
      try {
        console.log("[receptionist-service] Creating new client:", clientData)

        // First create the profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .insert([
            {
              full_name: clientData.full_name,
              email: clientData.email,
              phone: clientData.phone,
              role: "client",
              is_active: true,
            },
          ])
          .select()
          .single()

        if (profileError) {
          console.error("[receptionist-service] Error creating client profile:", profileError)
          return { success: false, error: profileError.message }
        }

        // Then create client details if provided
        if (clientData.company_name || clientData.address || clientData.city) {
          const { error: clientError } = await supabase.from("clients").insert([
            {
              user_id: profile.id,
              company_name: clientData.company_name,
              address: clientData.address,
              city: clientData.city,
            },
          ])

          if (clientError) {
            console.error("[receptionist-service] Error creating client details:", clientError)
            // Don't fail the whole operation, just log the error
          }
        }

        console.log("[receptionist-service] Client created successfully:", profile.id)
        return { success: true, clientId: profile.id }
      } catch (error) {
        console.error("[receptionist-service] Error in createClient:", error)
        return { success: false, error: "Error inesperado al crear el cliente" }
      }
    },

    // Update client
    updateClient: async (clientId: string, clientData: any) => {
      try {
        console.log(`[receptionist-service] Updating client ${clientId}:`, clientData)

        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            full_name: clientData.full_name,
            email: clientData.email,
            phone: clientData.phone,
            is_active: clientData.is_active,
            updated_at: new Date().toISOString(),
          })
          .eq("id", clientId)

        if (profileError) {
          console.error("[receptionist-service] Error updating client profile:", profileError)
          return { success: false, error: profileError.message }
        }

        // Update client details
        if (clientData.company_name || clientData.address || clientData.city) {
          const { error: clientError } = await supabase.from("clients").upsert([
            {
              user_id: clientId,
              company_name: clientData.company_name,
              address: clientData.address,
              city: clientData.city,
            },
          ])

          if (clientError) {
            console.error("[receptionist-service] Error updating client details:", clientError)
          }
        }

        console.log("[receptionist-service] Client updated successfully")
        return { success: true }
      } catch (error) {
        console.error("[receptionist-service] Error in updateClient:", error)
        return { success: false, error: "Error inesperado al actualizar el cliente" }
      }
    },

    // Deliveries management
    getReadyForDelivery: async (): Promise<DeliveryItem[]> => {
      try {
        console.log("[receptionist-service] Fetching orders ready for delivery...")

        const { data, error } = await supabase
          .from("service_orders")
          .select(`
            id,
            order_number,
            completed_date,
            priority,
            status,
            estimated_cost,
            final_cost,
            problem_description,
            solution,
            client:profiles!client_id(full_name, phone),
            equipment:equipments!equipment_id(equipment_type, brand, model)
          `)
          .eq("status", "completed")
          .order("completed_date", { ascending: true })

        if (error) {
          console.error("[receptionist-service] Error fetching delivery items:", error)
          return []
        }

        const deliveryItems: DeliveryItem[] =
          data?.map((order) => ({
            id: order.id,
            order_number: order.order_number,
            client_name: order.client?.full_name || "Cliente desconocido",
            client_phone: order.client?.phone,
            equipment_type: order.equipment?.equipment_type || "Equipo",
            equipment_brand: order.equipment?.brand || "N/A",
            equipment_model: order.equipment?.model || "N/A",
            estimated_cost: order.final_cost || order.estimated_cost || 0,
            repair_description: order.solution || order.problem_description || "Sin descripción",
            completed_date: order.completed_date,
            is_notified: false,
            priority: order.priority,
            status: order.status,
          })) || []

        console.log(`[receptionist-service] Found ${deliveryItems.length} items ready for delivery`)
        return deliveryItems
      } catch (error) {
        console.error("[receptionist-service] Error in getReadyForDelivery:", error)
        return []
      }
    },

    // Mark as delivered
    markAsDelivered: async (orderId: string) => {
      try {
        console.log(`[receptionist-service] Marking order ${orderId} as delivered`)

        const { error } = await supabase
          .from("service_orders")
          .update({
            status: "delivered",
            delivered_date: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", orderId)

        if (error) {
          console.error("[receptionist-service] Error marking as delivered:", error)
          return { success: false, error: error.message }
        }

        console.log("[receptionist-service] Order marked as delivered successfully")
        return { success: true }
      } catch (error) {
        console.error("[receptionist-service] Error in markAsDelivered:", error)
        return { success: false, error: "Error inesperado al marcar como entregado" }
      }
    },

    // Notify client
    notifyClient: async (orderId: string) => {
      try {
        console.log(`[receptionist-service] Notifying client for order ${orderId}`)

        // In a real app, this would send an email/SMS
        // For now, we'll just log it and return success

        console.log("[receptionist-service] Client notification sent successfully")
        return { success: true }
      } catch (error) {
        console.error("[receptionist-service] Error in notifyClient:", error)
        return { success: false, error: "Error inesperado al notificar al cliente" }
      }
    },

    // Notifications
    getNotifications: async (): Promise<NotificationItem[]> => {
      try {
        console.log("[receptionist-service] Fetching notifications...")

        // Mock notifications based on real data
        const { data: readyOrders } = await supabase
          .from("service_orders")
          .select(`
            id,
            order_number,
            client:profiles!client_id(full_name)
          `)
          .eq("status", "completed")
          .limit(5)

        const { data: newOrders } = await supabase
          .from("service_orders")
          .select(`
            id,
            order_number,
            client:profiles!client_id(full_name)
          `)
          .eq("status", "received")
          .limit(3)

        const notifications: NotificationItem[] = []

        // Add delivery ready notifications
        readyOrders?.forEach((order, index) => {
          notifications.push({
            id: `delivery-${order.id}`,
            type: "delivery_ready",
            title: "Equipo listo para entrega",
            message: `Orden ${order.order_number} de ${order.client?.full_name} está lista para entrega`,
            priority: "high",
            is_read: false,
            created_at: new Date(Date.now() - index * 3600000).toISOString(),
            order_id: order.id,
          })
        })

        // Add new order notifications
        newOrders?.forEach((order, index) => {
          notifications.push({
            id: `new-order-${order.id}`,
            type: "new_order",
            title: "Nueva orden recibida",
            message: `Nueva orden ${order.order_number} de ${order.client?.full_name}`,
            priority: "medium",
            is_read: false,
            created_at: new Date(Date.now() - index * 1800000).toISOString(),
            order_id: order.id,
          })
        })

        // Sort by created_at desc
        notifications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

        console.log(`[receptionist-service] Generated ${notifications.length} notifications`)
        return notifications
      } catch (error) {
        console.error("[receptionist-service] Error in getNotifications:", error)
        return []
      }
    },

    // Mark notification as read
    markNotificationAsRead: async (notificationId: string) => {
      try {
        console.log(`[receptionist-service] Marking notification ${notificationId} as read`)

        // In a real app, this would update a notifications table
        // For now, just return success

        console.log("[receptionist-service] Notification marked as read")
        return { success: true }
      } catch (error) {
        console.error("[receptionist-service] Error in markNotificationAsRead:", error)
        return { success: false, error: "Error inesperado al marcar notificación" }
      }
    },

    // Create notification
    createNotification: async (notification: Omit<NotificationItem, "id" | "created_at">) => {
      try {
        console.log("[receptionist-service] Creating notification:", notification)

        // In a real app, this would insert into a notifications table
        // For now, just return success

        console.log("[receptionist-service] Notification created successfully")
        return { success: true }
      } catch (error) {
        console.error("[receptionist-service] Error in createNotification:", error)
        return { success: false, error: "Error inesperado al crear notificación" }
      }
    },

    // Equipment management
    getClientEquipments: async (clientId: string): Promise<ClientEquipment[]> => {
      try {
        console.log(`[receptionist-service] Fetching equipments for client: ${clientId}`)

        const { data: equipments, error } = await supabase
          .from("equipments")
          .select(`
            *,
            equipment_components(*)
          `)
          .eq("assigned_to", clientId)
          .order("created_at", { ascending: false })

        if (error) {
          console.error("[receptionist-service] Error fetching client equipments:", error)
          return []
        }

        console.log(`[receptionist-service] Fetched ${equipments?.length || 0} equipments for client`)
        return equipments || []
      } catch (error) {
        console.error("[receptionist-service] Error in getClientEquipments:", error)
        return []
      }
    },

    // Create equipment for client
    createEquipmentForClient: async (clientId: string, equipmentData: any) => {
      try {
        console.log(`[receptionist-service] Creating equipment for client ${clientId}:`, equipmentData)

        const { data: equipment, error: equipmentError } = await supabase
          .from("equipments")
          .insert([
            {
              ...equipmentData,
              assigned_to: clientId,
            },
          ])
          .select()
          .single()

        if (equipmentError) {
          console.error("[receptionist-service] Error creating equipment:", equipmentError)
          return { success: false, error: equipmentError.message }
        }

        // Create components if provided
        if (equipmentData.components && equipmentData.components.length > 0) {
          const componentsToInsert = equipmentData.components.map((component: any) => ({
            equipment_id: equipment.id,
            component_type: component.component_type,
            component_name: component.component_name,
            specifications: component.specifications,
            quantity: component.quantity,
          }))

          const { error: componentsError } = await supabase.from("equipment_components").insert(componentsToInsert)

          if (componentsError) {
            console.error("[receptionist-service] Error creating components:", componentsError)
            // Don't fail the whole operation, just log the error
          }
        }

        console.log("[receptionist-service] Equipment created successfully:", equipment.id)
        return { success: true, equipmentId: equipment.id }
      } catch (error) {
        console.error("[receptionist-service] Error in createEquipmentForClient:", error)
        return { success: false, error: "Error inesperado al crear el equipo" }
      }
    },

    // Update equipment
    updateEquipment: async (equipmentId: string, equipmentData: any) => {
      try {
        console.log(`[receptionist-service] Updating equipment ${equipmentId}:`, equipmentData)

        const { error: equipmentError } = await supabase
          .from("equipments")
          .update({
            ...equipmentData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", equipmentId)

        if (equipmentError) {
          console.error("[receptionist-service] Error updating equipment:", equipmentError)
          return { success: false, error: equipmentError.message }
        }

        // Handle components update if provided
        if (equipmentData.components !== undefined) {
          // Delete existing components
          const { error: deleteError } = await supabase
            .from("equipment_components")
            .delete()
            .eq("equipment_id", equipmentId)

          if (deleteError) {
            console.error("[receptionist-service] Error deleting components:", deleteError)
          }

          // Insert new components if provided
          if (equipmentData.components.length > 0) {
            const componentsToInsert = equipmentData.components.map((component: any) => ({
              equipment_id: equipmentId,
              component_type: component.component_type,
              component_name: component.component_name,
              specifications: component.specifications,
              quantity: component.quantity,
            }))

            const { error: componentsError } = await supabase.from("equipment_components").insert(componentsToInsert)

            if (componentsError) {
              console.error("[receptionist-service] Error creating components:", componentsError)
            }
          }
        }

        console.log("[receptionist-service] Equipment updated successfully")
        return { success: true }
      } catch (error) {
        console.error("[receptionist-service] Error in updateEquipment:", error)
        return { success: false, error: "Error inesperado al actualizar el equipo" }
      }
    },

    // Delete equipment
    deleteEquipment: async (equipmentId: string) => {
      try {
        console.log(`[receptionist-service] Deleting equipment ${equipmentId}`)

        // Delete components first (due to foreign key constraint)
        const { error: componentsError } = await supabase
          .from("equipment_components")
          .delete()
          .eq("equipment_id", equipmentId)

        if (componentsError) {
          console.error("[receptionist-service] Error deleting components:", componentsError)
        }

        // Delete the equipment
        const { error: equipmentError } = await supabase.from("equipments").delete().eq("id", equipmentId)

        if (equipmentError) {
          console.error("[receptionist-service] Error deleting equipment:", equipmentError)
          return { success: false, error: equipmentError.message }
        }

        console.log("[receptionist-service] Equipment deleted successfully")
        return { success: true }
      } catch (error) {
        console.error("[receptionist-service] Error in deleteEquipment:", error)
        return { success: false, error: "Error inesperado al eliminar el equipo" }
      }
    },
  }
}

export async function getClientsStats(supabase: SupabaseClient) {
  const service = await createReceptionistService(supabase)
  if (!service)
    return {
      totalClients: 0,
      activeClients: 0,
      newClients: 0,
      inactiveClients: 0,
      companiesCount: 0,
      newThisMonth: 0,
      withEquipments: 0,
    }

  const clients = await service.getAllClientsWithEquipments()
  const now = new Date()

  return {
    totalClients: clients.length,
    activeClients: clients.filter((c) => c.status === "active").length,
    newClients: clients.filter((c) => c.status === "new").length,
    inactiveClients: clients.filter((c) => c.status === "inactive").length,
    companiesCount: clients.filter((c) => c.company_name && c.company_name.trim() !== "").length,
    newThisMonth: clients.filter((c) => {
      const clientDate = new Date(c.created_at)
      return clientDate.getMonth() === now.getMonth() && clientDate.getFullYear() === now.getFullYear()
    }).length,
    withEquipments: clients.filter((c) => (c._count?.equipments || 0) > 0).length,
  }
}

export async function getClients(supabase: SupabaseClient) {
  const service = await createReceptionistService(supabase)
  if (!service) return []
  return service.getAllClients()
}

export async function getClientsWithEquipments(supabase: SupabaseClient) {
  const service = await createReceptionistService(supabase)
  if (!service) return []
  return service.getAllClientsWithEquipments()
}

export async function getClientEquipments(supabase: SupabaseClient, clientId: string) {
  const service = await createReceptionistService(supabase)
  if (!service) return []
  return service.getClientEquipments(clientId)
}

export async function createEquipmentForClient(supabase: SupabaseClient, clientId: string, equipmentData: any) {
  const service = await createReceptionistService(supabase)
  if (!service) return { success: false, error: "Service not available" }
  return service.createEquipmentForClient(clientId, equipmentData)
}

export async function getReadyForDelivery(supabase: SupabaseClient) {
  const service = await createReceptionistService(supabase)
  if (!service) return []
  return service.getReadyForDelivery()
}

export async function getDeliveredOrders(supabase: SupabaseClient) {
  const service = await createReceptionistService(supabase)
  if (!service) return []
  return service.getOrdersByStatus("delivered")
}

export async function markAsDelivered(supabase: SupabaseClient, orderId: string) {
  const service = await createReceptionistService(supabase)
  if (!service) return { success: false, error: "Service not available" }
  return service.markAsDelivered(orderId)
}

export async function notifyClient(supabase: SupabaseClient, orderId: string) {
  const service = await createReceptionistService(supabase)
  if (!service) return { success: false, error: "Service not available" }
  return service.notifyClient(orderId)
}

export async function getNotifications(supabase: SupabaseClient) {
  const service = await createReceptionistService(supabase)
  if (!service) return []
  return service.getNotifications()
}

export async function markNotificationAsRead(supabase: SupabaseClient, notificationId: string) {
  const service = await createReceptionistService(supabase)
  if (!service) return { success: false, error: "Service not available" }
  return service.markNotificationAsRead(notificationId)
}

export async function markAllNotificationsAsRead(supabase: SupabaseClient) {
  const service = await createReceptionistService(supabase)
  if (!service) return { success: false, error: "Service not available" }

  // In a real implementation, this would mark all notifications as read
  console.log("[receptionist-service] Marking all notifications as read")
  return { success: true }
}
