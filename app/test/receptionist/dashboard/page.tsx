import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Users, ClipboardList, TrendingUp, Clock, AlertCircle } from "lucide-react"

const DashboardPage = () => {
  const sidebarItems = [
    { title: "Dashboard", href: "/test/receptionist/dashboard", icon: <Package className="h-4 w-4" /> },
    { title: "Nueva Orden", href: "/test/receptionist/new-order", icon: <ClipboardList className="h-4 w-4" /> },
    { title: "Órdenes", href: "/test/receptionist/orders", icon: <Package className="h-4 w-4" /> },
    { title: "Entregas", href: "/test/receptionist/deliveries", icon: <TrendingUp className="h-4 w-4" /> },
    { title: "Notificaciones", href: "/test/receptionist/notifications", icon: <AlertCircle className="h-4 w-4" /> },
    { title: "Clientes", href: "/test/receptionist/clients", icon: <Users className="h-4 w-4" /> },
  ]

  const userInfo = {
    name: "María González",
    email: "maria@fixtec.com",
    role: "Recepcionista",
  }

  const mockOrders = [
    { id: "ORD-001", client: "Juan Pérez", device: "iPhone 12", status: "Pendiente", priority: "Alta" },
    { id: "ORD-002", client: "Ana López", device: "Samsung Galaxy", status: "En Proceso", priority: "Media" },
    { id: "ORD-003", client: "Carlos Ruiz", device: "MacBook Pro", status: "Completado", priority: "Baja" },
  ]

  return (
    <DashboardLayout sidebarItems={sidebarItems} userInfo={userInfo}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Recepcionista</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Gestiona órdenes y clientes</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <ClipboardList className="h-4 w-4 mr-2" />
              Nueva Orden
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Órdenes Hoy"
              value="12"
              change="+8%"
              icon={<ClipboardList className="h-6 w-6" />}
              trend="up"
            />
            <StatsCard
              title="Clientes Atendidos"
              value="45"
              change="+12%"
              icon={<Users className="h-6 w-6" />}
              trend="up"
            />
            <StatsCard
              title="Entregas Pendientes"
              value="8"
              change="-3%"
              icon={<Package className="h-6 w-6" />}
              trend="down"
            />
            <StatsCard
              title="Satisfacción"
              value="98%"
              change="+2%"
              icon={<TrendingUp className="h-6 w-6" />}
              trend="up"
            />
          </div>

          {/* Recent Orders */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Órdenes Recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{order.id}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {order.client} - {order.device}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={order.status === "Completado" ? "default" : "secondary"}>{order.status}</Badge>
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

export default DashboardPage
