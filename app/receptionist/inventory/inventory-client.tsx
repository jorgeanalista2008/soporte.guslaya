"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/ui/data-table"
import type { Column } from "@/components/ui/data-table"
import { Plus, Package, AlertTriangle, Eye, Clock, CheckCircle, XCircle, Search, FileText } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { PartDetailsDialog, CreateEditPartDialog } from "@/components/admin/inventory-dialogs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ReceptionistInventoryClientProps {
  inventoryParts: any[]
  categories: any[]
  inventoryRequests: any[]
  userId: string
}

export function ReceptionistInventoryClient({
  inventoryParts,
  categories,
  inventoryRequests,
  userId,
}: ReceptionistInventoryClientProps) {
  const [parts, setParts] = useState(inventoryParts || [])
  const [requests, setRequests] = useState(inventoryRequests || [])
  const [activeTab, setActiveTab] = useState("parts")
  const [searchTerm, setSearchTerm] = useState("")
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [requestDialogOpen, setRequestDialogOpen] = useState(false)
  const [createPartDialogOpen, setCreatePartDialogOpen] = useState(false)
  const [selectedPart, setSelectedPart] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)

  const [requestForm, setRequestForm] = useState({
    quantity: 1,
    priority: "normal" as const,
    reason: "",
  })

  const supabase = createClient()

  // Calculate statistics
  const totalParts = parts.length
  const availableParts = parts.filter((p) => p.stock_quantity > 0).length
  const lowStockParts = parts.filter((p) => p.stock_quantity <= p.min_stock_level && p.stock_quantity > 0).length
  const outOfStockParts = parts.filter((p) => p.stock_quantity === 0).length
  const myPendingRequests = requests.filter((r) => r.status === "pending").length
  const myApprovedRequests = requests.filter((r) => r.status === "approved").length

  const filteredParts = parts.filter(
    (part) =>
      part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.part_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const partsColumns: Column<any>[] = [
    {
      key: "part_number",
      header: "Código",
      sortable: true,
      filterable: true,
    },
    {
      key: "name",
      header: "Nombre",
      sortable: true,
      filterable: true,
    },
    {
      key: "category",
      header: "Categoría",
      sortable: true,
      filterable: true,
      accessor: (row) => row.category?.name || "Sin categoría",
    },
    {
      key: "brand",
      header: "Marca",
      sortable: true,
      filterable: true,
      accessor: (row) => row.brand || "N/A",
    },
    {
      key: "stock_quantity",
      header: "Stock",
      sortable: true,
      render: (row) => {
        const stock = row.stock_quantity
        const minStock = row.min_stock_level
        return (
          <span
            className={`font-medium ${
              stock === 0 ? "text-red-600" : stock <= minStock ? "text-yellow-600" : "text-green-600"
            }`}
          >
            {stock}
          </span>
        )
      },
    },
    {
      key: "location",
      header: "Ubicación",
      sortable: true,
      accessor: (row) => row.location || "N/A",
    },
    {
      key: "actions",
      header: "Acciones",
      render: (row) => (
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setSelectedPart(row)
              setDetailsDialogOpen(true)
            }}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="default"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setSelectedPart(row)
              setRequestDialogOpen(true)
            }}
            disabled={row.stock_quantity === 0}
          >
            <Plus className="w-4 h-4 mr-1" />
            Solicitar
          </Button>
        </div>
      ),
    },
  ]

  const requestsColumns: Column<any>[] = [
    {
      key: "part_name",
      header: "Repuesto",
      sortable: true,
      accessor: (row) => row.part?.name || "N/A",
    },
    {
      key: "part_number",
      header: "Código",
      sortable: true,
      accessor: (row) => row.part?.part_number || "N/A",
    },
    {
      key: "quantity",
      header: "Cantidad",
      sortable: true,
    },
    {
      key: "priority",
      header: "Prioridad",
      sortable: true,
      render: (row) => {
        const priority = row.priority
        const variants = {
          low: "secondary",
          normal: "default",
          high: "destructive",
          urgent: "destructive",
        } as const
        return <Badge variant={variants[priority as keyof typeof variants] || "default"}>{priority}</Badge>
      },
    },
    {
      key: "status",
      header: "Estado",
      sortable: true,
      render: (row) => {
        const status = row.status
        const statusLabels = {
          pending: "Pendiente",
          approved: "Aprobada",
          rejected: "Rechazada",
          fulfilled: "Cumplida",
          cancelled: "Cancelada",
        }
        const variants = {
          pending: "secondary",
          approved: "default",
          rejected: "destructive",
          fulfilled: "default",
          cancelled: "secondary",
        } as const
        return (
          <Badge variant={variants[status as keyof typeof variants] || "default"}>
            {statusLabels[status as keyof typeof statusLabels] || status}
          </Badge>
        )
      },
    },
    {
      key: "requested_at",
      header: "Fecha",
      sortable: true,
      accessor: (row) => new Date(row.requested_at).toLocaleDateString(),
    },
    {
      key: "reason",
      header: "Motivo",
      accessor: (row) => row.reason || "N/A",
    },
  ]

  const handleSavePart = async (partData: any) => {
    try {
      const { data, error } = await supabase
        .from("inventory_parts")
        .insert(partData)
        .select(`
          *,
          category:inventory_categories(id, name, description)
        `)
        .single()

      if (error) {
        console.error("Error creating part:", error)
        toast.error("No se pudo crear el repuesto. Intenta nuevamente.")
      } else {
        toast.success(`Repuesto "${partData.name}" creado exitosamente`)
        setParts([data, ...parts])
        setCreatePartDialogOpen(false)
      }
    } catch (error) {
      console.error("Unexpected error:", error)
      toast.error("Ocurrió un error inesperado")
    }
  }

  const handleRequestPart = async () => {
    if (!selectedPart || submitting) return

    if (!requestForm.reason.trim()) {
      toast.error("Por favor, proporciona un motivo para la solicitud")
      return
    }

    setSubmitting(true)

    try {
      const { error } = await supabase.from("inventory_requests").insert({
        part_id: selectedPart.id,
        requested_by: userId,
        quantity: requestForm.quantity,
        priority: requestForm.priority,
        reason: requestForm.reason,
        status: "pending",
      })

      if (error) {
        console.error("Error creating request:", error)
        toast.error("No se pudo enviar la solicitud. Intenta nuevamente.")
      } else {
        toast.success(`Se ha solicitado ${requestForm.quantity} unidad(es) de ${selectedPart.name}`)

        // Refresh requests
        const { data: updatedRequests } = await supabase
          .from("inventory_requests")
          .select(`
            *,
            part:inventory_parts(name, part_number, stock_quantity),
            requested_by:profiles!inventory_requests_requested_by_fkey(full_name, email),
            reviewed_by:profiles!inventory_requests_reviewed_by_fkey(full_name)
          `)
          .eq("requested_by", userId)
          .order("created_at", { ascending: false })

        if (updatedRequests) {
          setRequests(updatedRequests)
        }

        setRequestDialogOpen(false)
        setRequestForm({ quantity: 1, priority: "normal", reason: "" })
        setSelectedPart(null)
      }
    } catch (error) {
      console.error("Unexpected error:", error)
      toast.error("Ocurrió un error inesperado")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventario de Repuestos</h1>
          <p className="text-muted-foreground">Consulta disponibilidad y solicita repuestos necesarios</p>
        </div>
        <Button onClick={() => setCreatePartDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Repuesto
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400">Total Repuestos</p>
                <p className="text-xl font-bold text-blue-900 dark:text-blue-100">{totalParts}</p>
              </div>
              <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-green-600 dark:text-green-400">Disponibles</p>
                <p className="text-xl font-bold text-green-900 dark:text-green-100">{availableParts}</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-yellow-600 dark:text-yellow-400">Stock Bajo</p>
                <p className="text-xl font-bold text-yellow-900 dark:text-yellow-100">{lowStockParts}</p>
              </div>
              <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-red-600 dark:text-red-400">Agotados</p>
                <p className="text-xl font-bold text-red-900 dark:text-red-100">{outOfStockParts}</p>
              </div>
              <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-purple-600 dark:text-purple-400">Mis Pendientes</p>
                <p className="text-xl font-bold text-purple-900 dark:text-purple-100">{myPendingRequests}</p>
              </div>
              <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-700">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-teal-600 dark:text-teal-400">Aprobadas</p>
                <p className="text-xl font-bold text-teal-900 dark:text-teal-100">{myApprovedRequests}</p>
              </div>
              <FileText className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="parts" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Repuestos Disponibles
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Mis Solicitudes
            {myPendingRequests > 0 && (
              <Badge variant="destructive" className="ml-1 px-1.5 py-0 text-xs h-5">
                {myPendingRequests}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="parts" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nombre, código o marca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {searchTerm && (
            <div className="text-sm text-muted-foreground">
              {filteredParts.length} repuesto(s) encontrado(s) para "{searchTerm}"
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Catálogo de Repuestos</CardTitle>
              <CardDescription>
                Consulta el inventario disponible y solicita los repuestos que necesites
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={partsColumns}
                data={filteredParts}
                filters={[
                  {
                    key: "category",
                    label: "Categoría",
                    type: "select",
                    options: categories?.map((cat) => ({ value: cat.name, label: cat.name })) || [],
                    filterFn: (row, value) => {
                      const categoryName = row.category?.name || "Sin categoría"
                      return categoryName === value
                    },
                  },
                  {
                    key: "stock_status",
                    label: "Disponibilidad",
                    type: "select",
                    options: [
                      { value: "all", label: "Todos" },
                      { value: "available", label: "Disponible" },
                      { value: "low", label: "Stock Bajo" },
                      { value: "out", label: "Agotado" },
                    ],
                    filterFn: (row, value) => {
                      if (value === "all") return true
                      const stock = row.stock_quantity
                      const minStock = row.min_stock_level || 0

                      switch (value) {
                        case "available":
                          return stock > minStock
                        case "low":
                          return stock > 0 && stock <= minStock
                        case "out":
                          return stock === 0
                        default:
                          return true
                      }
                    },
                  },
                ]}
                searchPlaceholder="Buscar repuestos..."
                pageSize={10}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Mis Solicitudes de Repuestos
              </CardTitle>
              <CardDescription>Historial de todas tus solicitudes de repuestos</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={requestsColumns}
                data={requests}
                filters={[
                  {
                    key: "status",
                    label: "Estado",
                    type: "select",
                    options: [
                      { value: "pending", label: "Pendientes" },
                      { value: "approved", label: "Aprobadas" },
                      { value: "rejected", label: "Rechazadas" },
                      { value: "fulfilled", label: "Cumplidas" },
                      { value: "cancelled", label: "Canceladas" },
                    ],
                  },
                  {
                    key: "priority",
                    label: "Prioridad",
                    type: "select",
                    options: [
                      { value: "low", label: "Baja" },
                      { value: "normal", label: "Normal" },
                      { value: "high", label: "Alta" },
                      { value: "urgent", label: "Urgente" },
                    ],
                  },
                ]}
                searchPlaceholder="Buscar solicitudes..."
                pageSize={10}
              />
            </CardContent>
          </Card>

          {myPendingRequests > 0 && (
            <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700">
              <CardHeader>
                <CardTitle className="text-yellow-800 dark:text-yellow-200">Solicitudes Pendientes</CardTitle>
                <CardDescription className="text-yellow-700 dark:text-yellow-300">
                  Tienes {myPendingRequests} solicitud(es) pendiente(s) de revisión por el administrador
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Part Details Dialog - Reused from admin */}
      <PartDetailsDialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen} part={selectedPart} />

      {/* Create Part Dialog */}
      <CreateEditPartDialog
        open={createPartDialogOpen}
        onOpenChange={setCreatePartDialogOpen}
        categories={categories}
        onSave={handleSavePart}
      />

      {/* Request Part Dialog */}
      <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitar Repuesto</DialogTitle>
            <DialogDescription>Solicita {selectedPart?.name} del inventario</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Cantidad</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max={selectedPart?.stock_quantity || 1}
                value={requestForm.quantity}
                onChange={(e) =>
                  setRequestForm((prev) => ({ ...prev, quantity: Number.parseInt(e.target.value) || 1 }))
                }
              />
              <p className="text-xs text-muted-foreground">Stock disponible: {selectedPart?.stock_quantity || 0}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Prioridad</Label>
              <Select
                value={requestForm.priority}
                onValueChange={(value: any) => setRequestForm((prev) => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Motivo de la solicitud *</Label>
              <Textarea
                id="reason"
                placeholder="Describe para qué necesitas este repuesto..."
                value={requestForm.reason}
                onChange={(e) => setRequestForm((prev) => ({ ...prev, reason: e.target.value }))}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRequestDialogOpen(false)
                setRequestForm({ quantity: 1, priority: "normal", reason: "" })
              }}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button onClick={handleRequestPart} disabled={!requestForm.reason.trim() || submitting}>
              {submitting ? "Enviando..." : "Enviar Solicitud"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
