"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ClientRoleGuard } from "@/components/auth/client-role-guard"
import { ReceptionistLayout } from "@/components/receptionist/receptionist-layout"
import { ReceptionistDashboardStats } from "@/components/dashboard/receptionist-dashboard-stats"
import {
  ReceptionistActivityList,
  type ReceptionistActivityItem,
} from "@/components/dashboard/receptionist-activity-list"
import { ReceptionistQuickActions } from "@/components/dashboard/receptionist-quick-actions"
import { createClient } from "@/lib/supabase/client"
import { createReceptionistService } from "@/lib/services/receptionist-service"
import { Loader2 } from "lucide-react"

interface DashboardData {
  stats: {
    todayOrders: number
    clientsServed: number
    pendingDeliveries: number
    satisfactionIndex: number
    totalOrders: number
    activeOrders: number
    completedOrders: number
    deliveredOrders: number
  }
  activities: ReceptionistActivityItem[]
  unreadNotifications: number
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

export default function ReceptionistDashboard() {
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [userInfo, setUserInfo] = useState<{
    name: string
    email: string
    role: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()

      console.log("[v0] Dashboard - User data:", user?.id, user?.email)

      if (!user) {
        console.log("[v0] Dashboard - No user found, redirecting to login")
        router.push("/auth/login")
        return
      }

      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      console.log("[v0] Dashboard - Profile data:", profile)

      if (!profile) {
        console.log("[v0] Dashboard - No profile found, redirecting to unauthorized")
        router.push("/unauthorized")
        return
      }

      // Allow both receptionist and client roles for demo purposes
      if (!["receptionist", "client"].includes(profile.role)) {
        console.log("[v0] Dashboard - Role not authorized:", profile.role)
        router.push("/unauthorized")
        return
      }

      console.log("[v0] Dashboard - Access granted for role:", profile.role)

      setUserInfo({
        name: profile.full_name || "Recepcionista",
        email: profile.email || "",
        role: profile.role,
      })

      // Initialize receptionist service
      const receptionistService = await createReceptionistService(supabase)

      if (!receptionistService) {
        throw new Error("Failed to initialize receptionist service")
      }

      // Fetch dashboard data
      const [dashboardStats, recentOrders, notifications] = await Promise.all([
        receptionistService.getDashboardStats(),
        receptionistService.getRecentOrders(10),
        receptionistService.getNotifications(),
      ])

      // Generate activity items from recent orders and notifications
      const recentActivity: ReceptionistActivityItem[] = []

      // Add recent orders as activities
      recentOrders.forEach((order) => {
        const timeAgo = getTimeAgo(new Date(order.created_at))

        if (order.status === "received") {
          recentActivity.push({
            id: `order-new-${order.id}`,
            type: "new_order",
            message: `Nueva orden ${order.order_number} de ${order.client?.full_name || "Cliente desconocido"}`,
            time: timeAgo,
            priority: order.priority === "urgent" ? "high" : order.priority === "high" ? "medium" : "low",
            orderId: order.id,
          })
        } else if (order.status === "completed") {
          recentActivity.push({
            id: `order-completed-${order.id}`,
            type: "order_completed",
            message: `Orden ${order.order_number} completada y lista para entrega`,
            time: timeAgo,
            priority: "medium",
            orderId: order.id,
          })
        }
      })

      // Add notifications as activities
      notifications.slice(0, 5).forEach((notification) => {
        recentActivity.push({
          id: `notification-${notification.id}`,
          type: notification.type,
          message: notification.message,
          time: getTimeAgo(new Date(notification.created_at)),
          priority: notification.priority,
          orderId: notification.order_id,
          clientId: notification.client_id,
        })
      })

      const unreadNotifications = notifications.filter((n) => !n.is_read).length

      setDashboardData({
        stats: dashboardStats,
        activities: recentActivity.slice(0, 8),
        unreadNotifications,
      })
    } catch (error) {
      console.error("Error loading dashboard data:", error)
      setError("Error al cargar los datos del dashboard")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const handleDataChange = () => {
    loadDashboardData()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (error || !dashboardData || !userInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Error al cargar el dashboard"}</p>
          <button onClick={loadDashboardData} className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <ClientRoleGuard allowedRoles={["receptionist", "client"]}>
      <ReceptionistLayout userInfo={userInfo}>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Panel de Recepción</h1>
            <p className="text-muted-foreground">Gestiona la recepción y entrega de equipos de cómputo</p>
          </div>

          {/* Dashboard Statistics */}
          <ReceptionistDashboardStats stats={dashboardData.stats} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <ReceptionistQuickActions
              pendingDeliveries={dashboardData.stats.pendingDeliveries}
              unreadNotifications={dashboardData.unreadNotifications}
              activeOrders={dashboardData.stats.activeOrders}
              onDataChange={handleDataChange}
            />

            {/* Recent Activity */}
            <ReceptionistActivityList activities={dashboardData.activities} />
          </div>
        </div>
      </ReceptionistLayout>
    </ClientRoleGuard>
  )
}
