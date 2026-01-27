"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface OrderAssignmentDialogProps {
  order: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function OrderAssignmentDialog({ order, open, onOpenChange, onSuccess }: OrderAssignmentDialogProps) {
  const [selectedTechnician, setSelectedTechnician] = useState(order?.technician_id || "none")
  const [technicians, setTechnicians] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingTechnicians, setIsLoadingTechnicians] = useState(false)

  useEffect(() => {
    if (open) {
      loadTechnicians()
    }
  }, [open])

  const loadTechnicians = async () => {
    setIsLoadingTechnicians(true)
    const supabase = createClient()

    if (!supabase) {
      toast.error("Error de configuración: Supabase no está configurado correctamente.")
      setIsLoadingTechnicians(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .eq("role", "technician")
        .eq("is_active", true)
        .order("full_name")

      if (error) throw error
      setTechnicians(data || [])
    } catch (error) {
      console.error("Error loading technicians:", error)
      toast.error("Error al cargar la lista de técnicos")
    } finally {
      setIsLoadingTechnicians(false)
    }
  }

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
      const { error } = await supabase
        .from("service_orders")
        .update({
          technician_id: selectedTechnician === "none" ? null : selectedTechnician,
          updated_at: new Date().toISOString(),
        })
        .eq("id", order.id)

      if (error) throw error

      const technicianName = technicians.find((t) => t.id === selectedTechnician)?.full_name || "Sin asignar"
      toast.success(`Orden asignada a ${technicianName} exitosamente`)
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error("Error assigning technician:", error)
      toast.error("Error al asignar el técnico")
    } finally {
      setIsLoading(false)
    }
  }

  if (!order) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Asignar Técnico</DialogTitle>
          <DialogDescription>Asignar un técnico a la orden #{order.order_number}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Técnico Actual</Label>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md text-sm">
              {order.technician?.full_name || "Sin asignar"}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="technician">Seleccionar Técnico</Label>
            <Select value={selectedTechnician} onValueChange={setSelectedTechnician} disabled={isLoadingTechnicians}>
              <SelectTrigger>
                <SelectValue placeholder={isLoadingTechnicians ? "Cargando..." : "Seleccionar técnico"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin asignar</SelectItem>
                {technicians.map((technician) => (
                  <SelectItem key={technician.id} value={technician.id}>
                    {technician.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading || isLoadingTechnicians}>
              {isLoading ? "Asignando..." : "Asignar Técnico"}
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
