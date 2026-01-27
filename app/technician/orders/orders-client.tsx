"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { TechnicianLayout } from "@/components/technician/technician-layout"
import { OrdersTable } from "@/components/orders/orders-table"
import { OrderDetailsDialog } from "@/components/orders/order-details-dialog"
import { OrderStatusUpdateDialog } from "@/components/orders/order-status-update-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import type { Profile, OrderWithDetails } from "@/types"

interface TechnicianOrdersClientProps {
  initialOrders: any[]
  profile: Profile
}

export default function TechnicianOrdersClient({ initialOrders, profile }: TechnicianOrdersClientProps) {
  const [orders, setOrders] = useState<OrderWithDetails[]>(
    initialOrders.map((order) => ({
      id: order.id,
      order_number: order.order_number,
      client_id: order.client_id,
      device_type: order.device_type,
      brand: order.brand,
      model: order.model,
      problem_description: order.problem_description,
      status: order.status,
      priority: order.priority,
      received_date: order.received_date,
      estimated_cost: order.estimated_cost,
      final_cost: order.final_cost,
      commission_total: order.commission_total,
      client: order.client,
      equipment: order.equipment,
      technician: order.technician, // Added technician to mapped data
      profiles: order.profiles,
    })),
  )
  const [loading, setLoading] = useState(false)

  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [statusUpdateDialogOpen, setStatusUpdateDialogOpen] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast.error("No se pudo obtener la información del usuario")
        return
      }

      const { data: myOrders, error: ordersError } = await supabase
        .from("service_orders")
        .select(`
          *,
          client:profiles!service_orders_client_id_fkey(full_name, email, phone),
          technician:profiles!service_orders_technician_id_fkey(id, full_name, email),
          equipment:equipments(equipment_type, brand, model)
        `)
        .eq("technician_id", user.id)
        .order("received_date", { ascending: false })

      if (ordersError) {
        console.error("Error loading orders:", ordersError)
        toast.error("Error al cargar las órdenes: " + ordersError.message)
        return
      }

      // Transform data to match OrdersTable interface
      const transformedOrders =
        myOrders?.map((order) => ({
          id: order.id,
          order_number: order.order_number,
          client_id: order.client_id,
          device_type: order.device_type,
          brand: order.brand,
          model: order.model,
          problem_description: order.problem_description,
          status: order.status,
          priority: order.priority,
          received_date: order.received_date,
          estimated_cost: order.estimated_cost,
          final_cost: order.final_cost,
          commission_total: order.commission_total,
          client: order.client,
          equipment: order.equipment,
          technician: order.technician, // Added technician to transformed data
          profiles: null,
        })) || []

      setOrders(transformedOrders)
      toast.success("Datos actualizados correctamente")
    } catch (error) {
      console.error("Error loading data:", error)
      toast.error("Error al cargar los datos")
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (order: OrderWithDetails) => {
    setSelectedOrder(order)
    setDetailsDialogOpen(true)
  }

  const handleUpdateStatus = (order: OrderWithDetails) => {
    setSelectedOrder(order)
    setStatusUpdateDialogOpen(true)
  }

  const handleStatusUpdateSuccess = () => {
    loadData()
  }

  // Calculate stats
  const totalOrders = orders.length
  const inProgress = orders.filter((o) => ["in_diagnosis", "in_repair", "testing"].includes(o.status)).length
  const pending = orders.filter((o) => o.status === "received").length
  const waitingParts = orders.filter((o) => o.status === "waiting_parts").length
  const completed = orders.filter((o) => o.status === "completed").length

  console.log("[v0] Rendering with orders:", totalOrders)

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Mis Órdenes de Servicio</h1>
          <p className="text-gray-600 dark:text-gray-300">Gestiona todas las órdenes de servicio asignadas a ti</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Asignadas</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{totalOrders}</p>
                </div>
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">En Progreso</p>
                  <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{inProgress}</p>
                </div>
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-800 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-yellow-600 dark:text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Pendientes</p>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{pending}</p>
                </div>
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-800 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-orange-600 dark:text-orange-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Esperando Repuestos</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{waitingParts}</p>
                </div>
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-purple-600 dark:text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Completadas</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">{completed}</p>
                </div>
                <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="dark:text-white">Órdenes Asignadas</CardTitle>
                <CardDescription className="dark:text-gray-300">
                  Lista completa de órdenes de servicio asignadas a ti
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={loadData} disabled={loading}>
                  {loading ? "Actualizando..." : "Actualizar"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {orders.length > 0 ? (
              <OrdersTable
                orders={orders}
                showClientInfo={true}
                userRole="technician"
                onViewDetails={handleViewDetails}
                onUpdateStatus={handleUpdateStatus}
              />
            ) : (
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No tienes órdenes asignadas</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Cuando se te asignen nuevas órdenes de servicio, aparecerán aquí.
                </p>
                <Button variant="outline" onClick={loadData}>
                  Actualizar Lista
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

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
      </div>
    </TechnicianLayout>
  )
}
