"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"

interface User {
  id: string
  name: string
  email: string
  role: string
  commission_percentage?: number
}

interface CommissionDialogProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
  onSave: (userId: string, commissionPercentage: number) => Promise<void>
}

export function CommissionDialog({ user, isOpen, onClose, onSave }: CommissionDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [commissionPercentage, setCommissionPercentage] = useState<string>("")

  useEffect(() => {
    if (user && isOpen) {
      setCommissionPercentage(user.commission_percentage?.toString() || "0")
    } else if (!isOpen) {
      setCommissionPercentage("")
    }
  }, [user, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const percentage = Number.parseFloat(commissionPercentage)

    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      toast.error("El porcentaje debe ser un número entre 0 y 100")
      return
    }

    setIsLoading(true)
    try {
      await onSave(user.id, percentage)
      toast.success("Porcentaje de comisión actualizado exitosamente")
      onClose()
    } catch (error) {
      console.error("Error updating commission:", error)
      toast.error("Error al actualizar el porcentaje de comisión")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configurar Comisión - {user?.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="commission" className="text-sm font-medium">
              Porcentaje de Comisión (%)
            </Label>
            <Input
              id="commission"
              type="number"
              min="0"
              max="100"
              step="0.01"
              required
              value={commissionPercentage}
              onChange={(e) => setCommissionPercentage(e.target.value)}
              className="mt-1"
              placeholder="Ej: 15.50"
            />
            <div className="text-xs text-muted-foreground mt-1">
              Ingrese el porcentaje que recibirá el técnico por cada orden completada (0-100%)
            </div>
          </div>

          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm text-muted-foreground">
              <strong>Ejemplo:</strong> Si una orden tiene un costo final de $100 y el porcentaje es 15%, el técnico
              recibirá $15 de comisión.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar Comisión"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
