"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface ReceptionistAssignmentDialogProps {
  order: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function ReceptionistAssignmentDialog({
  order,
  open,
  onOpenChange,
  onSuccess,
}: ReceptionistAssignmentDialogProps) {
  const [selectedReceptionist, setSelectedReceptionist] = useState(order?.receptionist_id || "none")
  const [receptionists, setReceptionists] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingReceptionists, setIsLoadingReceptionists] = useState(false)

  useEffect(() => {
    if (open) {
      loadReceptionists()
    }
  }, [open])

  const loadReceptionists = async () => {
    setIsLoadingReceptionists(true)
    const supabase = createClient()

    if (!supabase) {
      toast.error("Error de configuración: Supabase no está configurado correctamente.")
      setIsLoadingReceptionists(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .eq("role", "receptionist")
        .eq("is_active", true)
        .order("full_name")

      if (error) throw error
      setReceptionists(data || [])
    } catch (error) {
      console.error("Error loading receptionists:", error)
      toast.error("Error al cargar la lista de recepcionistas")
    } finally {
      setIsLoadingReceptionists(false)
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
          receptionist_id: selectedReceptionist === "none" ? null : selectedReceptionist,
          updated_at: new Date().toISOString(),
        })
        .eq("id", order.id)

      if (error) throw error

      const receptionistName = receptionists.find((r) => r.id === selectedReceptionist)?.full_name || "Sin asignar"
      toast.success(`Recepcionista ${receptionistName} asignado exitosamente`)
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error("Error assigning receptionist:", error)
      toast.error("Error al asignar el recepcionista")
    } finally {
      setIsLoading(false)
    }
  }

  if (!order) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Asignar Recepcionista</DialogTitle>
          <DialogDescription>Asignar un recepcionista a la orden #{order.order_number}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Recepcionista Actual</Label>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md text-sm">
              {order.receptionist?.full_name || "Sin asignar"}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="receptionist">Seleccionar Recepcionista</Label>
            <Select
              value={selectedReceptionist}
              onValueChange={setSelectedReceptionist}
              disabled={isLoadingReceptionists}
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoadingReceptionists ? "Cargando..." : "Seleccionar recepcionista"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin asignar</SelectItem>
                {receptionists.map((receptionist) => (
                  <SelectItem key={receptionist.id} value={receptionist.id}>
                    {receptionist.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading || isLoadingReceptionists}>
              {isLoading ? "Asignando..." : "Asignar Recepcionista"}
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
