"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { Equipment } from "@/types/equipment"
import { deleteEquipment } from "@/lib/equipment-actions"

interface DeleteEquipmentDialogProps {
  equipment: Equipment | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function DeleteEquipmentDialog({ equipment, open, onOpenChange, onSuccess }: DeleteEquipmentDialogProps) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!equipment) return

    setLoading(true)

    try {
      await deleteEquipment(equipment.id)
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error("Error deleting equipment:", error)
    } finally {
      setLoading(false)
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
        return "Mantenimiento"
      case "retired":
        return "Retirado"
      default:
        return status
    }
  }

  if (!equipment) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Eliminar Equipo
          </DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. El equipo será eliminado permanentemente del sistema.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border p-4 bg-muted/50">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">
                  {equipment.brand} {equipment.model}
                </h4>
                <Badge className={getStatusColor(equipment.status)}>{getStatusLabel(equipment.status)}</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>
                  <span className="font-medium">Tipo:</span> {equipment.equipment_type}
                </p>
                {equipment.equipment_subtype && (
                  <p>
                    <span className="font-medium">Subtipo:</span> {equipment.equipment_subtype}
                  </p>
                )}
                {equipment.serial_number && (
                  <p>
                    <span className="font-medium">Serie:</span> {equipment.serial_number}
                  </p>
                )}
                {equipment.location && (
                  <p>
                    <span className="font-medium">Ubicación:</span> {equipment.location}
                  </p>
                )}
                {equipment.assigned_to_profile && (
                  <p>
                    <span className="font-medium">Asignado a:</span> {equipment.assigned_to_profile.full_name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {equipment.equipment_components && equipment.equipment_components.length > 0 && (
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">Componentes que se eliminarán:</p>
              <ul className="list-disc list-inside space-y-1">
                {equipment.equipment_components.map((component, index) => (
                  <li key={index}>
                    {component.component_type}
                    {component.component_name && ` - ${component.component_name}`}
                    {component.quantity > 1 && ` (${component.quantity})`}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? "Eliminando..." : "Eliminar Equipo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
