"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Equipment } from "@/types/equipment"

interface EquipmentDetailsDialogProps {
  equipment: Equipment | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EquipmentDetailsDialog({ equipment, open, onOpenChange }: EquipmentDetailsDialogProps) {
  if (!equipment) return null

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
        return "Mantenimiento"
      case "retired":
        return "Retirado"
      default:
        return status
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalles del Equipo</DialogTitle>
          <DialogDescription>Información completa del equipo seleccionado.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tipo de Equipo</label>
                  <p className="text-sm">{equipment.equipment_type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Estado</label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(equipment.status)}>{getStatusLabel(equipment.status)}</Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Marca</label>
                  <p className="text-sm">{equipment.brand}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Modelo</label>
                  <p className="text-sm">{equipment.model}</p>
                </div>
                {equipment.equipment_subtype && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Tipo Específico</label>
                    <p className="text-sm">{equipment.equipment_subtype}</p>
                  </div>
                )}
                {equipment.serial_number && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Número de Serie</label>
                    <p className="text-sm">{equipment.serial_number}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Dates and Location */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Fechas y Ubicación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {equipment.purchase_date && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Fecha de Compra</label>
                    <p className="text-sm">{new Date(equipment.purchase_date).toLocaleDateString()}</p>
                  </div>
                )}
                {equipment.warranty_expiry && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Vencimiento de Garantía</label>
                    <p className="text-sm">{new Date(equipment.warranty_expiry).toLocaleDateString()}</p>
                  </div>
                )}
                {equipment.location && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Ubicación</label>
                    <p className="text-sm">{equipment.location}</p>
                  </div>
                )}
                {equipment.assigned_to_profile && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Asignado a</label>
                    <p className="text-sm">
                      {equipment.assigned_to_profile.full_name} ({equipment.assigned_to_profile.email})
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
                <CardTitle className="text-lg">Componentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {equipment.equipment_components.map((component, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Tipo</label>
                          <p className="text-sm">{component.component_type}</p>
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
                <CardTitle className="text-lg">Notas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{equipment.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información del Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Fecha de Registro</label>
                <p className="text-sm">{new Date(equipment.created_at).toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Última Actualización</label>
                <p className="text-sm">{new Date(equipment.updated_at).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
