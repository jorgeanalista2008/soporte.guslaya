"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { CreateEquipmentData } from "@/types/equipment"
import { createEquipment } from "@/lib/equipment-actions"
import { useUsersData } from "@/hooks/use-users-data"

interface NewEquipmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  preselectedClient?: {
    id: string
    full_name: string
    email: string
  } | null
}

interface Component {
  component_type: string
  component_name: string
  specifications: string
  quantity: number
}

export function NewEquipmentDialog({ open, onOpenChange, onSuccess, preselectedClient }: NewEquipmentDialogProps) {
  const [loading, setLoading] = useState(false)
  const [components, setComponents] = useState<Component[]>([])
  const { users } = useUsersData()

  const [formData, setFormData] = useState<CreateEquipmentData>(() => ({
    equipment_type: "PC",
    brand: "",
    model: "",
    equipment_subtype: "",
    serial_number: "",
    purchase_date: "",
    warranty_expiry: "",
    status: "active",
    location: "",
    assigned_to: preselectedClient?.id || "",
    notes: "",
  }))

  useEffect(() => {
    if (preselectedClient) {
      setFormData((prev) => ({ ...prev, assigned_to: preselectedClient.id }))
    }
  }, [preselectedClient])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const equipmentData = {
        ...formData,
        assigned_to: formData.assigned_to || undefined,
        components: components.length > 0 ? components : undefined,
      }

      await createEquipment(equipmentData)
      onSuccess()
      resetForm()
    } catch (error) {
      console.error("Error creating equipment:", error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      equipment_type: "PC",
      brand: "",
      model: "",
      equipment_subtype: "",
      serial_number: "",
      purchase_date: "",
      warranty_expiry: "",
      status: "active",
      location: "",
      assigned_to: preselectedClient?.id || "",
      notes: "",
    })
    setComponents([])
  }

  const addComponent = () => {
    setComponents([
      ...components,
      {
        component_type: "Disco Duro",
        component_name: "",
        specifications: "",
        quantity: 1,
      },
    ])
  }

  const removeComponent = (index: number) => {
    setComponents(components.filter((_, i) => i !== index))
  }

  const updateComponent = (index: number, field: keyof Component, value: string | number) => {
    const updated = [...components]
    updated[index] = { ...updated[index], [field]: value }
    setComponents(updated)
  }

  const componentTypes = [
    "Disco Duro",
    "Memoria RAM",
    "Tarjeta Gráfica",
    "Procesador",
    "Tarjeta Madre",
    "Fuente de Poder",
    "Tarjeta de Red",
    "Unidad Óptica",
    "Otro",
  ]

  const availableUsers =
    users?.filter((user) => (preselectedClient ? user.id === preselectedClient.id : user.role === "client")) || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {preselectedClient ? `Registrar Equipo para ${preselectedClient.full_name}` : "Registrar Nuevo Equipo"}
          </DialogTitle>
          <DialogDescription>
            {preselectedClient
              ? `Complete el formulario para registrar un nuevo equipo para ${preselectedClient.full_name}.`
              : "Complete el formulario para registrar un nuevo equipo en el sistema."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="equipment_type">Tipo de Equipo *</Label>
                  <Select
                    value={formData.equipment_type}
                    onValueChange={(value: "Laptop" | "PC" | "Server") =>
                      setFormData({ ...formData, equipment_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Laptop">Laptop</SelectItem>
                      <SelectItem value="PC">PC</SelectItem>
                      <SelectItem value="Server">Server</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">Marca *</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="ej. Dell, HP, Lenovo"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Modelo *</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="ej. OptiPlex 7090"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="equipment_subtype">Tipo Específico</Label>
                  <Input
                    id="equipment_subtype"
                    value={formData.equipment_subtype}
                    onChange={(e) => setFormData({ ...formData, equipment_subtype: e.target.value })}
                    placeholder="ej. clon híbrido, workstation"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serial_number">Número de Serie</Label>
                  <Input
                    id="serial_number"
                    value={formData.serial_number}
                    onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                    placeholder="Número de serie del equipo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "active" | "inactive" | "maintenance" | "retired") =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="inactive">Inactivo</SelectItem>
                      <SelectItem value="maintenance">Mantenimiento</SelectItem>
                      <SelectItem value="retired">Retirado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="purchase_date">Fecha de Compra</Label>
                  <Input
                    id="purchase_date"
                    type="date"
                    value={formData.purchase_date}
                    onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="warranty_expiry">Vencimiento de Garantía</Label>
                  <Input
                    id="warranty_expiry"
                    type="date"
                    value={formData.warranty_expiry}
                    onChange={(e) => setFormData({ ...formData, warranty_expiry: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="ej. Oficina 101, Almacén"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assigned_to">{preselectedClient ? "Cliente Asignado" : "Asignado a"}</Label>
                  <Select
                    value={formData.assigned_to}
                    onValueChange={(value) =>
                      setFormData({ ...formData, assigned_to: value === "unassigned" ? "" : value })
                    }
                    disabled={!!preselectedClient}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar usuario" />
                    </SelectTrigger>
                    <SelectContent>
                      {!preselectedClient && <SelectItem value="unassigned">Sin asignar</SelectItem>}
                      {availableUsers?.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.full_name} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {preselectedClient && (
                    <p className="text-sm text-muted-foreground">
                      Este equipo será asignado automáticamente a {preselectedClient.full_name}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Información adicional sobre el equipo"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Components */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Componentes Adicionales</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addComponent}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Componente
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {components.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No hay componentes agregados. Haz clic en "Agregar Componente" para añadir uno.
                </p>
              ) : (
                components.map((component, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Componente {index + 1}</h4>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeComponent(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Tipo de Componente</Label>
                        <Select
                          value={component.component_type}
                          onValueChange={(value) => updateComponent(index, "component_type", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            {componentTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Nombre del Componente</Label>
                        <Input
                          value={component.component_name}
                          onChange={(e) => updateComponent(index, "component_name", e.target.value)}
                          placeholder="ej. Kingston 8GB DDR4"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Especificaciones</Label>
                        <Input
                          value={component.specifications}
                          onChange={(e) => updateComponent(index, "specifications", e.target.value)}
                          placeholder="ej. 2400MHz, CL17"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Cantidad</Label>
                        <Input
                          type="number"
                          min="1"
                          value={component.quantity}
                          onChange={(e) => updateComponent(index, "quantity", Number.parseInt(e.target.value) || 1)}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Equipo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
