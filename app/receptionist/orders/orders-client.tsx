"use client"

import { useState, useEffect } from "react"
import { ClientRoleGuard } from "@/components/auth/client-role-guard"
import { OrdersTable } from "@/components/orders/orders-table"
import { OrderDetailsDialog } from "@/components/orders/order-details-dialog"
import { OrderAssignmentDialog } from "@/components/orders/order-assignment-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchAllOrders, fetchOrdersStats, type OrderWithDetails } from "@/lib/orders-service-client"
import { toast } from "sonner"
import { RefreshCw, Clock, CheckCircle, AlertCircle, ClipboardList, Search, Filter, UserCheck } from "lucide-react"

export function OrdersClient() {
  const [orders, setOrders] = useState<OrderWithDetails[]>([])
  const [filteredOrders, setFilteredOrders] = useState<OrderWithDetails[]>([])
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [selectedOrderForAssignment, setSelectedOrderForAssignment] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showAssignmentDialog, setShowAssignmentDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeOrders: 0,
    pendingOrders: 0,
    inProgressOrders: 0,
    completedOrders: 0,
    deliveredOrders: 0,
  })

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    let filtered = orders

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.equipment_brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.equipment_model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.id.toString().includes(searchTerm),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }, [orders, searchTerm, statusFilter])

  const loadOrders = async () => {
    setIsLoading(true)

    try {
      console.log("[v0] Loading orders using orders service...")

      const [ordersData, statsData] = await Promise.all([fetchAllOrders(), fetchOrdersStats()])

      console.log("[v0] Orders loaded successfully:", ordersData.length)
      console.log("[v0] Stats loaded:", statsData)

      setOrders(ordersData)
      setStats(statsData)
    } catch (error) {
      console.error("[v0] Error loading orders:", error)
      toast.error("Error al cargar las órdenes")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOrderClick = (order: any) => {
    console.log("[v0] Order clicked:", order.id)
    setSelectedOrder(order)
    setShowDetailsDialog(true)
  }

  const handleAssignTechnician = (order: any) => {
    console.log("[v0] Assign technician clicked for order:", order.id)
    setSelectedOrderForAssignment(order)
    setShowAssignmentDialog(true)
  }

  const handleAssignmentSuccess = () => {
    console.log("[v0] Technician assignment successful, reloading orders")
    loadOrders() // Reload orders to reflect the assignment
    toast.success("Técnico asignado exitosamente")
  }

  const renderOrderActions = (order: any) => {
    const hasAssignedTechnician = order.technician_id && order.technician_id !== null
    const buttonText = hasAssignedTechnician ? "Reasignar" : "Asignar"

    return (
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleOrderClick(order)}
          className="bg-background border-border hover:bg-accent"
        >
          Ver Detalles
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAssignTechnician(order)}
          className="bg-background border-border hover:bg-accent"
        >
          <UserCheck className="w-4 h-4 mr-1" />
          {buttonText}
        </Button>
      </div>
    )
  }

  const displayStats = {
    total: stats.totalOrders,
    received: stats.pendingOrders,
    in_progress: stats.inProgressOrders,
    completed: stats.completedOrders,
    delivered: stats.deliveredOrders,
  }

  return (
    <ClientRoleGuard allowedRoles={["receptionist", "admin"]}>
      <div className="w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Gestión de Órdenes</h2>
            <p className="text-muted-foreground">Ver y gestionar todas las órdenes de servicio</p>
          </div>
          <Button onClick={loadOrders} variant="outline" size="default" disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Órdenes</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{displayStats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recibidas</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{displayStats.received}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Progreso</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{displayStats.in_progress}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{displayStats.completed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Entregadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{displayStats.delivered}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros y Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar por cliente, equipo o ID de orden..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full sm:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="received">Recibidas</SelectItem>
                    <SelectItem value="in_progress">En Progreso</SelectItem>
                    <SelectItem value="completed">Completadas</SelectItem>
                    <SelectItem value="delivered">Entregadas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {(searchTerm || statusFilter !== "all") && (
              <div className="mt-4 text-sm text-muted-foreground">
                Mostrando {filteredOrders.length} de {orders.length} órdenes
              </div>
            )}
          </CardContent>
        </Card>

        <div className="w-full">
          <OrdersTable
            orders={filteredOrders}
            showClientInfo={true}
            onOrderClick={handleOrderClick}
            renderActions={renderOrderActions}
          />
        </div>

        <OrderDetailsDialog order={selectedOrder} open={showDetailsDialog} onOpenChange={setShowDetailsDialog} />

        <OrderAssignmentDialog
          order={selectedOrderForAssignment}
          open={showAssignmentDialog}
          onOpenChange={setShowAssignmentDialog}
          onSuccess={handleAssignmentSuccess}
        />
      </div>
    </ClientRoleGuard>
  )
}
