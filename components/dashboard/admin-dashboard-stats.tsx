"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ClipboardList, Clock, AlertCircle, CheckCircle, XCircle, Users, Wrench, ArrowRight } from "lucide-react"

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

interface AdminDashboardStatsProps {
  stats: Array<{
    label: string
    value: number
  }>
  orders: OrderWithDetails[] // Agregando prop orders para datos reales
}

export function AdminDashboardStats({ stats, orders }: AdminDashboardStatsProps) {
  const [selectedCard, setSelectedCard] = useState<number | null>(null)
  const router = useRouter()

  const getFilteredOrders = (status?: string) => {
    if (!status) return orders.slice(0, 5) // Todas las órdenes, últimas 5
    return orders.filter((order) => order.status === status).slice(0, 5)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "in_progress":
        return "default"
      case "completed":
        return "default"
      case "delivered":
        return "outline"
      case "cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const translateStatus = (status: string) => {
    const translations: { [key: string]: string } = {
      pending: "Pendiente",
      in_progress: "En Progreso",
      completed: "Completada",
      delivered: "Entregada",
      cancelled: "Cancelada",
    }
    return translations[status] || status
  }

  const icons = [
    <ClipboardList key="orders" className="w-6 h-6" />,
    <Clock key="active" className="w-6 h-6" />,
    <Clock key="pending" className="w-6 h-6" />,
    <AlertCircle key="progress" className="w-6 h-6" />,
    <CheckCircle key="completed" className="w-6 h-6" />,
    <XCircle key="delivered" className="w-6 h-6" />,
    <Users key="clients" className="w-6 h-6" />,
    <Wrench key="technicians" className="w-6 h-6" />,
  ]

  const handleNavigation = (path: string) => {
    router.push(path)
    setSelectedCard(null) // Cerrar el dialog
  }

  const getDialogContent = (index: number) => {
    const stat = stats[index]
    const icon = icons[index]

    switch (index) {
      case 0: // Órdenes Totales
        return {
          title: "Órdenes Totales",
          content: (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                  {icon}
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">Total de órdenes registradas</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Últimas 5 órdenes registradas:</h4>
                <div className="space-y-3">
                  {getFilteredOrders().map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">#{order.order_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.client?.full_name || "Cliente desconocido"}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
                      </div>
                      <Badge variant={getStatusBadgeVariant(order.status)}>{translateStatus(order.status)}</Badge>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t">
                  <Button onClick={() => handleNavigation("/admin/orders")} className="w-full" variant="outline">
                    Ver todas las órdenes
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          ),
        }
      case 1: // Órdenes Activas
        return {
          title: "Órdenes Activas",
          content: (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                  {icon}
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">Órdenes en progreso</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Últimas 5 órdenes activas:</h4>
                <div className="space-y-3">
                  {orders
                    .filter((order) => !["completed", "delivered", "cancelled"].includes(order.status))
                    .slice(0, 5)
                    .map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="space-y-1">
                          <p className="font-medium">#{order.order_number}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.client?.full_name || "Cliente desconocido"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Técnico: {order.technician?.full_name || "No asignado"}
                          </p>
                          <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
                        </div>
                        <Badge variant={getStatusBadgeVariant(order.status)}>{translateStatus(order.status)}</Badge>
                      </div>
                    ))}
                </div>
                <div className="pt-4 border-t">
                  <Button onClick={() => handleNavigation("/admin/orders")} className="w-full" variant="outline">
                    Ver todas las órdenes
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          ),
        }
      case 2: // Órdenes Pendientes
        return {
          title: "Órdenes Pendientes",
          content: (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                  {icon}
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">Órdenes pendientes de asignación</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Últimas 5 órdenes pendientes:</h4>
                <div className="space-y-3">
                  {getFilteredOrders("pending").map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">#{order.order_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.client?.full_name || "Cliente desconocido"}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
                      </div>
                      <Badge variant="secondary">Pendiente</Badge>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t">
                  <Button onClick={() => handleNavigation("/admin/orders")} className="w-full" variant="outline">
                    Ver todas las órdenes
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          ),
        }
      case 3: // Órdenes En Progreso
        return {
          title: "Órdenes En Progreso",
          content: (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                  {icon}
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">Órdenes siendo trabajadas</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Últimas 5 órdenes en progreso:</h4>
                <div className="space-y-3">
                  {getFilteredOrders("in_progress").map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">#{order.order_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.client?.full_name || "Cliente desconocido"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Técnico: {order.technician?.full_name || "No asignado"}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
                      </div>
                      <Badge variant="default">En Progreso</Badge>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t">
                  <Button onClick={() => handleNavigation("/admin/orders")} className="w-full" variant="outline">
                    Ver todas las órdenes
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          ),
        }
      case 4: // Órdenes Completadas
        return {
          title: "Órdenes Completadas",
          content: (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400">
                  {icon}
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">Órdenes completadas y listas para entrega</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Últimas 5 órdenes completadas:</h4>
                <div className="space-y-3">
                  {getFilteredOrders("completed").map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">#{order.order_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.client?.full_name || "Cliente desconocido"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Técnico: {order.technician?.full_name || "No asignado"}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
                      </div>
                      <Badge variant="default">Completada</Badge>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t">
                  <Button onClick={() => handleNavigation("/admin/orders")} className="w-full" variant="outline">
                    Ver todas las órdenes
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          ),
        }
      case 5: // Órdenes Entregadas
        return {
          title: "Órdenes Entregadas",
          content: (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-50 dark:bg-gray-900/20 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400">
                  {icon}
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">Órdenes entregadas exitosamente</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Últimas 5 órdenes entregadas:</h4>
                <div className="space-y-3">
                  {getFilteredOrders("delivered").map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">#{order.order_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.client?.full_name || "Cliente desconocido"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Técnico: {order.technician?.full_name || "No asignado"}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
                      </div>
                      <Badge variant="outline">Entregada</Badge>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t">
                  <Button onClick={() => handleNavigation("/admin/orders")} className="w-full" variant="outline">
                    Ver todas las órdenes
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          ),
        }
      case 6: // Clientes
        return {
          title: "Clientes",
          content: (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                  {icon}
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">Clientes registrados</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-lg font-semibold text-green-600">Activos</p>
                  <p className="text-sm text-muted-foreground">Con órdenes recientes</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-600">Nuevos</p>
                  <p className="text-sm text-muted-foreground">Registrados este mes</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Últimos 5 clientes registrados</h4>
                <div className="space-y-2">
                  {orders
                    .filter((order) => order.client)
                    .slice(0, 5)
                    .map((order) => (
                      <div
                        key={order.id}
                        className="flex justify-between items-center text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded"
                      >
                        <div>
                          <p className="font-medium">{order.client?.full_name}</p>
                          <p className="text-muted-foreground">{order.client?.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="pt-4 border-t">
                  <Button onClick={() => handleNavigation("/admin/clients")} className="w-full" variant="outline">
                    Ver todos los clientes
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          ),
        }
      case 7: // Técnicos
        return {
          title: "Técnicos",
          content: (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                  {icon}
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">Técnicos disponibles</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-lg font-semibold text-green-600">Disponibles</p>
                  <p className="text-sm text-muted-foreground">Listos para asignación</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-orange-600">Ocupados</p>
                  <p className="text-sm text-muted-foreground">Con órdenes asignadas</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Últimos 5 técnicos registrados</h4>
                <div className="space-y-2">
                  {orders
                    .filter((order) => order.technician)
                    .slice(0, 5)
                    .map((order) => (
                      <div
                        key={order.id}
                        className="flex justify-between items-center text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded"
                      >
                        <div>
                          <p className="font-medium">{order.technician?.full_name}</p>
                          <p className="text-muted-foreground">{order.technician?.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="pt-4 border-t">
                  <Button onClick={() => handleNavigation("/admin/users")} className="w-full" variant="outline">
                    Ver todos los usuarios
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          ),
        }
      default:
        return { title: stat.label, content: <p>Información no disponible</p> }
    }
  }

  return (
    <>
      <TooltipProvider>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            if (index === 2) {
              return (
                <Tooltip key={stat.label}>
                  <TooltipTrigger asChild>
                    <div>
                      <StatsCard
                        title={stat.label}
                        value={stat.value}
                        icon={icons[index]}
                        onClick={() => setSelectedCard(index)}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="font-medium">Órdenes Pendientes o en proceso de reparación</p>
                    <p className="text-sm mt-1">
                      Una orden en reparación puede tener los siguientes estados: 'received', 'diagnosis',
                      'waiting_parts', 'repair', 'testing'
                    </p>
                  </TooltipContent>
                </Tooltip>
              )
            }
            return (
              <StatsCard
                key={stat.label}
                title={stat.label}
                value={stat.value}
                icon={icons[index]}
                onClick={() => setSelectedCard(index)}
              />
            )
          })}
        </div>
      </TooltipProvider>

      <Dialog open={selectedCard !== null} onOpenChange={() => setSelectedCard(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedCard !== null ? getDialogContent(selectedCard).title : ""}</DialogTitle>
          </DialogHeader>
          {selectedCard !== null && getDialogContent(selectedCard).content}
        </DialogContent>
      </Dialog>
    </>
  )
}
