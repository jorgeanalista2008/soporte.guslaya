"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import {
  fetchClients,
  fetchTechnicians,
  fetchReceptionists,
  fetchEquipments,
  type Client,
  type UserProfile,
  type Equipment,
} from "@/lib/data-fetchers"

interface EditOrderDialogProps {
  order: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditOrderDialog({ order, open, onOpenChange, onSuccess }: EditOrderDialogProps) {
  const [formData, setFormData] = useState({
    client_id: "",
    technician_id: "",
    receptionist_id: "",
    equipment_id: "",
    device_condition: "",
    accessories: "",
    problem_description: "",
    diagnosis: "",
    solution: "",
    priority: "medium",
    estimated_cost: "",
    final_cost: "",
    advance_payment: "",
    estimated_completion: "",
    internal_notes: "",
    client_notes: "",
    warranty_days: "30",
  })
  const [isLoading, setIsLoading] = useState(false)

  const [clients, setClients] = useState<Client[]>([])
  const [technicians, setTechnicians] = useState<UserProfile[]>([])
  const [receptionists, setReceptionists] = useState<UserProfile[]>([])
  const [equipments, setEquipments] = useState<Equipment[]>([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      if (!open) return

      console.log("[v0] EditOrderDialog: Starting to load data...")
      setLoadingData(true)

      try {
        const [clientsData, techniciansData, receptionistsData, equipmentsData] = await Promise.all([
          fetchClients(),
          fetchTechnicians(),
          fetchReceptionists(),
          fetchEquipments(),
        ])

        console.log("[v0] EditOrderDialog: Data loaded successfully")
        console.log("[v0] Clients:", clientsData.length)
        console.log("[v0] Technicians:", techniciansData.length)
        console.log("[v0] Receptionists:", receptionistsData.length)
        console.log("[v0] Equipments:", equipmentsData.length)

        setClients(clientsData)
        setTechnicians(techniciansData)
        setReceptionists(receptionistsData)
        setEquipments(equipmentsData)
      } catch (error) {
        console.error("[v0] EditOrderDialog: Error loading data:", error)
        toast.error("Error al cargar los datos")
      } finally {
        setLoadingData(false)
      }
    }

    loadData()
  }, [open])

  useEffect(() => {
    if (order) {
      setFormData({
        client_id: order.client_id || "",
        technician_id: order.technician_id || "none",
        receptionist_id: order.receptionist_id || "none",
        equipment_id: order.equipment_id || "none",
        device_condition: order.device_condition || "",
        accessories: order.accessories || "",
        problem_description: order.problem_description || "",
        diagnosis: order.diagnosis || "",
        solution: order.solution || "",
        priority: order.priority || "medium",
        estimated_cost: order.estimated_cost?.toString() || "",
        final_cost: order.final_cost?.toString() || "",
        advance_payment: order.advance_payment?.toString() || "",
        estimated_completion: order.estimated_completion
          ? new Date(order.estimated_completion).toISOString().split("T")[0]
          : "",
        internal_notes: order.internal_notes || "",
        client_notes: order.client_notes || "",
        warranty_days: order.warranty_days?.toString() || "30",
      })
    }
  }, [order])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()
    if (!supabase) {
      toast.error("Error de configuración: Supabase no está configurado correctamente.")
      setIsLoading(false)
      return
    }

    try {
      const updateData: any = {
        client_id: formData.client_id,
        technician_id: formData.technician_id === "none" ? null : formData.technician_id,
        receptionist_id: formData.receptionist_id === "none" ? null : formData.receptionist_id,
        equipment_id: formData.equipment_id === "none" ? null : formData.equipment_id,
        device_condition: formData.device_condition,
        accessories: formData.accessories,
        problem_description: formData.problem_description,
        diagnosis: formData.diagnosis,
        solution: formData.solution,
        priority: formData.priority,
        estimated_cost: formData.estimated_cost ? Number.parseFloat(formData.estimated_cost) : null,
        final_cost: formData.final_cost ? Number.parseFloat(formData.final_cost) : null,
        advance_payment: formData.advance_payment ? Number.parseFloat(formData.advance_payment) : null,
        estimated_completion: formData.estimated_completion
          ? new Date(formData.estimated_completion).toISOString()
          : null,
        internal_notes: formData.internal_notes,
        client_notes: formData.client_notes,
        warranty_days: Number.parseInt(formData.warranty_days),
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase.from("service_orders").update(updateData).eq("id", order.id)

      if (error) throw error

      toast.success("Orden actualizada exitosamente")
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating order:", error)
      toast.error("Error al actualizar la orden")
    } finally {
      setIsLoading(false)
    }
  }

