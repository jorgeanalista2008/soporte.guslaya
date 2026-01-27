"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AdminLayout } from "@/components/admin/admin-layout"
import { AdminDashboardStats } from "@/components/dashboard/admin-dashboard-stats"
import { RecentActivityList, type ActivityItem } from "@/components/dashboard/recent-activity-list"

interface OrderWithDetails {
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
  equipment: {
    id: string
    equipment_type: string
    brand: string
    model: string
  } | null
}

interface DashboardData {
  profile: any
  stats: Array<{ label: string; value: number }>
  recentActivity: ActivityItem[]
}

function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return "Hace menos de 1 minuto"
  if (diffInMinutes < 60) return `Hace ${diffInMinutes} minuto${diffInMinutes > 1 ? "s" : ""}`

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? "s" : ""}`

  const diffInDays = Math.floor(diffInHours / 24)
  return `Hace ${diffInDays} día${diffInDays > 1 ? "s" : ""}`
}

async function fetchOrdersStatsClient() {
  const supabase = createClient()

  const { data: orders, error } = await supabase.from("service_orders").select("status, created_at")

  if (error) {
    console.error("Error fetching orders stats:", error)
    return {
      totalOrders: 0,
      activeOrders: 0,
      pendingOrders: 0,
      inProgressOrders: 0,
      completedOrders: 0,
      deliveredOrders: 0,
    }
  }

  const totalOrders = orders?.length || 0
  const activeOrders = orders?.filter((o) => !["completed", "delivered", "cancelled"].includes(o.status)).length || 0
  const pendingOrders = orders?.filter((o) => o.status === "pending").length || 0
  const inProgressOrders = orders?.filter((o) => o.status === "in_progress").length || 0
  const completedOrders = orders?.filter((o) => o.status === "completed").length || 0
  const deliveredOrders = orders?.filter((o) => o.status === "delivered").length || 0

  return {
    totalOrders,
    activeOrders,
    pendingOrders,
    inProgressOrders,
    completedOrders,
    deliveredOrders,
  }
}

async function fetchRecentOrdersClient(limit = 10): Promise<OrderWithDetails[]> {
  const supabase = createClient()

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
    console.error("Error fetching recent orders:", error)
    return []
  }

  return data || []
}

export function AdminDashboardClient() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<OrderWithDetails[]>([])
  const [equipments, setEquipments] = useState<any[]>([])
  const [inventoryRequests, setInventoryRequests] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const supabase = createClient()

        if (!supabase) {
          router.push("/auth/login")
          return
        }

        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/auth/login")
          return
        }

        const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        if (!profile) {
          router.push("/auth/login")
          return
        }

        const [ordersStats, recentOrdersData] = await Promise.all([
          fetchOrdersStatsClient(),
          fetchRecentOrdersClient(50),
        ])

        setOrders(recentOrdersData)

        const { data: recentEquipments } = await supabase
          .from("equipments")
          .select(`
            id,
            equipment_type,
            brand,
            model,
            serial_number,
            created_at,
            client:profiles!client_id(full_name)
          `)
          .order("created_at", { ascending: false })
          .limit(5)

        const { data: recentInventoryRequests } = await supabase
          .from("inventory_requests")
          .select(`
            id,
            quantity,
            status,
            created_at,
            inventory_item:inventory_items!item_id(name, part_number),
            requested_by:profiles!requested_by(full_name)
          `)
          .order("created_at", { ascending: false })
          .limit(5)

        const { data: recentUsersData } = await supabase
          .from("profiles")
          .select("id, full_name, email, role, created_at")
          .order("created_at", { ascending: false })
          .limit(5)

        setEquipments(recentEquipments || [])
        setInventoryRequests(recentInventoryRequests || [])
        setUsers(recentUsersData || [])

        const { data: clients } = await supabase.from("profiles").select("id").eq("role", "client")
        const { data: technicians } = await supabase.from("profiles").select("id").eq("role", "technician")

        const { data: recentUsers } = await supabase
          .from("profiles")
          .select("id, full_name, role, created_at")
          .order("created_at", { ascending: false })
          .limit(10)

        const { data: deliveredOrders } = await supabase
          .from("service_orders")
          .select("id, description, status, updated_at, profiles!service_orders_technician_id_fkey(full_name)")
          .eq("status", "delivered")
          .order("updated_at", { ascending: false })
          .limit(5)

        const { data: recentLogins } = await supabase
          .from("profiles")
          .select("id, full_name, role, last_sign_in_at")
          .not("last_sign_in_at", "is", null)
          .order("last_sign_in_at", { ascending: false })
          .limit(10)

        const totalClients = clients?.length || 0
        const totalTechnicians = technicians?.length || 0

        const stats = [
          { label: "Órdenes Totales", value: ordersStats.totalOrders },
          { label: "Órdenes Activas", value: ordersStats.activeOrders },
          { label: "Órdenes Pendientes", value: ordersStats.pendingOrders },
          { label: "Órdenes En Progreso", value: ordersStats.inProgressOrders },
          { label: "Órdenes Completadas", value: ordersStats.completedOrders },
          { label: "Órdenes Entregadas", value: ordersStats.deliveredOrders },
          { label: "Clientes", value: totalClients },
          { label: "Técnicos", value: totalTechnicians },
        ]

        const recentActivity: ActivityItem[] = []

        recentOrdersData?.forEach((order) => {
          const timeAgo = getTimeAgo(new Date(order.created_at))
          if (order.status === "pending") {
            recentActivity.push({
              id: `order-new-${order.id}`,
              type: "order",
              message: `Nueva orden ${order.order_number} creada por ${order.client?.full_name || "Cliente desconocido"}`,
              time: timeAgo,
              icon: "plus",
            })
          } else if (order.status === "completed") {
            recentActivity.push({
              id: `order-completed-${order.id}`,
              type: "order",
              message: `Orden ${order.order_number} marcada como completada`,
              time: timeAgo,
              icon: "check",
            })
          }

          if (order.total_amount && order.status !== "pending") {
            recentActivity.push({
              id: `payment-${order.id}`,
              type: "payment",
              message: `Pago recibido para orden ${order.order_number} - $${order.total_amount}`,
              time: timeAgo,
              icon: "dollar-sign",
            })
          }
        })

        recentUsers?.forEach((user) => {
          if (user.role === "client") {
            recentActivity.push({
              id: `user-${user.id}`,
              type: "user",
              message: `Nuevo cliente registrado: ${user.full_name}`,
              time: getTimeAgo(new Date(user.created_at)),
              icon: "user-plus",
            })
          }
        })

        recentLogins?.slice(0, 10).forEach((login) => {
          recentActivity.push({
            id: `login-${login.id}`,
            type: "login",
            message: `${login.full_name} (${login.role}) inició sesión`,
            time: getTimeAgo(new Date(login.last_sign_in_at)),
            icon: "log-in",
          })
        })

        deliveredOrders?.forEach((order) => {
          recentActivity.push({
            id: `delivered-${order.id}`,
            type: "delivery",
            message: `Orden ${order.order_number} entregada por ${order.profiles?.full_name || "Técnico"}`,
            time: getTimeAgo(new Date(order.updated_at)),
            icon: "truck",
          })
        })

        const sortedActivity = recentActivity.slice(0, 15)

        setDashboardData({
          profile,
          stats,
          recentActivity: sortedActivity,
        })
      } catch (error) {
        console.error("Error loading dashboard data:", error)
        router.push("/auth/login")
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Cargando panel de administración...</p>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return null
  }

  return (
    <AdminLayout
      userInfo={{
        name: dashboardData.profile.full_name,
        email: dashboardData.profile.email,
        role: dashboardData.profile.role,
      }}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Panel de Administración</h1>
          <p className="text-muted-foreground">Vista general del sistema de servicio técnico</p>
        </div>

        <AdminDashboardStats stats={dashboardData.stats} orders={orders} />

        <RecentActivityList
          activities={dashboardData.recentActivity}
          equipments={equipments}
          inventoryRequests={inventoryRequests}
          users={users}
        />
      </div>
    </AdminLayout>
  )
}
