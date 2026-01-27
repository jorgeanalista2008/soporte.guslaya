import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatsCard } from "@/components/dashboard/stats-card"

export default function TechnicianHistoryTest() {
  const sidebarItems = [
    {
      title: "Dashboard",
      href: "/test/technician/dashboard",
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
      href: "/test/technician/orders",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
    {
      title: "Diagnósticos",
      href: "/test/technician/diagnostics",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
    },
    {
      title: "Inventario",
      href: "/test/technician/inventory",
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
      title: "Historial",
      href: "/test/technician/history",
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
  ]

  const userInfo = {
    name: "Carlos Mendoza",
    email: "tecnico@techservice.com",
    role: "técnico",
  }

  const completedOrders = [
    {
      id: "TS-2023-156",
      client: "Roberto Silva",
      device: "Laptop Lenovo ThinkPad",
      issue: "Pantalla no enciende",
      solution: "Reemplazo de cable flex de pantalla",
      completedDate: "2024-01-10",
      timeSpent: "2.5 horas",
      rating: 5,
      cost: 85.0,
    },
    {
      id: "TS-2023-155",
      client: "Carmen Ruiz",
      device: "PC Desktop HP",
      issue: "No arranca el sistema",
      solution: "Reemplazo de fuente de poder defectuosa",
      completedDate: "2024-01-09",
      timeSpent: "1.5 horas",
      rating: 5,
      cost: 120.0,
    },
    {
      id: "TS-2023-154",
      client: "Miguel Torres",
      device: "MacBook Air",
      issue: "Teclado no responde",
      solution: "Limpieza profunda y reemplazo de 3 teclas",
      completedDate: "2024-01-08",
      timeSpent: "3 horas",
      rating: 4,
      cost: 95.0,
    },
    {
      id: "TS-2023-153",
      client: "Laura Mendez",
      device: "Tablet Samsung",
      issue: "Batería no carga",
      solution: "Reemplazo de batería y puerto de carga",
      completedDate: "2024-01-05",
      timeSpent: "2 horas",
      rating: 5,
      cost: 110.0,
    },
    {
      id: "TS-2023-152",
      client: "Diego Vargas",
      device: "Laptop ASUS",
      issue: "Sobrecalentamiento",
      solution: "Limpieza de ventiladores y cambio de pasta térmica",
      completedDate: "2024-01-03",
      timeSpent: "1.5 horas",
      rating: 5,
      cost: 65.0,
    },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar items={sidebarItems} userInfo={userInfo} />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Historial de Trabajos</h1>
            <p className="text-gray-600">Registro de todos los trabajos completados y estadísticas de rendimiento</p>
          </div>

          {/* Performance Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Trabajos Completados"
              value="156"
              description="Total este año"
              trend={{ value: 12, isPositive: true }}
            />
            <StatsCard
              title="Calificación Promedio"
              value="4.8"
              description="De 5 estrellas"
              trend={{ value: 5, isPositive: true }}
            />
            <StatsCard
              title="Tiempo Promedio"
              value="2.1h"
              description="Por reparación"
              trend={{ value: 8, isPositive: true }}
            />
            <StatsCard
              title="Ingresos Generados"
              value="$14,250"
              description="Este año"
              trend={{ value: 15, isPositive: true }}
            />
          </div>

          {/* Completed Orders History */}
          <Card>
            <CardHeader>
              <CardTitle>Trabajos Completados Recientes</CardTitle>
              <CardDescription>Historial de reparaciones finalizadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-green-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-medium text-gray-900">{order.id}</span>
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Completado
                        </Badge>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < order.rating ? "text-yellow-400" : "text-gray-300"}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Cliente:</strong> {order.client}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Dispositivo:</strong> {order.device}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Problema:</strong> {order.issue}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Solución:</strong> {order.solution}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">${order.cost}</p>
                      <p className="text-sm text-gray-500">{order.timeSpent}</p>
                      <p className="text-sm text-gray-500">{order.completedDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
