"use client"

import { useState } from "react"
import { Eye, Edit, Trash2, Monitor, Laptop, Server } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable, type Column, type Filter } from "@/components/ui/data-table"
import type { Equipment } from "@/types/equipment"
import { EquipmentDetailsDialog } from "./equipment-details-dialog"
import { EditEquipmentDialog } from "./edit-equipment-dialog"
import { DeleteEquipmentDialog } from "./delete-equipment-dialog"

interface EquipmentTableProps {
  equipments: Equipment[]
  onRefresh: () => void
}

export function EquipmentTable({ equipments, onRefresh }: EquipmentTableProps) {
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const getEquipmentIcon = (type: string) => {
    switch (type) {
      case "Laptop":
        return <Laptop className="h-4 w-4" />
      case "PC":
        return <Monitor className="h-4 w-4" />
      case "Server":
        return <Server className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      inactive: "secondary",
      maintenance: "destructive",
      retired: "outline",
    } as const

    const labels = {
      active: "Activo",
      inactive: "Inactivo",
      maintenance: "Mantenimiento",
      retired: "Retirado",
    }

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    )
  }

  const handleAction = (action: "view" | "edit" | "delete", equipment: Equipment) => {
    setSelectedEquipment(equipment)
    switch (action) {
      case "view":
        setShowDetails(true)
        break
      case "edit":
        setShowEdit(true)
        break
      case "delete":
        setShowDelete(true)
        break
    }
  }

  const columns: Column<Equipment>[] = [
    {
      key: "type",
      header: "Tipo",
      sortable: true,
      accessor: (equipment) => equipment.equipment_type,
      render: (equipment) => (
        <div className="flex items-center gap-2">
          {getEquipmentIcon(equipment.equipment_type)}
          <span className="font-medium">{equipment.equipment_type}</span>
        </div>
      ),
    },
    {
      key: "brand_model",
      header: "Marca/Modelo",
      sortable: true,
      render: (equipment) => (
        <div>
          <div className="font-medium">{equipment.brand}</div>
          <div className="text-sm text-muted-foreground">{equipment.model}</div>
          {equipment.equipment_subtype && (
            <div className="text-xs text-muted-foreground">{equipment.equipment_subtype}</div>
          )}
        </div>
      ),
    },
    {
      key: "serial_number",
      header: "Número de Serie",
      sortable: true,
      render: (equipment) => (
        <code className="text-sm bg-muted px-2 py-1 rounded">{equipment.serial_number || "N/A"}</code>
      ),
    },
    {
      key: "status",
      header: "Estado",
      sortable: true,
      render: (equipment) => getStatusBadge(equipment.status),
    },
    {
      key: "assigned_to",
      header: "Asignado a",
      sortable: true,
      accessor: (equipment) => equipment.profiles?.full_name || "Sin asignar",
      render: (equipment) => <span className="text-sm">{equipment.profiles?.full_name || "Sin asignar"}</span>,
    },
    {
      key: "location",
      header: "Ubicación",
      sortable: true,
      accessor: (equipment) => equipment.location || "Sin ubicación",
      render: (equipment) => <span className="text-sm">{equipment.location || "Sin ubicación"}</span>,
    },
    {
      key: "actions",
      header: "Acciones",
      render: (equipment) => (
        <div className="flex items-center gap-1 justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAction("view", equipment)}
            className="h-8 w-8 p-0 hover:bg-muted"
            title="Ver detalles"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAction("edit", equipment)}
            className="h-8 w-8 p-0 hover:bg-muted"
            title="Editar"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAction("delete", equipment)}
            className="h-8 w-8 p-0 hover:bg-muted text-red-600 hover:text-red-700"
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const filters: Filter[] = [
    {
      key: "equipment_type",
      label: "Filtrar por tipo",
      type: "select",
      options: [
        { value: "Laptop", label: "Laptop" },
        { value: "PC", label: "PC" },
        { value: "Server", label: "Server" },
      ],
    },
    {
      key: "status",
      label: "Filtrar por estado",
      type: "select",
      options: [
        { value: "active", label: "Activo" },
        { value: "inactive", label: "Inactivo" },
        { value: "maintenance", label: "Mantenimiento" },
        { value: "retired", label: "Retirado" },
      ],
    },
    {
      key: "assignment_status",
      label: "Estado de asignación",
      type: "select",
      options: [
        { value: "assigned", label: "Asignados" },
        { value: "unassigned", label: "Sin asignar" },
      ],
      filterFn: (equipment, value) => {
        const isAssigned = !!equipment.profiles?.full_name
        if (value === "assigned") return isAssigned
        if (value === "unassigned") return !isAssigned
        return true
      },
    },
    {
      key: "warranty_status",
      label: "Estado de garantía",
      type: "select",
      options: [
        { value: "active_warranty", label: "Garantía vigente" },
        { value: "expired_warranty", label: "Garantía vencida" },
        { value: "no_warranty", label: "Sin garantía" },
      ],
      filterFn: (equipment, value) => {
        if (!equipment.warranty_expiry) {
          return value === "no_warranty"
        }
        const warrantyDate = new Date(equipment.warranty_expiry)
        const now = new Date()
        const isActive = warrantyDate > now

        if (value === "active_warranty") return isActive
        if (value === "expired_warranty") return !isActive
        return true
      },
    },
    {
      key: "brand_filter",
      label: "Filtrar por marca",
      type: "select",
      options: Array.from(new Set(equipments.map((e) => e.brand)))
        .filter(Boolean)
        .sort()
        .map((brand) => ({ value: brand, label: brand })),
    },
  ]

  if (equipments.length === 0) {
    return (
      <div className="text-center py-8">
        <Monitor className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium">No hay equipos registrados</h3>
        <p className="text-muted-foreground">Comienza agregando tu primer equipo.</p>
      </div>
    )
  }

  return (
    <>
      <DataTable
        data={equipments}
        columns={columns}
        filters={filters}
        searchPlaceholder="Buscar por marca, modelo o número de serie..."
        emptyMessage="No se encontraron equipos"
        pageSize={10}
      />

      {/* Dialogs */}
      {selectedEquipment && (
        <>
          <EquipmentDetailsDialog equipment={selectedEquipment} open={showDetails} onOpenChange={setShowDetails} />
          <EditEquipmentDialog
            equipment={selectedEquipment}
            open={showEdit}
            onOpenChange={setShowEdit}
            onSuccess={() => {
              setShowEdit(false)
              onRefresh()
            }}
          />
          <DeleteEquipmentDialog
            equipment={selectedEquipment}
            open={showDelete}
            onOpenChange={setShowDelete}
            onSuccess={() => {
              setShowDelete(false)
              onRefresh()
            }}
          />
        </>
      )}
    </>
  )
}
