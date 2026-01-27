"use client"

import { useState, useEffect } from "react"
import { ClientRoleGuard } from "@/components/auth/client-role-guard"
import { AdminLayout } from "@/components/admin/admin-layout"
import { OrdersTable } from "@/components/orders/orders-table"
import { OrderDetailsDialog } from "@/components/orders/order-details-dialog"
import { EditOrderDialog } from "@/components/orders/edit-order-dialog"
import { OrderStatusUpdateDialog } from "@/components/orders/order-status-update-dialog"
import { OrderAssignmentDialog } from "@/components/orders/order-assignment-dialog"
import { ReceptionistAssignmentDialog } from "@/components/orders/receptionist-assignment-dialog"
import { NewOrderDialog } from "@/components/orders/new-order-dialog"
import { DeleteOrderDialog } from "@/components/orders/delete-order-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { fetchAllOrders, fetchOrdersStats, type OrderWithDetails } from "@/lib/orders-service-client"
import { toast } from "sonner"
import {
  RefreshCw,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  ClipboardList,
  Eye,
  Edit,
  RotateCcw,
  UserCheck,
  Users,
  Trash2,
} from "lucide-react"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderWithDetails[]>([])
  const [userProfile, setUserProfile] = useState<any>(null)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalOrders: 0,
    receivedOrders: 0,
    diagnosisOrders: 0,
    waitingPartsOrders: 0,
    repairOrders: 0,
    testingOrders: 0,
    completedOrders: 0,
    deliveredOrders: 0,
  })

  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [showAssignmentDialog, setShowAssignmentDialog] = useState(false)
  const [showReceptionistDialog, setShowReceptionistDialog] = useState(false)
  const [showNewOrderDialog, setShowNewOrderDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const [showTotalOrdersDialog, setShowTotalOrdersDialog] = useState(false)
  const [showReceivedOrdersDialog, setShowReceivedOrdersDialog] = useState(false)
  const [showInProgressOrdersDialog, setShowInProgressOrdersDialog] = useState(false)
  const [showCompletedOrdersDialog, setShowCompletedOrdersDialog] = useState(false)
  const [showDeliveredOrdersDialog, setShowDeliveredOrdersDialog] = useState(false)

  useEffect(() => {
    loadUserProfile()
    loadOrders()
  }, [])

  const loadUserProfile = async () => {
    const supabase = createClient()
    if (!supabase) {
      toast.error("Error de configuración: Supabase no está configurado correctamente.")
      return
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      setUserProfile(profile)
    } catch (error) {
      console.error("Error loading user profile:", error)
    }
  }

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
    setSelectedOrder(order)
    setShowDetailsDialog(true)
  }

  const handleEditOrder = (order: any) => {
    setSelectedOrder(order)
    setShowEditDialog(true)
  }

  const handleUpdateStatus = (order: any) => {
    setSelectedOrder(order)
    setShowStatusDialog(true)
  }

  const handleAssignTechnician = (order: any) => {
    setSelectedOrder(order)
    setShowAssignmentDialog(true)
  }

  const handleAssignReceptionist = (order: any) => {
    setSelectedOrder(order)
    setShowReceptionistDialog(true)
  }

  const handleDeleteOrder = (order: any) => {
    setSelectedOrder(order)
    setShowDeleteDialog(true)
  }

  const handleSuccess = () => {
    loadOrders()
  }

  const getFilteredOrders = (status?: string) => {
    if (!status) return orders.slice(0, 5) // Todas las órdenes, últimas 5
    let filterStatus = status
    if (status === "pending") filterStatus = "received"
    if (status === "in_progress") filterStatus = "repair"

    return orders.filter((order) => order.status === filterStatus).slice(0, 5)
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
      case "received":
        return "secondary"
      case "diagnosis":
      case "waiting_parts":
      case "repair":
      case "testing":
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
      received: "Recibido",
      diagnosis: "En Diagnóstico",
      waiting_parts: "Esperando Repuestos",
      repair: "En Reparación",
      testing: "En Pruebas",
      completed: "Completada",
      delivered: "Entregada",
      cancelled: "Cancelada",
    }
    return translations[status] || status
  }

  const displayStats = {
    total: stats.totalOrders,
    received: stats.receivedOrders,
    in_progress: stats.repairOrders + stats.diagnosisOrders + stats.waitingPartsOrders + stats.testingOrders,
    completed: stats.completedOrders,
    delivered: stats.deliveredOrders,
  }

  if (!userProfile) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>
  }

  return (
    <ClientRoleGuard allowedRoles={["admin"]}>
      <AdminLayout
        userInfo={{
          name: userProfile.full_name,
          email: userProfile.email,
          role: userProfile.role,
        }}
      >
        <div className="w-full space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Gestión Completa de Órdenes</h1>
              <p className="text-muted-foreground">Ver, editar y gestionar todas las órdenes de servicio del sistema</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={() => setShowNewOrderDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Orden
              </Button>
              <Button onClick={loadOrders} variant="outline" size="default" disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Actualizar
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setShowTotalOrdersDialog(true)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Órdenes</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{displayStats.total}</div>
              </CardContent>
            </Card>
            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setShowReceivedOrdersDialog(true)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recibidas</CardTitle>
                <Clock className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{displayStats.received}</div>
              </CardContent>
            </Card>
            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setShowInProgressOrdersDialog(true)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">En Progreso</CardTitle>
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{displayStats.in_progress}</div>
              </CardContent>
            </Card>
            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setShowCompletedOrdersDialog(true)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completadas</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{displayStats.completed}</div>
              </CardContent>
            </Card>
            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setShowDeliveredOrdersDialog(true)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Entregadas</CardTitle>
                <XCircle className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-600">{displayStats.delivered}</div>
              </CardContent>
            </Card>
          </div>

          <div className="w-full">
            <OrdersTable
              orders={orders}
              showClientInfo={true}
              onOrderClick={handleOrderClick}
              renderActions={(order) => (
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" onClick={() => handleOrderClick(order)} title="Ver detalles">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEditOrder(order)} title="Editar orden">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateStatus(order)}
                    title="Actualizar estado"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAssignTechnician(order)}
                    title="Asignar técnico"
                  >
                    <UserCheck className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAssignReceptionist(order)}
                    title="Asignar recepcionista"
                  >
                    <Users className="w-4 h-4" />
                  </Button>
                  {order.status === "cancelled" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteOrder(order)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Eliminar orden"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              )}
            />
          </div>
        </div>

        <OrderDetailsDialog order={selectedOrder} open={showDetailsDialog} onOpenChange={setShowDetailsDialog} />

        <EditOrderDialog
          order={selectedOrder}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onSuccess={handleSuccess}
        />

        <OrderStatusUpdateDialog
          order={selectedOrder}
          open={showStatusDialog}
          onOpenChange={setShowStatusDialog}
          onSuccess={handleSuccess}
        />

        <OrderAssignmentDialog
          order={selectedOrder}
          open={showAssignmentDialog}
          onOpenChange={setShowAssignmentDialog}
          onSuccess={handleSuccess}
        />

        <ReceptionistAssignmentDialog
          order={selectedOrder}
          open={showReceptionistDialog}
          onOpenChange={setShowReceptionistDialog}
          onSuccess={handleSuccess}
        />

        <DeleteOrderDialog
          order={selectedOrder}
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onSuccess={handleSuccess}
        />

        <NewOrderDialog open={showNewOrderDialog} onOpenChange={setShowNewOrderDialog} onSuccess={handleSuccess} />

        <Dialog open={showTotalOrdersDialog} onOpenChange={setShowTotalOrdersDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-muted-foreground" />
                Total de Órdenes ({displayStats.total})
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Resumen general de todas las órdenes en el sistema</p>
              <div className="space-y-3">
                <h4 className="font-medium">Últimas 5 órdenes registradas:</h4>
                {getFilteredOrders().map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">#{order.order_number}</p>
                      <p className="text-sm text-muted-foreground">{order.client_name}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(order.status)}>{translateStatus(order.status)}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showReceivedOrdersDialog} onOpenChange={setShowReceivedOrdersDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Órdenes Recibidas ({displayStats.received})
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Órdenes que han sido recibidas y están pendientes de asignación
              </p>
              <div className="space-y-3">
                <h4 className="font-medium">Últimas 5 órdenes recibidas:</h4>
                {getFilteredOrders("received").map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">#{order.order_number}</p>
                      <p className="text-sm text-muted-foreground">{order.client_name}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
                    </div>
                    <Badge variant="secondary">Recibido</Badge>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showInProgressOrdersDialog} onOpenChange={setShowInProgressOrdersDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                Órdenes En Progreso ({displayStats.in_progress})
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Órdenes que están siendo trabajadas actualmente por los técnicos
              </p>
              <div className="space-y-3">
                <h4 className="font-medium">Últimas 5 órdenes en progreso:</h4>
                {getFilteredOrders("repair").map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">#{order.order_number}</p>
                      <p className="text-sm text-muted-foreground">{order.client_name}</p>
                      <p className="text-xs text-muted-foreground">Técnico: {order.technician_name || "No asignado"}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
                    </div>
                    <Badge variant="default">En Progreso</Badge>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showCompletedOrdersDialog} onOpenChange={setShowCompletedOrdersDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Órdenes Completadas ({displayStats.completed})
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Órdenes que han sido completadas y están listas para entrega
              </p>
              <div className="space-y-3">
                <h4 className="font-medium">Últimas 5 órdenes completadas:</h4>
                {getFilteredOrders("completed").map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">#{order.order_number}</p>
                      <p className="text-sm text-muted-foreground">{order.client_name}</p>
                      <p className="text-xs text-muted-foreground">Técnico: {order.technician_name || "No asignado"}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
                    </div>
                    <Badge variant="default">Completada</Badge>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showDeliveredOrdersDialog} onOpenChange={setShowDeliveredOrdersDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-gray-600" />
                Órdenes Entregadas ({displayStats.delivered})
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Órdenes que han sido entregadas exitosamente a los clientes
              </p>
              <div className="space-y-3">
                <h4 className="font-medium">Últimas 5 órdenes entregadas:</h4>
                {getFilteredOrders("delivered").map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">#{order.order_number}</p>
                      <p className="text-sm text-muted-foreground">{order.client_name}</p>
                      <p className="text-xs text-muted-foreground">Técnico: {order.technician_name || "No asignado"}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
                    </div>
                    <Badge variant="outline">Entregada</Badge>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </AdminLayout>
    </ClientRoleGuard>
  )
}
