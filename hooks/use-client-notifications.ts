"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"

interface Notification {
  id: string
  user_id: string
  type: "order_update" | "order_completed" | "payment_reminder" | "system"
  title: string
  message: string
  read: boolean
  created_at: string
  order_id?: string
}

export function useClientNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      setError(null)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("Usuario no autenticado")
      }

      // For now, we'll create mock notifications since the table doesn't exist yet
      // In a real implementation, you would fetch from a notifications table
      const mockNotifications: Notification[] = [
        {
          id: "1",
          user_id: user.id,
          type: "order_update",
          title: "Actualización de Orden",
          message: "Tu orden #ORD-001 ha sido actualizada a 'En Progreso'",
          read: false,
          created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          order_id: "ORD-001",
        },
        {
          id: "2",
          user_id: user.id,
          type: "order_completed",
          title: "Orden Completada",
          message: "Tu orden #ORD-002 ha sido completada y está lista para recoger",
          read: false,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          order_id: "ORD-002",
        },
        {
          id: "3",
          user_id: user.id,
          type: "payment_reminder",
          title: "Recordatorio de Pago",
          message: "Tienes un pago pendiente de $150.00 para la orden #ORD-003",
          read: true,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          order_id: "ORD-003",
        },
        {
          id: "4",
          user_id: user.id,
          type: "system",
          title: "Bienvenido al Sistema",
          message: "Tu cuenta ha sido configurada correctamente. ¡Bienvenido!",
          read: true,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 1 week ago
        },
      ]

      setNotifications(
        mockNotifications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
      )
    } catch (err) {
      console.error("Error fetching notifications:", err)
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      // Update local state immediately for better UX
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId ? { ...notification, read: true } : notification,
        ),
      )

      // In a real implementation, you would update the database here
      // await supabase.from('notifications').update({ read: true }).eq('id', notificationId)
    } catch (err) {
      console.error("Error marking notification as read:", err)
    }
  }

  const markAllAsRead = async () => {
    try {
      // Update local state immediately for better UX
      setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))

      // In a real implementation, you would update the database here
      // await supabase.from('notifications').update({ read: true }).eq('user_id', user.id)
    } catch (err) {
      console.error("Error marking all notifications as read:", err)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      // Update local state immediately for better UX
      setNotifications((prev) => prev.filter((notification) => notification.id !== notificationId))

      // In a real implementation, you would delete from the database here
      // await supabase.from('notifications').delete().eq('id', notificationId)
    } catch (err) {
      console.error("Error deleting notification:", err)
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    fetchNotifications()
  }, [])

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch: fetchNotifications,
  }
}
