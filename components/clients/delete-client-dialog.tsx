"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Client {
  id: string
  user_id: string
  full_name: string
  email: string
  phone?: string
  company_name?: string
  address?: string
  city?: string
  is_active: boolean
  created_at: string
  _count?: {
    service_orders: number
  }
}

interface DeleteClientDialogProps {
  client: Client | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (clientId: string) => void
}

export function DeleteClientDialog({ client, open, onOpenChange, onSuccess }: DeleteClientDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!client) return

    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    if (!supabase) {
      setError("Error de configuración: No se pudo conectar con la base de datos")
      setIsLoading(false)
      return
    }

    try {
      // Check if client has service orders
      if (client._count?.service_orders && client._count.service_orders > 0) {
        throw new Error("No se puede eliminar un cliente que tiene órdenes de servicio asociadas")
      }

      // Delete client record first
      const { error: clientError } = await supabase.from("clients").delete().eq("user_id", client.user_id)

      if (clientError) throw clientError

      // Deactivate profile instead of deleting (to preserve referential integrity)
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ is_active: false })
        .eq("id", client.user_id)

      if (profileError) throw profileError

      onSuccess(client.id)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Error al eliminar el cliente")
    } finally {
      setIsLoading(false)
    }
  }

  if (!client) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Eliminar Cliente
          </DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. El cliente será desactivado permanentemente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium">{client.full_name}</p>
            <p className="text-sm text-gray-600">{client.email}</p>
            {client.company_name && <p className="text-sm text-gray-600">{client.company_name}</p>}
          </div>

          {client._count?.service_orders && client._count.service_orders > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Advertencia:</strong> Este cliente tiene {client._count.service_orders} órdenes de servicio
                asociadas. No se puede eliminar.
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>
          )}

          <div className="flex gap-3">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading || (client._count?.service_orders && client._count.service_orders > 0)}
              className="flex-1"
            >
              {isLoading ? "Eliminando..." : "Eliminar Cliente"}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
