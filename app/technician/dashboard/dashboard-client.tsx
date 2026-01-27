"use client"

import { useState } from "react"
import { TechnicianLayout } from "@/components/technician/technician-layout"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { OrderStatusBadge } from "@/components/orders/order-status-badge"
import { PriorityBadge } from "@/components/orders/priority-badge"
import { OrderDetailsDialog } from "@/components/orders/order-details-dialog"
import { OrderStatusUpdateDialog } from "@/components/orders/order-status-update-dialog"
import { TechnicianOrderCreationWizard } from "@/components/technician/order-creation-wizard"
import Link from "next/link"
import { toast } from "sonner"
import type { Profile, OrderWithDetails } from "@/types"
import { createClient } from "@/lib/supabase/client"
import { Wand2 } from "lucide-react"

interface TechnicianDashboardClientProps {
  profile: Profile
  allMyOrders: any[]
  activeOrders: any[]
  stats: {
    totalAssigned: number
    completedToday: number
    inProgress: number
    pending: number
  }
}

export default function TechnicianDashboardClient({
  profile,
  allMyOrders,
  activeOrders,
  stats,
}: TechnicianDashboardClientProps) {
  const [orders, setOrders] = useState(allMyOrders)
  const [active, setActive] = useState(activeOrders)
  const [currentStats, setCurrentStats] = useState(stats)
  const [loading, setLoading] = useState(false)

  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [statusUpdateDialogOpen, setStatusUpdateDialogOpen] = useState(false)
  const [isWizardOpen, setIsWizardOpen] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        console.log("[v0] No user found")
        return
      }

      const { data: ordersData, error: ordersError } = await supabase
        .from("service_orders")
        .select("*")
        .eq("technician_id", user.id)

      if (ordersError) {
        console.error("[v0] Orders fetch error:", ordersError.message)
        toast.error("Error al cargar las órdenes")
        return
      }

      const { data: activeOrdersData, error: activeError } = await supabase
        .from("service_orders")
        .select(`
          *,
          client:profiles!service_orders_client_id_fkey(full_name, email),
          equipment:equipments(equipment_type, brand, model),
          technician:profiles!service_orders_technician_id_fkey(id, full_name, email)
        `)
        .eq("technician_id", user.id)
        .in("status", ["received", "diagnosis", "repair", "testing", "waiting_parts"])
        .order("received_date", { ascending: false })
        .limit(5)

      if (activeError) {
        console.error("[v0] Active orders fetch error:", activeError.message)
        toast.error("Error al cargar las órdenes activas")
        return
      }

      const allOrders = ordersData || []
      const activeOrders = activeOrdersData || []

      const totalAssigned = allOrders.length
      const inProgress = allOrders.filter((o) => ["diagnosis", "repair", "testing"].includes(o.status)).length
      const pending = allOrders.filter((o) => o.status === "received").length

      const today = new Date().toISOString().split("T")[0]
      const completedToday = allOrders.filter(
        (o) => o.status === "completed" && o.completed_date && o.completed_date.startsWith(today),
      ).length

      setOrders(allOrders)
      setActive(activeOrders)
      setCurrentStats({
        totalAssigned,
        completedToday,
        inProgress,
        pending,
      })

      console.log("[v0] Dashboard data refreshed successfully")
    } catch (error) {
      console.error("[v0] Error loading data:", error)
      toast.error("Error al actualizar los datos")
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (order: any) => {
    const transformedOrder: OrderWithDetails = {
      id: order.id,
      order_number: order.order_number,
      client_id: order.client_id,
      device_type: order.device_type || order.equipment?.equipment_type,
      brand: order.brand || order.equipment?.brand,
      model: order.model || order.equipment?.model,
      problem_description: order.problem_description,
      status: order.status,
      priority: order.priority,
      received_date: order.received_date,
      estimated_cost: order.estimated_cost,
      final_cost: order.final_cost,
      commission_total: order.commission_total,
      client: order.client,
      equipment: order.equipment,
      profiles: order.profiles,
      technician: order.technician,
    }

    setSelectedOrder(transformedOrder)
    setDetailsDialogOpen(true)
  }

  const handleUpdateStatus = (order: any) => {
    const transformedOrder: OrderWithDetails = {
      id: order.id,
      order_number: order.order_number,
      client_id: order.client_id,
      device_type: order.device_type || order.equipment?.equipment_type,
      brand: order.brand || order.equipment?.brand,
      model: order.model || order.equipment?.model,
      problem_description: order.problem_description,
      status: order.status,
      priority: order.priority,
      received_date: order.received_date,
      estimated_cost: order.estimated_cost,
      final_cost: order.final_cost,
      commission_total: order.commission_total,
      client: order.client,
      equipment: order.equipment,
      profiles: order.profiles,
      technician: order.technician,
    }

    setSelectedOrder(transformedOrder)
    setStatusUpdateDialogOpen(true)
  }

  const handleStatusUpdateSuccess = () => {
    toast.success("Estado actualizado correctamente")
    loadData()
  }

  return (
    <TechnicianLayout
      userInfo={{
        name: profile.full_name,
        email: profile.email,
        role: profile.role,
      }}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Bienvenido, {profile.full_name}</h1>
          <p className="text-gray-600 dark:text-gray-300">Aquí tienes un resumen de tu trabajo y órdenes asignadas</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Órdenes Asignadas"
            value={currentStats.totalAssigned}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            }
          />
          <StatsCard
            title="Completadas Hoy"
            value={currentStats.completedToday}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
          <StatsCard
            title="En Progreso"
            value={currentStats.inProgress}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
          <StatsCard
            title="Pendientes"
            value={currentStats.pending}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
        </div>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="dark:text-white">Mis Órdenes Activas</CardTitle>
                <CardDescription className="dark:text-gray-300">
                  Órdenes de servicio asignadas que requieren tu atención
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={loadData} disabled={loading}>
                  {loading ? "Actualizando..." : "Actualizar"}
                </Button>
                <Link href="/technician/orders">
                  <Button variant="outline" size="sm">
                    Ver Todas
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {active.length > 0 ? (
              <div className="space-y-4">
                {active.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">{order.order_number}</span>
                        <PriorityBadge priority={order.priority} />
                        <OrderStatusBadge status={order.status} />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                        <strong>Cliente:</strong> {order.client?.full_name || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                        <strong>Dispositivo:</strong> {order.equipment?.equipment_type || order.device_type}{" "}
                        {order.equipment?.brand || order.brand} {order.equipment?.model || order.model}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <strong>Problema:</strong> {order.problem_description}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(order)}>
                        Ver Detalles
                      </Button>
                      <Button size="sm" onClick={() => handleUpdateStatus(order)}>
                        Actualizar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg
                  className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
                <p className="text-gray-500 dark:text-gray-400 mb-2">No tienes órdenes activas</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Las nuevas órdenes asignadas aparecerán aquí</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
            <CardHeader>
              <CardTitle className="text-purple-900 dark:text-purple-100 flex items-center gap-2">
                <Wand2 className="w-5 h-5" />
                Asistente de Órdenes
              </CardTitle>
              <CardDescription className="text-purple-700 dark:text-purple-300">
                Crear orden paso a paso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => setIsWizardOpen(true)}>
                Iniciar
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Mis Órdenes</CardTitle>
              <CardDescription className="dark:text-gray-300">Gestiona todas tus órdenes asignadas</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/technician/orders">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Ver Órdenes</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Historial</CardTitle>
              <CardDescription className="dark:text-gray-300">Consulta el historial de servicios</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/technician/history">
                <Button className="w-full bg-orange-600 hover:bg-orange-700">Ver Historial</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Inventario</CardTitle>
              <CardDescription className="dark:text-gray-300">Consulta partes y repuestos</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/technician/inventory">
                <Button className="w-full bg-green-600 hover:bg-green-700">Ver Inventario</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {selectedOrder && (
          <>
            <OrderDetailsDialog order={selectedOrder} open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen} />
            <OrderStatusUpdateDialog
              order={selectedOrder}
              open={statusUpdateDialogOpen}
              onOpenChange={setStatusUpdateDialogOpen}
              onSuccess={handleStatusUpdateSuccess}
            />
          </>
        )}

        <TechnicianOrderCreationWizard
          isOpen={isWizardOpen}
          onClose={() => setIsWizardOpen(false)}
          onOrderCreated={(orderId) => {
            console.log("[v0] Order created:", orderId)
            setIsWizardOpen(false)
            loadData()
          }}
          technicianId={profile.id}
        />
      </div>
    </TechnicianLayout>
  )
}
