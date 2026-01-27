"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { OrderStatusBadge } from "./order-status-badge"

interface OrderStatusUpdateDialogProps {
  order: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

const statusOptions = [
  { value: "received", label: "Recibido" },
  { value: "diagnosis", label: "En Diagnóstico" },
  { value: "waiting_parts", label: "Esperando Repuestos" },
  { value: "repair", label: "En Reparación" },
  { value: "testing", label: "En Pruebas" },
  { value: "completed", label: "Completado" },
  { value: "delivered", label: "Entregado" },
  { value: "cancelled", label: "Cancelado" },
]

export function OrderStatusUpdateDialog({ order, open, onOpenChange, onSuccess }: OrderStatusUpdateDialogProps) {
  const [newStatus, setNewStatus] = useState(order?.status || "received")
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)

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
        status: newStatus,
        updated_at: new Date().toISOString(),
      }

      // Add completion date if status is completed
      if (newStatus === "completed" && order.status !== "completed") {
        updateData.completed_date = new Date().toISOString()
      }

      // Add delivery date if status is delivered
      if (newStatus === "delivered" && order.status !== "delivered") {
        updateData.delivered_date = new Date().toISOString()
      }

      // Update internal notes if provided
      if (notes.trim()) {
        const existingNotes = order.internal_notes || ""
        const timestamp = new Date().toLocaleString()
        updateData.internal_notes = existingNotes
          ? `${existingNotes}\n\n[${timestamp}] Cambio de estado: ${notes}`
          : `[${timestamp}] Cambio de estado: ${notes}`
      }

      const { error } = await supabase.from("service_orders").update(updateData).eq("id", order.id)

      if (error) throw error

      toast.success("Estado de la orden actualizado exitosamente")
      onSuccess()
      onOpenChange(false)
      setNotes("")
    } catch (error) {
      console.error("Error updating order status:", error)
      toast.error("Error al actualizar el estado de la orden")
    } finally {
      setIsLoading(false)
    }
  }

  if (!order) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Actualizar Estado de la Orden</DialogTitle>
          <DialogDescription>Cambiar el estado de la orden #{order.order_number}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Estado Actual</Label>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
              <OrderStatusBadge status={order.status} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newStatus">Nuevo Estado</Label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas del Cambio (Opcional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Agregar notas sobre el cambio de estado..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading || newStatus === order.status}>
              {isLoading ? "Actualizando..." : "Actualizar Estado"}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