  if (!order) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Orden #{order.order_number}</DialogTitle>
          <DialogDescription>Modifica la información de la orden de servicio</DialogDescription>
        </DialogHeader>

        {loadingData ? (
          <div className="text-center py-4">Cargando datos...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Asignaciones</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client_id">Cliente</Label>
                  <Select
                    value={formData.client_id}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, client_id: value }))}
                  >
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
                  <Select
                    value={formData.technician_id}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, technician_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar técnico" />
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
                  <Select
                    value={formData.receptionist_id}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, receptionist_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar recepcionista" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin asignar</SelectItem>
                      {receptionists.map((receptionist) => (
                        <SelectItem key={receptionist.id} value={receptionist.id}>
                          {receptionist.full_name} - {receptionist.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="equipment_id">Equipo</Label>
                  <Select
                    value={formData.equipment_id}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, equipment_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar equipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin equipo asignado</SelectItem>
                      {equipments.map((equipment) => (
                        <SelectItem key={equipment.id} value={equipment.id}>
                          {equipment.equipment_type} - {equipment.brand} {equipment.model} ({equipment.serial_number})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Información del Dispositivo</h3>
              <div className="space-y-2">
                <Label htmlFor="device_condition">Estado del Dispositivo</Label>
                <Textarea
                  id="device_condition"
                  value={formData.device_condition}
                  onChange={(e) => setFormData((prev) => ({ ...prev, device_condition: e.target.value }))}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accessories">Accesorios</Label>
                <Input
                  id="accessories"
                  value={formData.accessories}
                  onChange={(e) => setFormData((prev) => ({ ...prev, accessories: e.target.value }))}
                />
              </div>
            </div>

            {/* Descripción del Problema y Diagnóstico */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Problema y Diagnóstico</h3>
              <div className="space-y-2">
                <Label htmlFor="problem_description">Descripción del Problema</Label>
                <Textarea
                  id="problem_description"
                  value={formData.problem_description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, problem_description: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="diagnosis">Diagnóstico</Label>
                <Textarea
                  id="diagnosis"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData((prev) => ({ ...prev, diagnosis: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="solution">Solución</Label>
                <Textarea
                  id="solution"
                  value={formData.solution}
                  onChange={(e) => setFormData((prev) => ({ ...prev, solution: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>

            {/* Prioridad y Fechas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Prioridad y Fechas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Prioridad</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, priority: value }))}
                  >
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
                  <Label htmlFor="estimated_completion">Fecha Estimada de Finalización</Label>
                  <Input
                    id="estimated_completion"
                    type="date"
                    value={formData.estimated_completion}
                    onChange={(e) => setFormData((prev) => ({ ...prev, estimated_completion: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Información Financiera */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Información Financiera</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estimated_cost">Costo Estimado</Label>
                  <Input
                    id="estimated_cost"
                    type="number"
                    step="0.01"
                    value={formData.estimated_cost}
                    onChange={(e) => setFormData((prev) => ({ ...prev, estimated_cost: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="final_cost">Costo Final</Label>
                  <Input
                    id="final_cost"
                    type="number"
                    step="0.01"
                    value={formData.final_cost}
                    onChange={(e) => setFormData((prev) => ({ ...prev, final_cost: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="advance_payment">Anticipo</Label>
                  <Input
                    id="advance_payment"
                    type="number"
                    step="0.01"
                    value={formData.advance_payment}
                    onChange={(e) => setFormData((prev) => ({ ...prev, advance_payment: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="warranty_days">Días de Garantía</Label>
                <Input
                  id="warranty_days"
                  type="number"
                  value={formData.warranty_days}
                  onChange={(e) => setFormData((prev) => ({ ...prev, warranty_days: e.target.value }))}
                />
              </div>
            </div>

            {/* Notas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Notas</h3>
              <div className="space-y-2">
                <Label htmlFor="internal_notes">Notas Internas</Label>
                <Textarea
                  id="internal_notes"
                  value={formData.internal_notes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, internal_notes: e.target.value }))}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client_notes">Notas del Cliente</Label>
                <Textarea
                  id="client_notes"
                  value={formData.client_notes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, client_notes: e.target.value }))}
                  rows={2}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Guardando..." : "Guardar Cambios"}
              </Button>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
