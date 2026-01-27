"use client"

import { useState } from "react"
import { Eye, Monitor, Laptop, Server, MapPin, Calendar, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Equipment } from "@/types/equipment"
import { ClientEquipmentDetailsDialog } from "./client-equipment-details-dialog"

interface ClientEquipmentsListProps {
  equipments: Equipment[]
  onRefresh: () => void
  searchTerm: string
}

export function ClientEquipmentsList({ equipments, onRefresh, searchTerm }: ClientEquipmentsListProps) {
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const getEquipmentIcon = (type: string) => {
    switch (type) {
      case "Laptop":
        return <Laptop className="h-5 w-5" />
      case "PC":
        return <Monitor className="h-5 w-5" />
      case "Server":
        return <Server className="h-5 w-5" />
      default:
        return <Monitor className="h-5 w-5" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { variant: "default" as const, label: "Activo", color: "bg-green-100 text-green-800" },
      inactive: { variant: "secondary" as const, label: "Inactivo", color: "bg-gray-100 text-gray-800" },
      maintenance: { variant: "destructive" as const, label: "Mantenimiento", color: "bg-yellow-100 text-yellow-800" },
      retired: { variant: "outline" as const, label: "Retirado", color: "bg-red-100 text-red-800" },
    }

    const config = variants[status as keyof typeof variants] || variants.inactive

    return <Badge className={config.color}>{config.label}</Badge>
  }

  const handleViewDetails = (equipment: Equipment) => {
    setSelectedEquipment(equipment)
    setShowDetails(true)
  }

  if (equipments.length === 0) {
    return (
      <div className="text-center py-12">
        <Monitor className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">
          {searchTerm ? "No se encontraron equipos" : "No tienes equipos asignados"}
        </h3>
        <p className="text-muted-foreground">
          {searchTerm
            ? "Intenta con otros términos de búsqueda o ajusta los filtros."
            : "Contacta al administrador para que te asigne equipos."}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
        {equipments.map((equipment) => (
          <Card key={equipment.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg">{getEquipmentIcon(equipment.equipment_type)}</div>
                    <div>
                      <h3 className="font-semibold text-sm">
                        {equipment.brand} {equipment.model}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {equipment.equipment_type}
                        {equipment.equipment_subtype && ` • ${equipment.equipment_subtype}`}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(equipment.status)}
                </div>

                {/* Details */}
                <div className="space-y-2">
                  {equipment.serial_number && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-medium">Serie:</span>
                      <code className="bg-muted px-1 py-0.5 rounded text-xs">{equipment.serial_number}</code>
                    </div>
                  )}

                  {equipment.location && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{equipment.location}</span>
                    </div>
                  )}

                  {equipment.warranty_expiry && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Garantía: {new Date(equipment.warranty_expiry).toLocaleDateString()}</span>
                    </div>
                  )}

                  {equipment.equipment_components && equipment.equipment_components.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Wrench className="h-3 w-3" />
                      <span>{equipment.equipment_components.length} componente(s)</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-2 border-t">
                  <Button variant="outline" size="sm" onClick={() => handleViewDetails(equipment)} className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalles
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Details Dialog */}
      {selectedEquipment && (
        <ClientEquipmentDetailsDialog equipment={selectedEquipment} open={showDetails} onOpenChange={setShowDetails} />
      )}
    </>
  )
}
