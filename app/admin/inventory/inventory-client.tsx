"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DataTable } from "@/components/ui/data-table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Column } from "@/components/ui/data-table"
import {
  Plus,
  Package,
  AlertTriangle,
  DollarSign,
  Edit,
  Trash2,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  ArrowUpDown,
  FolderOpen,
  Info,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import {
  CreateEditPartDialog,
  PartDetailsDialog,
  UpdateStockDialog,
  CategoryDialog,
} from "@/components/admin/inventory-dialogs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface InventoryClientProps {
  inventoryParts: any[]
  categories: any[]
  inventoryRequests: any[]
  recentTransactions: any[]
}

export function InventoryClient({
  inventoryParts,
  categories,
  inventoryRequests,
  recentTransactions,
}: InventoryClientProps) {
  const [createEditDialogOpen, setCreateEditDialogOpen] = useState(false)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [updateStockDialogOpen, setUpdateStockDialogOpen] = useState(false)
  const [selectedPart, setSelectedPart] = useState<any>(null)
  const [parts, setParts] = useState(inventoryParts || [])
  const [requests, setRequests] = useState(inventoryRequests || [])
  const [activeTab, setActiveTab] = useState("parts")

  const [totalPartsDialogOpen, setTotalPartsDialogOpen] = useState(false)
  const [totalValueDialogOpen, setTotalValueDialogOpen] = useState(false)
  const [lowStockDialogOpen, setLowStockDialogOpen] = useState(false)
  const [outOfStockDialogOpen, setOutOfStockDialogOpen] = useState(false)
  const [requestsDialogOpen, setRequestsDialogOpen] = useState(false)

  const [categoriesState, setCategoriesState] = useState(categories || [])
  const [createCategoryDialogOpen, setCreateCategoryDialogOpen] = useState(false)
  const [editCategoryDialogOpen, setEditCategoryDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<any>(null)
  const [deleteCategoryDialogOpen, setDeleteCategoryDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<any>(null)

  const supabase = createClient()

  // Calculate statistics
  const totalParts = parts.length
  const totalValue = parts.reduce((sum, part) => sum + (part.unit_price || 0) * part.stock_quantity, 0)
  const lowStockParts = parts.filter((p) => p.stock_quantity <= p.min_stock_level).length
  const outOfStockParts = parts.filter((p) => p.stock_quantity === 0).length
  const pendingRequests = requests.filter((r) => r.status === "pending").length

  const getLowStockParts = () => parts.filter((p) => p.stock_quantity <= p.min_stock_level).slice(0, 5)
  const getOutOfStockParts = () => parts.filter((p) => p.stock_quantity === 0).slice(0, 5)
  const getRecentParts = () => parts.slice(0, 5)
  const getTopValueParts = () =>
    parts
      .map((part) => ({ ...part, totalValue: (part.unit_price || 0) * part.stock_quantity }))
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 5)
  const getPendingRequests = () => requests.filter((r) => r.status === "pending").slice(0, 5)

  const tabsConfig = [
    {
      value: "parts",
      label: "Repuestos",
      icon: Package,
      tooltip:
        "Gestiona el catálogo completo de repuestos. Mantén actualizado el stock y precios para un control eficiente del inventario.",
    },
    {
      value: "requests",
      label: "Solicitudes",
      icon: AlertTriangle,
      badge: pendingRequests,
      tooltip:
        "Revisa y aprueba solicitudes de repuestos de los técnicos. Prioriza las urgentes para evitar retrasos en reparaciones.",
    },
    {
      value: "categories",
      label: "Categorías",
      icon: FolderOpen,
      tooltip:
        "Organiza los repuestos en categorías lógicas. Una buena categorización facilita la búsqueda y el control de inventario.",
    },
    {
      value: "transactions",
      label: "Movimientos",
      icon: ArrowUpDown,
      tooltip:
        "Consulta el historial de entradas, salidas y ajustes. Mantén trazabilidad completa de todos los movimientos de inventario.",
    },
    {
      value: "reports",
      label: "Reportes",
      icon: FileText,
      tooltip:
        "Analiza estadísticas y tendencias del inventario. Usa estos datos para tomar decisiones informadas de compra y gestión.",
    },
  ]

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
      key: "unit_price",
      header: "Precio Unit.",
      sortable: true,
      render: (row) => `$${(row.unit_price || 0).toFixed(2)}`,
    },
    {
      key: "total_value",
      header: "Valor Total",
      sortable: true,
      accessor: (row) => (row.unit_price || 0) * row.stock_quantity,
      render: (row) => `$${((row.unit_price || 0) * row.stock_quantity).toFixed(2)}`,
    },
    {
      key: "location",
      header: "Ubicación",
      sortable: true,
      accessor: (row) => row.location || "N/A",
    },
    {
      key: "status",
      header: "Estado",
      sortable: true,
      render: (row) => (
        <Badge variant={row.status === "active" ? "default" : "secondary"}>
          {row.status === "active" ? "Activo" : row.status === "inactive" ? "Inactivo" : "Descontinuado"}
        </Badge>
      ),
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
              try {
                setSelectedPart(row)
                setDetailsDialogOpen(true)
              } catch (error) {
                console.error("Error opening details dialog:", error)
                toast.error("Error al abrir los detalles")
              }
            }}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              try {
                setSelectedPart(row)
                setCreateEditDialogOpen(true)
              } catch (error) {
                console.error("Error opening edit dialog:", error)
                toast.error("Error al abrir el editor")
              }
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleDeletePart(row.id)
            }}
          >
            <Trash2 className="w-4 h-4" />
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
      key: "requested_by",
      header: "Solicitado por",
      sortable: true,
      accessor: (row) => row.requested_by?.full_name || "N/A",
    },
    {
      key: "quantity",
      header: "Cantidad",
      sortable: true,
    },
    {
      key: "current_stock",
      header: "Stock Actual",
      sortable: true,
      accessor: (row) => row.part?.stock_quantity || 0,
      render: (row) => {
        const stock = row.part?.stock_quantity || 0
        const requested = row.quantity
        return <span className={stock >= requested ? "text-green-600" : "text-red-600"}>{stock}</span>
      },
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
        const variants = {
          pending: "secondary",
          approved: "default",
          rejected: "destructive",
          fulfilled: "default",
          cancelled: "secondary",
        } as const
        return <Badge variant={variants[status as keyof typeof variants] || "default"}>{status}</Badge>
      },
    },
    {
      key: "requested_at",
      header: "Fecha",
      sortable: true,
      accessor: (row) => new Date(row.requested_at).toLocaleDateString(),
    },
    {
      key: "actions",
      header: "Acciones",
      render: (row) => {
        const status = row.status
        return (
          <div className="flex gap-2">
            {status === "pending" && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-green-600 bg-transparent"
                  onClick={() => handleApproveRequest(row.id)}
                >
                  <CheckCircle className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 bg-transparent"
                  onClick={() => handleRejectRequest(row.id)}
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </>
            )}
            <Button size="sm" variant="outline">
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  const handleSavePart = async (partData: any) => {
    try {
      if (selectedPart) {
        // Update existing part
        const { error } = await supabase.from("inventory_parts").update(partData).eq("id", selectedPart.id)

        if (error) throw error

        // Update local state
        setParts((prev) => prev.map((p) => (p.id === selectedPart.id ? { ...p, ...partData } : p)))
        toast.success("Repuesto actualizado correctamente")
      } else {
        // Create new part
        const { data, error } = await supabase
          .from("inventory_parts")
          .insert([partData])
          .select(`
            *,
            category:inventory_categories(name)
          `)
          .single()

        if (error) throw error

        // Add to local state
        setParts((prev) => [...prev, data])
        toast.success("Repuesto creado correctamente")
      }

      setCreateEditDialogOpen(false)
      setSelectedPart(null)
    } catch (error) {
      console.error("Error saving part:", error)
      toast.error("Error al guardar el repuesto")
    }
  }

  const handleUpdateStock = async (partId: string, newQuantity: number, transactionType: string, notes: string) => {
    try {
      // Update part stock
      const { error: partError } = await supabase
        .from("inventory_parts")
        .update({ stock_quantity: newQuantity })
        .eq("id", partId)

      if (partError) throw partError

      // Create transaction record
      const { error: transactionError } = await supabase.from("inventory_transactions").insert([
        {
          part_id: partId,
          transaction_type: transactionType,
          quantity:
            transactionType === "adjustment"
              ? newQuantity
              : transactionType === "in"
                ? Math.abs(newQuantity - (selectedPart?.stock_quantity || 0))
                : -Math.abs(newQuantity - (selectedPart?.stock_quantity || 0)),
          notes: notes,
          performed_by: (await supabase.auth.getUser()).data.user?.id,
        },
      ])

      if (transactionError) throw transactionError

      // Update local state
      setParts((prev) => prev.map((p) => (p.id === partId ? { ...p, stock_quantity: newQuantity } : p)))
      toast.success("Stock actualizado correctamente")

      setUpdateStockDialogOpen(false)
      setSelectedPart(null)
    } catch (error) {
      console.error("Error updating stock:", error)
      toast.error("Error al actualizar el stock")
    }
  }

  const handleDeletePart = async (partId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este repuesto?")) return

    try {
      const { error } = await supabase.from("inventory_parts").delete().eq("id", partId)

      if (error) throw error

      setParts((prev) => prev.filter((p) => p.id !== partId))
      toast.success("Repuesto eliminado correctamente")
    } catch (error) {
      console.error("Error deleting part:", error)
      toast.error("Error al eliminar el repuesto")
    }
  }

  const handleApproveRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from("inventory_requests")
        .update({
          status: "approved",
          reviewed_by: (await supabase.auth.getUser()).data.user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", requestId)

      if (error) throw error

      setRequests((prev) => prev.map((r) => (r.id === requestId ? { ...r, status: "approved" } : r)))
      toast.success("Solicitud aprobada")
    } catch (error) {
      console.error("Error approving request:", error)
      toast.error("Error al aprobar la solicitud")
    }
  }

  const handleRejectRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from("inventory_requests")
        .update({
          status: "rejected",
          reviewed_by: (await supabase.auth.getUser()).data.user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", requestId)

      if (error) throw error

      setRequests((prev) => prev.map((r) => (r.id === requestId ? { ...r, status: "rejected" } : r)))
      toast.success("Solicitud rechazada")
    } catch (error) {
      console.error("Error rejecting request:", error)
      toast.error("Error al rechazar la solicitud")
    }
  }

  const handleCreateCategory = async (categoryData: { name: string; description: string }) => {
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      })

      const result = await response.json()

      if (!response.ok) {
        toast.error(result.error || "Error al crear la categoría")
        return
      }

      setCategoriesState((prev) => [...prev, result.category])
      toast.success("Categoría creada correctamente")
      setCreateCategoryDialogOpen(false)
    } catch (error) {
      console.error("[v0] Error creating category:", error)
      toast.error("Error al crear la categoría")
    }
  }

  const handleEditCategory = async (categoryData: { name: string; description: string }) => {
    try {
      const response = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedCategory.id,
          ...categoryData,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        toast.error(result.error || "Error al actualizar la categoría")
        return
      }

      setCategoriesState((prev) => prev.map((cat) => (cat.id === selectedCategory.id ? result.category : cat)))
      toast.success("Categoría actualizada correctamente")
      setEditCategoryDialogOpen(false)
      setSelectedCategory(null)
    } catch (error) {
      console.error("Error updating category:", error)
      toast.error("Error al actualizar la categoría")
    }
  }

  const handleDeleteCategory = async (categoryId: number) => {
    try {
      const response = await fetch(`/api/admin/categories?id=${categoryId}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (!response.ok) {
        toast.error(result.error || "Error al eliminar la categoría")
        setDeleteCategoryDialogOpen(false)
        setCategoryToDelete(null)
        return
      }

      setCategoriesState((prev) => prev.filter((cat) => cat.id !== categoryId))
      toast.success("Categoría eliminada correctamente")
      setDeleteCategoryDialogOpen(false)
      setCategoryToDelete(null)
    } catch (error) {
      console.error("Error deleting category:", error)
      toast.error("Error al eliminar la categoría")
    }
  }

  const openDeleteCategoryDialog = (category: any) => {
    setCategoryToDelete(category)
    setDeleteCategoryDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Inventario</h1>
          <p className="text-muted-foreground">Administra repuestos, stock y movimientos de inventario</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button onClick={() => setCreateEditDialogOpen(true)} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Repuesto
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card
          className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setTotalPartsDialogOpen(true)}
        >
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

        <Card
          className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setTotalValueDialogOpen(true)}
        >
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-green-600 dark:text-green-400">Valor Total</p>
                <p className="text-xl font-bold text-green-900 dark:text-green-100">${totalValue.toFixed(2)}</p>
              </div>
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setLowStockDialogOpen(true)}
        >
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

        <Card
          className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setOutOfStockDialogOpen(true)}
        >
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-red-600 dark:text-red-400">Agotados</p>
                <p className="text-xl font-bold text-red-900 dark:text-red-100">{outOfStockParts}</p>
              </div>
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setRequestsDialogOpen(true)}
        >
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-purple-600 dark:text-purple-400">Solicitudes</p>
                <p className="text-xl font-bold text-purple-900 dark:text-purple-100">{pendingRequests}</p>
              </div>
              <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <TooltipProvider>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex items-center gap-2">
            {/* Mobile Select */}
            <div className="lg:hidden w-full">
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger className="w-full h-14 text-base font-medium">
                  <SelectValue placeholder="Selecciona una pestaña">
                    <div className="flex items-center gap-3">
                      {(() => {
                        const currentTab = tabsConfig.find((tab) => tab.value === activeTab)
                        const Icon = currentTab?.icon || Package
                        return (
                          <>
                            <Icon className="w-5 h-5" />
                            <span>{currentTab?.label}</span>
                            {currentTab?.badge && currentTab.badge > 0 && (
                              <Badge variant="destructive" className="ml-1 px-2 py-0.5 text-xs">
                                {currentTab.badge}
                              </Badge>
                            )}
                          </>
                        )
                      })()}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="w-[calc(100vw-2rem)]">
                  {tabsConfig.map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.value
                    return (
                      <SelectItem
                        key={tab.value}
                        value={tab.value}
                        className={`py-4 px-3 cursor-pointer ${isActive ? "bg-accent font-semibold" : ""}`}
                      >
                        <div className="flex items-start gap-3 w-full">
                          <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isActive ? "text-primary" : ""}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={isActive ? "font-semibold" : "font-medium"}>{tab.label}</span>
                              {tab.badge && tab.badge > 0 && (
                                <Badge variant="destructive" className="px-2 py-0 text-xs h-5">
                                  {tab.badge}
                                </Badge>
                              )}
                              {isActive && (
                                <Badge variant="default" className="ml-auto px-2 py-0 text-xs h-5">
                                  Activa
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">{tab.tooltip}</p>
                          </div>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Desktop Tabs */}
            <div className="hidden lg:block w-full">
              <TabsList className="grid w-full grid-cols-5 h-auto">
                {tabsConfig.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <Tooltip key={tab.value}>
                      <TooltipTrigger asChild>
                        <TabsTrigger
                          value={tab.value}
                          className="flex items-center gap-2 py-3 px-4 text-sm data-[state=active]:bg-background relative group"
                        >
                          <Icon className="w-4 h-4" />
                          <span>{tab.label}</span>
                          {tab.badge && tab.badge > 0 && (
                            <Badge variant="destructive" className="ml-1 px-1.5 py-0 text-xs h-5">
                              {tab.badge}
                            </Badge>
                          )}
                          <Info className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-50 transition-opacity" />
                        </TabsTrigger>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-xs">
                        <p className="text-sm">{tab.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </TabsList>
            </div>
          </div>

          <TabsContent value="parts" className="space-y-6">
            {/* Parts Table */}
            <Card>
              <CardHeader>
                <CardTitle>Lista de Repuestos</CardTitle>
                <CardDescription>Gestiona todos los repuestos y componentes del inventario</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={partsColumns}
                  data={parts}
                  filters={[
                    {
                      key: "category",
                      label: "Categoría",
                      type: "select",
                      options: categoriesState?.map((cat) => ({ value: cat.name, label: cat.name })) || [],
                      filterFn: (row, value) => {
                        const categoryName = row.category?.name || "Sin categoría"
                        return categoryName === value
                      },
                    },
                    {
                      key: "status",
                      label: "Estado",
                      type: "select",
                      options: [
                        { value: "active", label: "Activo" },
                        { value: "inactive", label: "Inactivo" },
                        { value: "discontinued", label: "Descontinuado" },
                      ],
                    },
                    {
                      key: "stock_status",
                      label: "Estado de Stock",
                      type: "select",
                      options: [
                        { value: "all", label: "Todos" },
                        { value: "available", label: "Disponible (Stock > Mínimo)" },
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
                    {
                      key: "stock_range",
                      label: "Rango de Stock",
                      type: "select",
                      options: [
                        { value: "all", label: "Todos los rangos" },
                        { value: "0-10", label: "0-10 unidades" },
                        { value: "11-50", label: "11-50 unidades" },
                        { value: "51-100", label: "51-100 unidades" },
                        { value: "100+", label: "Más de 100 unidades" },
                      ],
                      filterFn: (row, value) => {
                        if (value === "all") return true
                        const stock = row.stock_quantity

                        switch (value) {
                          case "0-10":
                            return stock >= 0 && stock <= 10
                          case "11-50":
                            return stock >= 11 && stock <= 50
                          case "51-100":
                            return stock >= 51 && stock <= 100
                          case "100+":
                            return stock > 100
                          default:
                            return true
                        }
                      },
                    },
                  ]}
                  searchPlaceholder="Buscar por nombre, código o marca..."
                  pageSize={10}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Solicitudes de Repuestos
                    </CardTitle>
                    <CardDescription>Gestiona las solicitudes de repuestos de los técnicos</CardDescription>
                  </div>
                </div>
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

            {/* Quick Actions for Pending Requests */}
            {pendingRequests > 0 && (
              <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700">
                <CardHeader>
                  <CardTitle className="text-yellow-800 dark:text-yellow-200">Acciones Rápidas</CardTitle>
                  <CardDescription className="text-yellow-700 dark:text-yellow-300">
                    Tienes {pendingRequests} solicitudes pendientes de revisión
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Aprobar Todas las Disponibles
                    </Button>
                    <Button variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      <Package className="w-4 h-4 mr-2" />
                      Generar Orden de Compra
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Categorías de Inventario</CardTitle>
                    <CardDescription>Organiza los repuestos por categorías</CardDescription>
                  </div>
                  <Button onClick={() => setCreateCategoryDialogOpen(true)} className="w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Categoría
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoriesState?.map((category) => {
                    const categoryParts = parts.filter((p) => p.category_id === category.id)
                    const categoryValue = categoryParts.reduce(
                      (sum, part) => sum + (part.unit_price || 0) * part.stock_quantity,
                      0,
                    )
                    const hasLowStock = categoryParts.some((p) => p.stock_quantity <= p.min_stock_level)

                    return (
                      <Card key={category.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg flex items-center gap-2">
                                <FolderOpen className="w-5 h-5 text-primary" />
                                {category.name}
                              </CardTitle>
                              <CardDescription className="mt-1">
                                {category.description || "Sin descripción"}
                              </CardDescription>
                            </div>
                            <Badge variant="secondary" className="ml-2">
                              {categoryParts.length}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="bg-muted/50 p-2 rounded">
                              <p className="text-xs text-muted-foreground">Valor Total</p>
                              <p className="font-semibold text-green-600">${categoryValue.toFixed(2)}</p>
                            </div>
                            <div className="bg-muted/50 p-2 rounded">
                              <p className="text-xs text-muted-foreground">Estado</p>
                              <p className={`font-semibold ${hasLowStock ? "text-yellow-600" : "text-green-600"}`}>
                                {hasLowStock ? "Stock Bajo" : "Normal"}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 bg-transparent"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                try {
                                  setSelectedCategory(category)
                                  setEditCategoryDialogOpen(true)
                                } catch (error) {
                                  console.error("Error opening edit category dialog:", error)
                                  toast.error("Error al abrir el editor de categoría")
                                }
                              }}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Editar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                openDeleteCategoryDialog(category)
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {categoriesState.length === 0 && (
                  <div className="text-center py-12">
                    <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No hay categorías</h3>
                    <p className="text-muted-foreground mb-4">Crea tu primera categoría para organizar los repuestos</p>
                    <Button onClick={() => setCreateCategoryDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Nueva Categoría
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Movimientos de Inventario</CardTitle>
                <CardDescription>Historial de entradas, salidas y ajustes de stock</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions?.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            transaction.transaction_type === "in"
                              ? "bg-green-500"
                              : transaction.transaction_type === "out"
                                ? "bg-red-500"
                                : "bg-blue-500"
                          }`}
                        />
                        <div>
                          <p className="font-medium">
                            {transaction.part?.name} ({transaction.part?.part_number})
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {transaction.transaction_type === "in"
                              ? "Entrada"
                              : transaction.transaction_type === "out"
                                ? "Salida"
                                : "Ajuste"}{" "}
                            de {Math.abs(transaction.quantity)} unidades
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">Por: {transaction.performed_by?.full_name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Reporte de Stock</CardTitle>
                  <CardDescription>Análisis del estado actual del inventario</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Repuestos con stock normal:</span>
                      <span className="font-medium text-green-600">
                        {parts.filter((p) => p.stock_quantity > p.min_stock_level).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Repuestos con stock bajo:</span>
                      <span className="font-medium text-yellow-600">{lowStockParts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Repuestos agotados:</span>
                      <span className="font-medium text-red-600">{outOfStockParts}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Valor por Categoría</CardTitle>
                  <CardDescription>Distribución del valor del inventario</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categoriesState?.map((category) => {
                      const categoryParts = parts.filter((p) => p.category_id === category.id)
                      const categoryValue = categoryParts.reduce(
                        (sum, part) => sum + (part.unit_price || 0) * part.stock_quantity,
                        0,
                      )
                      return (
                        <div key={category.id} className="flex justify-between">
                          <span>{category.name}:</span>
                          <span className="font-medium">${categoryValue.toFixed(2)}</span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </TooltipProvider>

      {/* Dialog Total Repuestos */}
      <Dialog open={totalPartsDialogOpen} onOpenChange={setTotalPartsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Package className="w-5 h-5" />
              Total de Repuestos
            </DialogTitle>
            <DialogDescription>Información detallada sobre el inventario total de repuestos</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-blue-600 dark:text-blue-400">Total de Repuestos</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{totalParts}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-sm text-green-600 dark:text-green-400">Repuestos Activos</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {parts.filter((p) => p.status === "active").length}
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Últimos 5 Repuestos Agregados</h4>
              <div className="space-y-2">
                {getRecentParts().map((part) => (
                  <div
                    key={part.id}
                    className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded"
                  >
                    <div>
                      <p className="font-medium">{part.name}</p>
                      <p className="text-sm text-muted-foreground">{part.part_number}</p>
                    </div>
                    <Badge variant={part.stock_quantity > 0 ? "default" : "destructive"}>
                      Stock: {part.stock_quantity}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Valor Total */}
      <Dialog open={totalValueDialogOpen} onOpenChange={setTotalValueDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <DollarSign className="w-5 h-5" />
              Valor Total del Inventario
            </DialogTitle>
            <DialogDescription>Análisis del valor económico del inventario</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-sm text-green-600 dark:text-green-400">Valor Total</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">${totalValue.toFixed(2)}</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-blue-600 dark:text-blue-400">Valor Promedio por Repuesto</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  ${totalParts > 0 ? (totalValue / totalParts).toFixed(2) : "0.00"}
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Top 5 Repuestos por Valor</h4>
              <div className="space-y-2">
                {getTopValueParts().map((part) => (
                  <div
                    key={part.id}
                    className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded"
                  >
                    <div>
                      <p className="font-medium">{part.name}</p>
                      <p className="text-sm text-muted-foreground">{part.part_number}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">${part.totalValue.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">
                        {part.stock_quantity} × ${(part.unit_price || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Stock Bajo */}
      <Dialog open={lowStockDialogOpen} onOpenChange={setLowStockDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
              <AlertTriangle className="w-5 h-5" />
              Repuestos con Stock Bajo
            </DialogTitle>
            <DialogDescription>Repuestos que requieren reabastecimiento urgente</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <p className="text-sm text-yellow-600 dark:text-yellow-400">Total con Stock Bajo</p>
              <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{lowStockParts}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Repuestos que Necesitan Reabastecimiento</h4>
              <div className="space-y-2">
                {getLowStockParts().map((part) => (
                  <div
                    key={part.id}
                    className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded"
                  >
                    <div>
                      <p className="font-medium">{part.name}</p>
                      <p className="text-sm text-muted-foreground">{part.part_number}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive">
                        {part.stock_quantity} / {part.min_stock_level} mín
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        Necesita: {part.min_stock_level - part.stock_quantity + 10}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Agotados */}
      <Dialog open={outOfStockDialogOpen} onOpenChange={setOutOfStockDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-5 h-5" />
              Repuestos Agotados
            </DialogTitle>
            <DialogDescription>Repuestos sin stock disponible que requieren atención inmediata</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">Total Agotados</p>
              <p className="text-2xl font-bold text-red-900 dark:text-red-100">{outOfStockParts}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Repuestos Sin Stock</h4>
              <div className="space-y-2">
                {getOutOfStockParts().map((part) => (
                  <div
                    key={part.id}
                    className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded"
                  >
                    <div>
                      <p className="font-medium">{part.name}</p>
                      <p className="text-sm text-muted-foreground">{part.part_number}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive">Agotado</Badge>
                      <p className="text-sm text-muted-foreground">Mín requerido: {part.min_stock_level}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Solicitudes */}
      <Dialog open={requestsDialogOpen} onOpenChange={setRequestsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
              <Clock className="w-5 h-5" />
              Solicitudes Pendientes
            </DialogTitle>
            <DialogDescription>Solicitudes de repuestos que requieren revisión</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <p className="text-sm text-purple-600 dark:text-purple-400">Solicitudes Pendientes</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{pendingRequests}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Últimas 5 Solicitudes Pendientes</h4>
              <div className="space-y-2">
                {getPendingRequests().map((request) => (
                  <div
                    key={request.id}
                    className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded"
                  >
                    <div>
                      <p className="font-medium">{request.part?.name || "N/A"}</p>
                      <p className="text-sm text-muted-foreground">
                        Solicitado por: {request.requested_by?.full_name || "N/A"}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={request.priority === "urgent" ? "destructive" : "secondary"}>
                        {request.quantity} unidades
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {new Date(request.requested_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialogs */}
      <CreateEditPartDialog
        open={createEditDialogOpen}
        onOpenChange={setCreateEditDialogOpen}
        categories={categoriesState || []}
        part={selectedPart}
        onSave={handleSavePart}
      />

      <PartDetailsDialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen} part={selectedPart} />

      <UpdateStockDialog
        open={updateStockDialogOpen}
        onOpenChange={setUpdateStockDialogOpen}
        part={selectedPart}
        onUpdate={handleUpdateStock}
      />

      <CategoryDialog
        open={createCategoryDialogOpen}
        onOpenChange={setCreateCategoryDialogOpen}
        onSave={handleCreateCategory}
        title="Crear Nueva Categoría"
        description="Completa la información para crear una nueva categoría"
      />

      <CategoryDialog
        open={editCategoryDialogOpen}
        onOpenChange={setEditCategoryDialogOpen}
        category={selectedCategory}
        onSave={handleEditCategory}
        title="Editar Categoría"
        description="Modifica la información de la categoría"
      />

      <AlertDialog open={deleteCategoryDialogOpen} onOpenChange={setDeleteCategoryDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar categoría?</AlertDialogTitle>
            <AlertDialogDescription>
              {categoryToDelete &&
                (() => {
                  const categoryParts = parts.filter((p) => p.category_id === categoryToDelete.id)

                  if (categoryParts.length > 0) {
                    return (
                      <div className="space-y-2">
                        <p className="text-red-600 font-semibold">
                          Esta categoría tiene ${categoryParts.length} repuesto(s) asignado(s) y no puede ser eliminada.
                        </p>
                        <p>
                          Primero debes reasignar o eliminar los repuestos de esta categoría antes de poder eliminarla.
                        </p>
                        <div className="mt-4 p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium mb-2">Repuestos en esta categoría:</p>
                          <ul className="text-sm space-y-1">
                            {categoryParts.slice(0, 5).map((part) => (
                              <li key={part.id} className="flex items-center gap-2">
                                <Package className="w-3 h-3" />
                                {part.name} ({part.part_number})
                              </li>
                            ))}
                            {categoryParts.length > 5 && (
                              <li className="text-muted-foreground">... y {categoryParts.length - 5} más</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    )
                  }

                  return (
                    <p>
                      ¿Estás seguro de que deseas eliminar la categoría <strong>{categoryToDelete.name}</strong>? Esta
                      acción no se puede deshacer.
                    </p>
                  )
                })()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteCategoryDialogOpen(false)
                setCategoryToDelete(null)
              }}
            >
              Cancelar
            </AlertDialogCancel>
            {categoryToDelete && parts.filter((p) => p.category_id === categoryToDelete.id).length === 0 && (
              <AlertDialogAction
                onClick={() => handleDeleteCategory(categoryToDelete.id)}
                className="bg-red-600 hover:bg-red-700"
              >
                Eliminar
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
