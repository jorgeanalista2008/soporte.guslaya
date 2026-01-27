"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  fetchClients,
  fetchTechnicians,
  fetchReceptionists,
  fetchEquipments,
  type Client,
  type UserProfile,
  type Equipment,
} from "@/lib/data-fetchers"

interface NewOrderFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function NewOrderForm({ onSuccess, onCancel }: NewOrderFormProps) {
  const [formData, setFormData] = useState({
    client_id: "",
    technician_id: "",
    receptionist_id: "",
    equipment_id: "",
    deviceCondition: "",
    accessories: "",
    problemDescription: "",
    priority: "medium",
    estimatedCost: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<{ id: string; full_name: string } | null>(null)

  const [clients, setClients] = useState<Client[]>([])
  const [technicians, setTechnicians] = useState<UserProfile[]>([])
  const [receptionists, setReceptionists] = useState<UserProfile[]>([])
  const [equipments, setEquipments] = useState<Equipment[]>([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      console.log("[v0] NewOrderForm: Starting to load data...")
      setLoadingData(true)

      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          const { data: profile } = await supabase.from("profiles").select("id, full_name").eq("id", user.id).single()

          if (profile) {
            setCurrentUser(profile)
            setFormData((prev) => ({ ...prev, receptionist_id: profile.id }))
          }
        }

        const [clientsData, techniciansData, receptionistsData, equipmentsData] = await Promise.all([
          fetchClients(),
          fetchTechnicians(),
          fetchReceptionists(),
          fetchEquipments(),
        ])

        console.log("[v0] NewOrderForm: Data loaded successfully")
        console.log("[v0] Clients:", clientsData.length)
        console.log("[v0] Technicians:", techniciansData.length)
        console.log("[v0] Receptionists:", receptionistsData.length)
        console.log("[v0] Equipments:", equipmentsData.length)

        setClients(clientsData)
        setTechnicians(techniciansData)
        setReceptionists(receptionistsData)
        setEquipments(equipmentsData)
      } catch (error) {
        console.error("[v0] NewOrderForm: Error loading data:", error)
        setError("Error al cargar los datos. Por favor, recarga la página.")
      } finally {
        setLoadingData(false)
      }
    }

    loadData()
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    console.log("[v0] NewOrderForm: Submitting form with data:", formData)

    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Usuario no autenticado")

      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`

      const orderData = {
        order_number: orderNumber,
        client_id: formData.client_id,
        technician_id: formData.technician_id === "none" || !formData.technician_id ? null : formData.technician_id,
        receptionist_id: user.id,
        equipment_id: formData.equipment_id === "none" || !formData.equipment_id ? null : formData.equipment_id,
        device_condition: formData.deviceCondition,
        accessories: formData.accessories,
        problem_description: formData.problemDescription,
        priority: formData.priority,
        estimated_cost: formData.estimatedCost ? Number.parseFloat(formData.estimatedCost) : null,
        status: "received",
      }

      console.log("[v0] NewOrderForm: Processed order data:", orderData)

      const { error: orderError } = await supabase.from("service_orders").insert(orderData)

      if (orderError) throw orderError

      console.log("[v0] NewOrderForm: Order created successfully")

      setFormData({
        client_id: "",
        technician_id: "",
        receptionist_id: currentUser?.id || "",
        equipment_id: "",
        deviceCondition: "",
        accessories: "",
        problemDescription: "",
        priority: "medium",
        estimatedCost: "",
      })

      onSuccess?.()
    } catch (error: unknown) {
      console.error("[v0] NewOrderForm: Error creating order:", error)
      setError(error instanceof Error ? error.message : "Error al crear la orden")
    } finally {
      setIsLoading(false)
    }
  }

  if (loadingData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Cargando datos...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nueva Orden de Servicio</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client_id">Cliente *</Label>
            <Select value={formData.client_id} onValueChange={(value) => handleInputChange("client_id", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name} - {client.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="technician_id">Técnico Asignado</Label>
            <Select value={formData.technician_id} onValueChange={(value) => handleInputChange("technician_id", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar técnico (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin asignar</SelectItem>
                {technicians.map((technician) => (
                  <SelectItem key={technician.id} value={technician.id}>
                    {technician.full_name} - {technician.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="receptionist_id">Recepcionista</Label>
            <Input
              value={currentUser ? `${currentUser.full_name} (Usuario actual)` : "Cargando..."}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="equipment_id">Equipo</Label>
            <Select value={formData.equipment_id} onValueChange={(value) => handleInputChange("equipment_id", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar equipo (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin equipo asignado</SelectItem>
                {equipments.length > 0 ? (
                  equipments.map((equipment) => (
                    <SelectItem key={equipment.id} value={equipment.id}>
                      {equipment.equipment_type} - {equipment.brand} {equipment.model} ({equipment.serial_number})
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-equipments" disabled>
                    No hay equipos disponibles
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {equipments.length === 0 && (
              <p className="text-sm text-gray-500">No se encontraron equipos activos en el sistema.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="deviceCondition">Estado del Dispositivo</Label>
            <Textarea
              id="deviceCondition"
              value={formData.deviceCondition}
              onChange={(e) => handleInputChange("deviceCondition", e.target.value)}
              placeholder="Describe el estado físico del dispositivo..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accessories">Accesorios Incluidos</Label>
            <Input
              id="accessories"
              value={formData.accessories}
              onChange={(e) => handleInputChange("accessories", e.target.value)}
              placeholder="Cargador, mouse, cables, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="problemDescription">Descripción del Problema *</Label>
            <Textarea
              id="problemDescription"
              required
              value={formData.problemDescription}
              onChange={(e) => handleInputChange("problemDescription", e.target.value)}
              placeholder="Describe detalladamente el problema reportado por el cliente..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Prioridad</Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedCost">Costo Estimado (Opcional)</Label>
              <Input
                id="estimatedCost"
                type="number"
                step="0.01"
                value={formData.estimatedCost}
                onChange={(e) => handleInputChange("estimatedCost", e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Creando..." : "Crear Orden"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
