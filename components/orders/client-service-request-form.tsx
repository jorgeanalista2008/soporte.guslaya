"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import type { ServiceRequest } from "@/lib/services/client-service"

interface ClientServiceRequestFormProps {
  onSubmit: (data: ServiceRequest) => Promise<{ success: boolean; orderId?: string; error?: string }>
  isLoading?: boolean
}

export function ClientServiceRequestForm({ onSubmit, isLoading = false }: ClientServiceRequestFormProps) {
  const [formData, setFormData] = useState<ServiceRequest>({
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

  const [useExistingEquipment, setUseExistingEquipment] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.equipment_type || !formData.problem_description) {
      toast.error("Por favor completa los campos requeridos")
      return
    }

    const result = await onSubmit(formData)

    if (result.success) {
      toast.success("Solicitud de servicio creada exitosamente")
      // Reset form
      setFormData({
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
    } else {
      toast.error(result.error || "Error al crear la solicitud")
    }
  }

  const equipmentTypes = [
    "Laptop",
    "PC de Escritorio",
    "Servidor",
    "Impresora",
    "Monitor",
    "Smartphone",
    "Tablet",
    "Router",
    "Switch",
    "Otro",
  ]

  const deviceConditions = ["Excelente", "Bueno", "Regular", "Malo", "No enciende"]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Nueva Solicitud de Servicio
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Completa la información de tu equipo y describe el problema que presenta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Equipment Selection */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="existing-equipment"
                checked={useExistingEquipment}
                onCheckedChange={setUseExistingEquipment}
              />
              <Label htmlFor="existing-equipment" className="text-sm text-gray-700 dark:text-gray-300">
                Usar equipo registrado anteriormente
              </Label>
            </div>

            {!useExistingEquipment ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="equipment_type" className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
                        <SelectItem key={type} value={type.toLowerCase().replace(/\s+/g, "_")}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="brand" className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
                  <Label htmlFor="model" className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
                  <Label htmlFor="serial_number" className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
            ) : (
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Seleccionar Equipo Existente
                </Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecciona un equipo registrado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="laptop-dell-1">Laptop Dell Inspiron 15 - #ABC123</SelectItem>
                    <SelectItem value="pc-hp-1">PC HP Pavilion - #DEF456</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Problem Description */}
          <div>
            <Label htmlFor="problem_description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Prioridad del Servicio</Label>
            <RadioGroup
              value={formData.priority}
              onValueChange={(value) => setFormData({ ...formData, priority: value as any })}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low" className="text-sm text-gray-700 dark:text-gray-300">
                  Baja - No es urgente
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="text-sm text-gray-700 dark:text-gray-300">
                  Media - Necesario en unos días
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high" className="text-sm text-gray-700 dark:text-gray-300">
                  Alta - Necesario pronto
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="urgent" id="urgent" />
                <Label htmlFor="urgent" className="text-sm text-gray-700 dark:text-gray-300">
                  Urgente - Necesario inmediatamente
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="device_condition" className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
                    <SelectItem key={condition} value={condition.toLowerCase()}>
                      {condition}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="accessories" className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
            <Label htmlFor="client_notes" className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
            <Button
              type="button"
              variant="outline"
              className="border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 bg-transparent"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isLoading ? "Creando..." : "Crear Solicitud"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
