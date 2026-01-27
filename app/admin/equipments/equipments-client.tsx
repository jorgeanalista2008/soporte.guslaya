"use client"

import { useState } from "react"
import { Plus, Monitor, CheckCircle, Wrench, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { EquipmentTable } from "@/components/equipments/equipment-table"
import { NewEquipmentDialog } from "@/components/equipments/new-equipment-dialog"
import { useEquipments } from "@/hooks/use-equipments"

export function EquipmentsPageClient() {
  const [showNewDialog, setShowNewDialog] = useState(false)
  const [activeDialog, setActiveDialog] = useState<string | null>(null)

  const { equipments, loading, error, refetch } = useEquipments()

  const stats = {
    total: equipments?.length || 0,
    active: equipments?.filter((e) => e.status === "active").length || 0,
    maintenance: equipments?.filter((e) => e.status === "maintenance").length || 0,
    retired: equipments?.filter((e) => e.status === "retired").length || 0,
  }

  const getFilteredEquipments = (status?: string) => {
    if (!status) return equipments?.slice(0, 5) || []
    return equipments?.filter((equipment) => equipment.status === status).slice(0, 5) || []
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Activo", variant: "default" as const, className: "bg-green-100 text-green-800" },
      maintenance: {
        label: "Mantenimiento",
        variant: "secondary" as const,
        className: "bg-yellow-100 text-yellow-800",
      },
      retired: { label: "Retirado", variant: "destructive" as const, className: "bg-red-100 text-red-800" },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="w-full space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Gestión de Equipos</h1>
          <p className="text-muted-foreground">Administra equipos de cómputo</p>
        </div>
        <Button onClick={() => setShowNewDialog(true)} className="w-fit">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Equipo
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveDialog("total")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Equipos</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveDialog("active")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setActiveDialog("maintenance")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Mantenimiento</CardTitle>
            <Wrench className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.maintenance}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveDialog("retired")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retirados</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.retired}</div>
          </CardContent>
        </Card>
      </div>

      {/* Equipment Table with integrated filters */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Lista de Equipos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">Cargando equipos...</div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-red-600">Error al cargar equipos: {error}</div>
              </div>
            ) : (
              <EquipmentTable equipments={equipments || []} onRefresh={refetch} />
            )}
          </div>
        </CardContent>
      </Card>

      {/* New Equipment Dialog */}
      <NewEquipmentDialog
        open={showNewDialog}
        onOpenChange={setShowNewDialog}
        onSuccess={() => {
          setShowNewDialog(false)
          refetch()
        }}
      />

      {/* Total Equipos Dialog */}
      <Dialog open={activeDialog === "total"} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Total de Equipos ({stats.total})
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Últimos 5 equipos registrados en el sistema</p>
            <div className="space-y-3">
              {getFilteredEquipments().map((equipment) => (
                <div key={equipment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">
                      {equipment.brand} {equipment.model}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Serie: {equipment.serial_number} • Cliente: {equipment.client_name}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">{getStatusBadge(equipment.status)}</div>
                </div>
              ))}
              {getFilteredEquipments().length === 0 && (
                <div className="text-center py-4 text-muted-foreground">No hay equipos registrados</div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Equipos Activos Dialog */}
      <Dialog open={activeDialog === "active"} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Equipos Activos ({stats.active})
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Últimos 5 equipos con estado activo</p>
            <div className="space-y-3">
              {getFilteredEquipments("active").map((equipment) => (
                <div key={equipment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">
                      {equipment.brand} {equipment.model}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Serie: {equipment.serial_number} • Cliente: {equipment.client_name}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">{getStatusBadge(equipment.status)}</div>
                </div>
              ))}
              {getFilteredEquipments("active").length === 0 && (
                <div className="text-center py-4 text-muted-foreground">No hay equipos activos</div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Equipos En Mantenimiento Dialog */}
      <Dialog open={activeDialog === "maintenance"} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-yellow-600" />
              Equipos en Mantenimiento ({stats.maintenance})
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Últimos 5 equipos en proceso de mantenimiento</p>
            <div className="space-y-3">
              {getFilteredEquipments("maintenance").map((equipment) => (
                <div key={equipment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">
                      {equipment.brand} {equipment.model}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Serie: {equipment.serial_number} • Cliente: {equipment.client_name}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">{getStatusBadge(equipment.status)}</div>
                </div>
              ))}
              {getFilteredEquipments("maintenance").length === 0 && (
                <div className="text-center py-4 text-muted-foreground">No hay equipos en mantenimiento</div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Equipos Retirados Dialog */}
      <Dialog open={activeDialog === "retired"} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              Equipos Retirados ({stats.retired})
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Últimos 5 equipos retirados del servicio</p>
            <div className="space-y-3">
              {getFilteredEquipments("retired").map((equipment) => (
                <div key={equipment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">
                      {equipment.brand} {equipment.model}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Serie: {equipment.serial_number} • Cliente: {equipment.client_name}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">{getStatusBadge(equipment.status)}</div>
                </div>
              ))}
              {getFilteredEquipments("retired").length === 0 && (
                <div className="text-center py-4 text-muted-foreground">No hay equipos retirados</div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
