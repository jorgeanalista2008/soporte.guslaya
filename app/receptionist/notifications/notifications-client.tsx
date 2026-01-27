"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/lib/services/receptionist-service"
import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"
import { Bell, CheckCircle, Clock, AlertTriangle, MessageSquare, Package, Search, Filter } from "lucide-react"

function NotificationStats({
  totalCount,
  unreadCount,
  highPriorityCount,
}: {
  totalCount: number
  unreadCount: number
  highPriorityCount: number
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Notificaciones</CardTitle>
          <Bell className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCount}</div>
          <p className="text-xs text-muted-foreground">Todas las notificaciones</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sin Leer</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
          <p className="text-xs text-muted-foreground">Requieren atención</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Alta Prioridad</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{highPriorityCount}</div>
          <p className="text-xs text-muted-foreground">Urgentes</p>
        </CardContent>
      </Card>
    </div>
  )
}

function NotificationCard({
  notification,
  onMarkAsRead,
  onViewOrder,
}: {
  notification: any
  onMarkAsRead: (id: string) => void
  onViewOrder: (orderId: string) => void
}) {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order_ready":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "client_inquiry":
        return <MessageSquare className="h-5 w-5 text-blue-600" />
      case "appointment_reminder":
        return <Clock className="h-5 w-5 text-orange-600" />
      case "delay_notification":
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case "delivery_ready":
        return <Package className="h-5 w-5 text-purple-600" />
      default:
        return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Hace menos de 1 hora"
    if (diffInHours < 24) return `Hace ${diffInHours} horas`
    return `Hace ${Math.floor(diffInHours / 24)} días`
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "order_ready":
        return "Orden Lista"
      case "client_inquiry":
        return "Consulta Cliente"
      case "appointment_reminder":
        return "Recordatorio"
      case "delay_notification":
        return "Retraso"
      case "delivery_ready":
        return "Listo Entrega"
      default:
        return "Notificación"
    }
  }

  return (
    <Card
      className={`hover:shadow-md transition-shadow ${!notification.is_read ? "border-l-4 border-l-blue-500 bg-blue-50/30" : ""}`}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className={`font-semibold ${!notification.is_read ? "text-gray-900" : "text-gray-700"}`}>
                {notification.title}
              </h3>
              <Badge variant="outline" className="text-xs">
                {getTypeLabel(notification.type)}
              </Badge>
              <Badge variant={notification.priority === "high" ? "destructive" : "secondary"} className="text-xs">
                {notification.priority === "high" ? "Alta" : "Normal"}
              </Badge>
              {!notification.is_read && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
            </div>
            <p className={`mb-3 ${!notification.is_read ? "text-gray-700" : "text-gray-600"}`}>
              {notification.message}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <span>{formatTime(notification.created_at)}</span>
              {notification.order_id && <span className="font-medium">Orden: {notification.order_id}</span>}
              {notification.client_name && <span>Cliente: {notification.client_name}</span>}
            </div>
            <div className="flex gap-2">
              {notification.order_id && (
                <Button size="sm" variant="outline" onClick={() => onViewOrder(notification.order_id)}>
                  Ver Orden
                </Button>
              )}
              {!notification.is_read && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onMarkAsRead(notification.id)}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Marcar como leída
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function NotificationsClient({ userInfo }: { userInfo: any }) {
  const [notifications, setNotifications] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")

  const supabase = createClient()

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      const data = await getNotifications(supabase)
      setNotifications(data)
    } catch (error) {
      console.error("Error loading notifications:", error)
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(supabase, notificationId)
      await loadNotifications() // Reload notifications
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead(supabase)
      await loadNotifications() // Reload notifications
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  const handleViewOrder = (orderId: string) => {
    // Navigate to order details
    window.open(`/receptionist/orders?search=${orderId}`, "_blank")
  }

  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.client_name?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === "all" || notification.type === filterType
    const matchesPriority = filterPriority === "all" || notification.priority === filterPriority

    return matchesSearch && matchesType && matchesPriority
  })

  const unreadNotifications = filteredNotifications.filter((n) => !n.is_read)
  const readNotifications = filteredNotifications.filter((n) => n.is_read)
  const highPriorityCount = notifications.filter((n) => n.priority === "high" && !n.is_read).length

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Centro de Notificaciones</h1>
          <p className="text-muted-foreground">Mantente al día con las actualizaciones importantes</p>
        </div>
        <Button
          variant="outline"
          onClick={handleMarkAllAsRead}
          disabled={unreadNotifications.length === 0}
          className="flex items-center gap-2 bg-transparent"
        >
          <CheckCircle className="h-4 w-4" />
          Marcar todas como leídas
        </Button>
      </div>

      <NotificationStats
        totalCount={notifications.length}
        unreadCount={unreadNotifications.length}
        highPriorityCount={highPriorityCount}
      />

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar notificaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="order_ready">Orden Lista</SelectItem>
                <SelectItem value="client_inquiry">Consulta Cliente</SelectItem>
                <SelectItem value="appointment_reminder">Recordatorio</SelectItem>
                <SelectItem value="delay_notification">Retraso</SelectItem>
                <SelectItem value="delivery_ready">Listo Entrega</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las prioridades</SelectItem>
                <SelectItem value="high">Alta prioridad</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="low">Baja prioridad</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="unread" className="space-y-4">
        <TabsList>
          <TabsTrigger value="unread">Sin Leer ({unreadNotifications.length})</TabsTrigger>
          <TabsTrigger value="read">Leídas ({readNotifications.length})</TabsTrigger>
          <TabsTrigger value="all">Todas ({filteredNotifications.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="unread" className="space-y-4">
          {unreadNotifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay notificaciones sin leer</h3>
                <p className="text-muted-foreground text-center">
                  Todas las notificaciones están al día. Las nuevas aparecerán aquí.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {unreadNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onViewOrder={handleViewOrder}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="read" className="space-y-4">
          {readNotifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay notificaciones leídas</h3>
                <p className="text-muted-foreground text-center">
                  Las notificaciones marcadas como leídas aparecerán aquí.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {readNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onViewOrder={handleViewOrder}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Filter className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No se encontraron notificaciones</h3>
                <p className="text-muted-foreground text-center">Intenta ajustar los filtros de búsqueda.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onViewOrder={handleViewOrder}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
