"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { createServiceRequest } from "@/lib/services/client-service"

interface Equipment {
  id: string
  equipment_type: string
  brand: string
  model: string
  serial_number?: string
}

interface NewServiceRequestFormProps {
  existingEquipments: Equipment[]
}

interface ServiceRequestData {
  equipment_id?: string
  equipment_type: string
  brand?: string
  model?: string
  serial_number?: string
  problem_description: string
  priority: "low" | "medium" | "high" | "urgent"
  accessories?: string
  device_condition?: string
  client_notes?: string
}

export function NewServiceRequestForm({ existingEquipments }: NewServiceRequestFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [useExistingEquipment, setUseExistingEquipment] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState<string>("")

  const [formData, setFormData] = useState<ServiceRequestData>({
    equipment_type: "",
    brand: "",
    model: "",
    serial_number: "",
    problem_description: "",
    priority: "medium",
    accessories: "",
    device_condition: "",
    client_notes: "",
  })

  const handleExistingEquipmentChange = (equipmentId: string) => {
    setSelectedEquipment(equipmentId)
    const equipment = existingEquipments.find((eq) => eq.id === equipmentId)
    if (equipment) {
      setFormData({
        ...formData,
        equipment_id: equipment.id,
        equipment_type: equipment.equipment_type,
        brand: equipment.brand,
        model: equipment.model,
        serial_number: equipment.serial_number || "",
      })
    }
  }

  const handleUseExistingChange = (checked: boolean) => {
    setUseExistingEquipment(checked)
    if (!checked) {
      setSelectedEquipment("")
      setFormData({
        ...formData,
        equipment_id: undefined,
        equipment_type: "",
        brand: "",
        model: "",
        serial_number: "",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!formData.problem_description.trim()) {
        toast.error("Por favor describe el problema del equipo")
        return
      }

      if (!useExistingEquipment && !formData.equipment_type) {
        toast.error("Por favor selecciona el tipo de equipo")
        return
      }

      if (useExistingEquipment && !selectedEquipment) {
        toast.error("Por favor selecciona un equipo existente")
        return
      }

      const supabase = createClient()
      const result = await createServiceRequest(supabase, formData)

      if (result.success) {
        toast.success("Solicitud de servicio creada exitosamente")
        router.push("/client/orders")
      } else {
        toast.error(result.error || "Error al crear la solicitud")
      }
    } catch (error) {
      console.error("Error creating service request:", error)
      toast.error("Error inesperado al crear la solicitud")
    } finally {
      setIsLoading(false)
    }
  }

  const equipmentTypes = [
    { value: "Laptop", label: "Laptop" },
    { value: "PC", label: "PC de Escritorio" },
    { value: "Server", label: "Servidor" },
  ]

  const deviceConditions = [
    { value: "excellent", label: "Excelente" },
    { value: "good", label: "Bueno" },
    { value: "fair", label: "Regular" },
    { value: "poor", label: "Malo" },
    { value: "not_working", label: "No enciende" },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">Nueva Solicitud de Servicio</CardTitle>
          <CardDescription className="text-muted-foreground">
            Completa la información de tu equipo y describe el problema que presenta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Equipment Selection */}
          <div className="space-y-4">
            {existingEquipments.length > 0 && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="existing-equipment"
                  checked={useExistingEquipment}
                  onCheckedChange={handleUseExistingChange}
                />
                <Label htmlFor="existing-equipment" className="text-sm text-foreground">
                  Usar equipo registrado anteriormente
                </Label>
              </div>
            )}

            {useExistingEquipment ? (
              <div>
                <Label className="text-sm font-medium text-foreground">Seleccionar Equipo Existente *</Label>
                <Select value={selectedEquipment} onValueChange={handleExistingEquipmentChange}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecciona un equipo registrado" />
                  </SelectTrigger>
                  <SelectContent>
                    {existingEquipments.map((equipment) => (
                      <SelectItem key={equipment.id} value={equipment.id}>
                        {equipment.equipment_type} {equipment.brand} {equipment.model}
                        {equipment.serial_number && ` - #${equipment.serial_number}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="equipment_type" className="text-sm font-medium text-foreground">
                    Tipo de Equipo *
                  </Label>
                  <Select
                    value={formData.equipment_type}
                    onValueChange={(value) => setFormData({ ...formData, equipment_type: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecciona el tipo de equipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {equipmentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="brand" className="text-sm font-medium text-foreground">
                    Marca
                  </Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Ej: Dell, HP, Apple"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="model" className="text-sm font-medium text-foreground">
                    Modelo
                  </Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="Ej: Inspiron 15, MacBook Pro"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="serial_number" className="text-sm font-medium text-foreground">
                    Número de Serie
                  </Label>
                  <Input
                    id="serial_number"
                    value={formData.serial_number}
                    onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                    placeholder="Número de serie del equipo"
                    className="mt-1"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Problem Description */}
          <div>
            <Label htmlFor="problem_description" className="text-sm font-medium text-foreground">
              Descripción del Problema *
            </Label>
            <Textarea
              id="problem_description"
              value={formData.problem_description}
              onChange={(e) => setFormData({ ...formData, problem_description: e.target.value })}
              placeholder="Describe detalladamente el problema que presenta tu equipo..."
              rows={4}
              className="mt-1"
              required
            />
          </div>

          {/* Priority */}
          <div>
            <Label className="text-sm font-medium text-foreground">Prioridad del Servicio</Label>
            <RadioGroup
              value={formData.priority}
              onValueChange={(value) => setFormData({ ...formData, priority: value as any })}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low" className="text-sm text-foreground">
                  Baja - No es urgente
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="text-sm text-foreground">
                  Media - Necesario en unos días
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high" className="text-sm text-foreground">
                  Alta - Necesario pronto
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="urgent" id="urgent" />
                <Label htmlFor="urgent" className="text-sm text-foreground">
                  Urgente - Necesario inmediatamente
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="device_condition" className="text-sm font-medium text-foreground">
                Estado del Equipo
              </Label>
              <Select
                value={formData.device_condition}
                onValueChange={(value) => setFormData({ ...formData, device_condition: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecciona el estado" />
                </SelectTrigger>
                <SelectContent>
                  {deviceConditions.map((condition) => (
                    <SelectItem key={condition.value} value={condition.value}>
                      {condition.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="accessories" className="text-sm font-medium text-foreground">
                Accesorios Incluidos
              </Label>
              <Input
                id="accessories"
                value={formData.accessories}
                onChange={(e) => setFormData({ ...formData, accessories: e.target.value })}
                placeholder="Ej: Cargador, mouse, cables"
                className="mt-1"
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <Label htmlFor="client_notes" className="text-sm font-medium text-foreground">
              Notas Adicionales
            </Label>
            <Textarea
              id="client_notes"
              value={formData.client_notes}
              onChange={(e) => setFormData({ ...formData, client_notes: e.target.value })}
              placeholder="Información adicional que consideres importante..."
              rows={3}
              className="mt-1"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creando..." : "Crear Solicitud"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
