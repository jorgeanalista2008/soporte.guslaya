import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const receptionistSidebarItems = [
  {
    title: "Dashboard",
    href: "/test/receptionist/dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
        />
      </svg>
    ),
  },
  {
    title: "Nueva Orden",
    href: "/test/receptionist/new-order",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
  },
  {
    title: "Órdenes",
    href: "/test/receptionist/orders",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    title: "Entregas",
    href: "/test/receptionist/deliveries",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
    ),
  },
  {
    title: "Notificaciones",
    href: "/test/receptionist/notifications",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-5 5v-5zM11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
        />
      </svg>
    ),
  },
  {
    title: "Clientes",
    href: "/test/receptionist/clients",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
]

export default function TestNotificationsPage() {
  const mockNotifications = [
    {
      id: 1,
      type: "delivery_ready",
      title: "Equipo listo para entrega",
      message: "El MacBook Pro de Carlos Rodríguez está listo para ser entregado",
      orderId: "ORD-004",
      client: "Carlos Rodríguez",
      timestamp: "2024-01-15T10:30:00Z",
      read: false,
      priority: "high",
    },
    {
      id: 2,
      type: "client_inquiry",
      title: "Consulta de cliente",
      message: "María González pregunta por el estado de su HP Pavilion 15",
      orderId: "ORD-001",
      client: "María González",
      timestamp: "2024-01-15T09:15:00Z",
      read: false,
      priority: "medium",
    },
    {
      id: 3,
      type: "payment_pending",
      title: "Pago pendiente",
      message: "La orden ORD-003 de Ana Martínez tiene un pago pendiente de $120.00",
      orderId: "ORD-003",
      client: "Ana Martínez",
      timestamp: "2024-01-15T08:45:00Z",
      read: true,
      priority: "high",
    },
    {
      id: 4,
      type: "new_order",
      title: "Nueva orden recibida",
      message: "Se ha registrado una nueva orden para reparación de iPhone 12",
      orderId: "ORD-009",
      client: "Pedro Sánchez",
      timestamp: "2024-01-14T16:20:00Z",
      read: true,
      priority: "low",
    },
    {
      id: 5,
      type: "appointment_reminder",
      title: "Recordatorio de cita",
      message: "Laura Gómez tiene cita programada para recoger su Samsung Galaxy S21 mañana a las 2:00 PM",
      orderId: "ORD-005",
      client: "Laura Gómez",
      timestamp: "2024-01-14T14:00:00Z",
      read: true,
      priority: "medium",
    },
  ]

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "delivery_ready":
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )
      case "client_inquiry":
        return (
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )
      case "payment_pending":
        return (
          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
            />
          </svg>
        )
      case "new_order":
        return (
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        )
      case "appointment_reminder":
        return (
          <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-5 5v-5zM11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
            />
          </svg>
        )
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500 bg-red-50"
      case "medium":
        return "border-l-yellow-500 bg-yellow-50"
      case "low":
        return "border-l-green-500 bg-green-50"
      default:
        return "border-l-gray-500 bg-gray-50"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return "Hace menos de 1 hora"
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours} horas`
    } else {
      return date.toLocaleDateString()
    }
  }

  const unreadCount = mockNotifications.filter((n) => !n.read).length

  return (
    <DashboardLayout
      sidebarItems={receptionistSidebarItems}
      userInfo={{
        name: "Recepcionista Demo",
        email: "recepcion@techservice.com",
        role: "receptionist",
      }}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Centro de Notificaciones</h1>
            <p className="text-gray-600">
              Gestiona comunicaciones y alertas del sistema
              {unreadCount > 0 && (
                <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {unreadCount} sin leer
                </span>
              )}
            </p>
          </div>
          <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">Modo Demo</div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <Input placeholder="Buscar notificaciones..." className="flex-1 min-w-64" />
            <select className="px-3 py-2 border border-gray-300 rounded-md">
              <option value="">Todos los tipos</option>
              <option value="delivery_ready">Listo para entrega</option>
              <option value="client_inquiry">Consulta de cliente</option>
              <option value="payment_pending">Pago pendiente</option>
              <option value="new_order">Nueva orden</option>
              <option value="appointment_reminder">Recordatorio</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-md">
              <option value="">Todas</option>
              <option value="unread">Sin leer</option>
              <option value="read">Leídas</option>
            </select>
            <Button variant="outline" size="sm">
              Marcar todas como leídas
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {mockNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-lg border-l-4 border border-gray-200 p-6 ${getPriorityColor(notification.priority)} ${
                !notification.read ? "shadow-md" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className={`text-lg font-medium ${!notification.read ? "text-gray-900" : "text-gray-700"}`}>
                        {notification.title}
                      </h3>
                      {!notification.read && <span className="w-2 h-2 bg-blue-600 rounded-full"></span>}
                    </div>
                    <p className="text-gray-600 mt-1">{notification.message}</p>
                    <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                      <span>Orden: {notification.orderId}</span>
                      <span>Cliente: {notification.client}</span>
                      <span>{formatTimestamp(notification.timestamp)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      notification.priority === "high"
                        ? "bg-red-100 text-red-800"
                        : notification.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {notification.priority === "high" ? "Alta" : notification.priority === "medium" ? "Media" : "Baja"}
                  </span>
                  <Button variant="ghost" size="sm">
                    Ver Orden
                  </Button>
                  {!notification.read && (
                    <Button variant="outline" size="sm">
                      Marcar como leída
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State (if no notifications) */}
        {mockNotifications.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-5 5v-5zM11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay notificaciones</h3>
            <p className="text-gray-600">Todas las notificaciones aparecerán aquí</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
