import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wrench, ClipboardList, Package, BarChart3, History } from "lucide-react"

export default function TechnicianDashboardTest() {
  const sidebarItems = [
    { title: "Dashboard", href: "/test/technician/dashboard", icon: <BarChart3 className="h-4 w-4" /> },
    { title: "Órdenes", href: "/test/technician/orders", icon: <ClipboardList className="h-4 w-4" /> },
    { title: "Diagnósticos", href: "/test/technician/diagnostics", icon: <Wrench className="h-4 w-4" /> },
    { title: "Inventario", href: "/test/technician/inventory", icon: <Package className="h-4 w-4" /> },
    { title: "Historial", href: "/test/technician/history", icon: <History className="h-4 w-4" /> },
  ]

  const userInfo = {
    name: "Carlos Mendoza",
    email: "carlos@fixtec.com",
    role: "Técnico",
  }

  const recentOrders = [
    {
      id: "TS-2024-001",
      client: "María García",
      device: "Laptop HP",
      issue: "No enciende",
      priority: "Alta",
      status: "En Progreso",
    },
    {
      id: "TS-2024-002",
      client: "Juan Pérez",
      device: "PC Desktop",
      issue: "Lento",
      priority: "Media",
      status: "Diagnóstico",
    },
    {
      id: "TS-2024-003",
      client: "Ana López",
      device: "MacBook",
      issue: "Pantalla rota",
      priority: "Alta",
      status: "Esperando Repuesto",
    },
    {
      id: "TS-2024-004",
      client: "Luis Torres",
      device: "Tablet",
      issue: "No carga",
      priority: "Baja",
      status: "En Progreso",
    },
  ]

  return (
    <DashboardLayout sidebarItems={sidebarItems} userInfo={userInfo}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard del Técnico</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Bienvenido, Carlos Mendoza. Aquí tienes un resumen de tu trabajo.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Órdenes Asignadas"
              value="12"
              description="Órdenes activas"
              trend={{ value: 8, isPositive: true }}
            />
            <StatsCard
              title="Completadas Hoy"
              value="3"
              description="Trabajos finalizados"
              trend={{ value: 15, isPositive: true }}
            />
            <StatsCard
              title="En Progreso"
              value="7"
              description="Trabajos activos"
              trend={{ value: 2, isPositive: false }}
            />
            <StatsCard
              title="Tiempo Promedio"
              value="2.5h"
              description="Por reparación"
              trend={{ value: 10, isPositive: true }}
            />
          </div>

          {/* Recent Orders */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="dark:text-white">Mis Órdenes Recientes</CardTitle>
              <CardDescription className="dark:text-gray-300">Órdenes de servicio asignadas a ti</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">{order.id}</span>
                        <Badge
                          variant={
                            order.priority === "Alta"
                              ? "destructive"
                              : order.priority === "Media"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {order.priority}
                        </Badge>
                        <Badge variant="outline" className="dark:border-gray-500 dark:text-gray-300">
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                        <strong>Cliente:</strong> {order.client}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                        <strong>Dispositivo:</strong> {order.device}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <strong>Problema:</strong> {order.issue}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-sm bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-800">
                        Ver Detalles
                      </button>
                      <button className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800">
                        Actualizar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
