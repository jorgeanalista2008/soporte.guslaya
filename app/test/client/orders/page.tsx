import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const clientSidebarItems = [
  {
    title: "Dashboard",
    href: "/test/client",
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
    title: "Mis Órdenes",
    href: "/test/client/orders",
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
    title: "Nueva Solicitud",
    href: "/test/client/new-request",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    title: "Historial",
    href: "/test/client/history",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "Perfil",
    href: "/test/client/profile",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  },
]

export default function TestClientOrders() {
  const mockOrders = [
    {
      id: "ORD-001",
      device: "Laptop Dell Inspiron 15",
      issue: "No enciende, posible problema con la fuente",
      status: "En diagnóstico",
      priority: "Alta",
      technician: "Carlos Rodríguez",
      createdAt: "2024-01-15",
      estimatedCompletion: "2024-01-18",
      cost: 150,
    },
    {
      id: "ORD-002",
      device: "iPhone 12 Pro",
      issue: "Pantalla rota después de caída",
      status: "Esperando repuestos",
      priority: "Media",
      technician: "Ana García",
      createdAt: "2024-01-14",
      estimatedCompletion: "2024-01-20",
      cost: 280,
    },
    {
      id: "ORD-003",
      device: "MacBook Air M1",
      issue: "Teclado no responde correctamente",
      status: "Completado",
      priority: "Baja",
      technician: "Luis Martínez",
      createdAt: "2024-01-10",
      completedAt: "2024-01-12",
      cost: 120,
    },
    {
      id: "ORD-004",
      device: "Samsung Galaxy S21",
      issue: "Batería se agota muy rápido",
      status: "En reparación",
      priority: "Media",
      technician: "María López",
      createdAt: "2024-01-12",
      estimatedCompletion: "2024-01-16",
      cost: 90,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completado":
        return "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400"
      case "En reparación":
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400"
      case "En diagnóstico":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400"
      case "Esperando repuestos":
        return "bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400"
      default:
        return "bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta":
        return "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400"
      case "Media":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400"
      case "Baja":
        return "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400"
      default:
        return "bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400"
    }
  }

  return (
    <DashboardLayout
      sidebarItems={clientSidebarItems}
      userInfo={{
        name: "Cliente Demo",
        email: "cliente@example.com",
        role: "client",
      }}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mis Órdenes</h1>
            <p className="text-gray-600 dark:text-gray-400">Gestiona y da seguimiento a tus solicitudes de servicio</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium">
              Modo Demo
            </div>
            <Button>Nueva Solicitud</Button>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {mockOrders.map((order) => (
            <Card key={order.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CardTitle className="text-lg text-gray-900 dark:text-white">{order.id}</CardTitle>
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    <Badge className={getPriorityColor(order.priority)}>{order.priority}</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">${order.cost}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 bg-transparent"
                    >
                      Ver Detalles
                    </Button>
                  </div>
                </div>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Creado el {order.createdAt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Dispositivo</p>
                    <p className="font-medium text-gray-900 dark:text-white">{order.device}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Problema</p>
                    <p className="font-medium text-gray-900 dark:text-white">{order.issue}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Técnico Asignado</p>
                    <p className="font-medium text-gray-900 dark:text-white">{order.technician}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {order.status === "Completado" ? "Completado" : "Estimado"}
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {order.status === "Completado" ? order.completedAt : order.estimatedCompletion}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
