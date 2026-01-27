"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Monitor, Laptop, Server, MapPin, Calendar, User, Wrench, FileText } from "lucide-react"
import type { Equipment } from "@/types/equipment"

interface ClientEquipmentDetailsDialogProps {
  equipment: Equipment | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ClientEquipmentDetailsDialog({ equipment, open, onOpenChange }: ClientEquipmentDetailsDialogProps) {
  if (!equipment) return null

  const getEquipmentIcon = (type: string) => {
    switch (type) {
      case "Laptop":
        return <Laptop className="h-6 w-6" />
      case "PC":
        return <Monitor className="h-6 w-6" />
      case "Server":
        return <Server className="h-6 w-6" />
      default:
        return <Monitor className="h-6 w-6" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      case "retired":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Activo"
      case "inactive":
        return "Inactivo"
      case "maintenance":
        return "En Mantenimiento"
      case "retired":
        return "Retirado"
      default:
        return status
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-lg">{getEquipmentIcon(equipment.equipment_type)}</div>
            <div>
              <div>
                {equipment.brand} {equipment.model}
              </div>
              <div className="text-sm font-normal text-muted-foreground">
                {equipment.equipment_type}
                {equipment.equipment_subtype && ` • ${equipment.equipment_subtype}`}
              </div>
            </div>
          </DialogTitle>
          <DialogDescription>Información detallada de tu equipo asignado</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Información General
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Estado</label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(equipment.status)}>{getStatusLabel(equipment.status)}</Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tipo de Equipo</label>
                  <p className="text-sm mt-1">{equipment.equipment_type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Marca</label>
                  <p className="text-sm mt-1">{equipment.brand}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Modelo</label>
                  <p className="text-sm mt-1">{equipment.model}</p>
                </div>
                {equipment.serial_number && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">Número de Serie</label>
                    <div className="mt-1">
                      <code className="text-sm bg-muted px-2 py-1 rounded">{equipment.serial_number}</code>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Location and Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Ubicación y Fechas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {equipment.location && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Ubicación</label>
                    <p className="text-sm mt-1">{equipment.location}</p>
                  </div>
                )}
                {equipment.purchase_date && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Fecha de Compra</label>
                    <p className="text-sm mt-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(equipment.purchase_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {equipment.warranty_expiry && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Vencimiento de Garantía</label>
                    <p className="text-sm mt-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(equipment.warranty_expiry).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {equipment.profiles && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Asignado a</label>
                    <p className="text-sm mt-1 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {equipment.profiles.full_name}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Components */}
          {equipment.equipment_components && equipment.equipment_components.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Componentes ({equipment.equipment_components.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {equipment.equipment_components.map((component, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-muted/30">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Tipo</label>
                          <p className="text-sm font-medium">{component.component_type}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Cantidad</label>
                          <p className="text-sm">{component.quantity}</p>
                        </div>
                        {component.component_name && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Nombre</label>
                            <p className="text-sm">{component.component_name}</p>
                          </div>
                        )}
                        {component.specifications && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Especificaciones</label>
                            <p className="text-sm">{component.specifications}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {equipment.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Notas Adicionales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap bg-muted/30 p-4 rounded-lg">{equipment.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* System Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información del Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="font-medium text-muted-foreground">Fecha de Registro</label>
                  <p>{new Date(equipment.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <label className="font-medium text-muted-foreground">Última Actualización</label>
                  <p>{new Date(equipment.updated_at).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
