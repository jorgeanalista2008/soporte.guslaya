"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { AlertTriangle, Trash2 } from "lucide-react"

interface DeleteOrderDialogProps {
  order: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function DeleteOrderDialog({ order, open, onOpenChange, onSuccess }: DeleteOrderDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    if (!order || order.status !== "cancelled") {
      toast.error("Solo se pueden eliminar órdenes canceladas")
      return
    }

    setIsLoading(true)

    const supabase = createClient()
    if (!supabase) {
      toast.error("Error de configuración: Supabase no está configurado correctamente.")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.from("service_orders").delete().eq("id", order.id)

      if (error) throw error

      toast.success("Orden eliminada exitosamente")
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error("Error deleting order:", error)
      toast.error("Error al eliminar la orden")
    } finally {
      setIsLoading(false)
    }
  }

  if (!order) return null

  const canDelete = order.status === "cancelled"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-600" />
            Eliminar Orden
          </DialogTitle>
          <DialogDescription>¿Estás seguro de que deseas eliminar la orden #{order.order_number}?</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!canDelete && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Solo se pueden eliminar órdenes que estén en estado "Cancelado". Esta orden está en estado:{" "}
                <strong>{order.status}</strong>
              </AlertDescription>
            </Alert>
          )}

          {canDelete && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Esta acción no se puede deshacer. La orden y toda su información asociada será eliminada
                permanentemente.
              </AlertDescription>
            </Alert>
          )}

          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
            <div className="text-sm">
              <div>
                <strong>Orden:</strong> {order.order_number}
              </div>
              <div>
                <strong>Cliente:</strong> {order.client?.full_name || order.profiles?.full_name || "N/A"}
              </div>
              <div>
                <strong>Dispositivo:</strong> {order.equipment?.equipment_type || order.device_type || "N/A"}
              </div>
              <div>
                <strong>Estado:</strong> {order.status}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading || !canDelete}>
              {isLoading ? "Eliminando..." : "Eliminar Orden"}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
