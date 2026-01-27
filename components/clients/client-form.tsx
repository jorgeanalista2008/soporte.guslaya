"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

interface ClientFormProps {
  client?: {
    id: string
    user_id: string
    full_name: string
    email: string
    phone?: string
    company_name?: string
    address?: string
    city?: string
    postal_code?: string
    tax_id?: string
    notes?: string
    is_active: boolean
  }
  onSuccess?: () => void
  onCancel?: () => void
}

export function ClientForm({ client, onSuccess, onCancel }: ClientFormProps) {
  const [formData, setFormData] = useState({
    full_name: client?.full_name || "",
    email: client?.email || "",
    phone: client?.phone || "",
    company_name: client?.company_name || "",
    address: client?.address || "",
    city: client?.city || "",
    postal_code: client?.postal_code || "",
    tax_id: client?.tax_id || "",
    notes: client?.notes || "",
    is_active: client?.is_active ?? true,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    if (!supabase) {
      setError("Error de configuración: No se pudo conectar con la base de datos")
      setIsLoading(false)
      return
    }

    try {
      if (client) {
        // Update existing client
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            full_name: formData.full_name,
            email: formData.email,
            phone: formData.phone,
            is_active: formData.is_active,
          })
          .eq("id", client.user_id)

        if (profileError) throw profileError

        const { error: clientError } = await supabase
          .from("clients")
          .update({
            company_name: formData.company_name,
            address: formData.address,
            city: formData.city,
            postal_code: formData.postal_code,
            tax_id: formData.tax_id,
            notes: formData.notes,
          })
          .eq("id", client.id)

        if (clientError) throw clientError
      } else {
        // Create new client - this would require creating a user account first
        // For now, we'll show an error message
        throw new Error("La creación de nuevos clientes debe hacerse a través del registro de usuarios")
      }

      onSuccess?.()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Error al guardar el cliente")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{client ? "Editar Cliente" : "Nuevo Cliente"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nombre Completo *</Label>
              <Input
                id="full_name"
                required
                value={formData.full_name}
                onChange={(e) => handleInputChange("full_name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_name">Empresa</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => handleInputChange("company_name", e.target.value)}
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Ciudad</Label>
              <Input id="city" value={formData.city} onChange={(e) => handleInputChange("city", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postal_code">Código Postal</Label>
              <Input
                id="postal_code"
                value={formData.postal_code}
                onChange={(e) => handleInputChange("postal_code", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tax_id">RFC/NIT</Label>
            <Input id="tax_id" value={formData.tax_id} onChange={(e) => handleInputChange("tax_id", e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
              placeholder="Notas adicionales sobre el cliente..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => handleInputChange("is_active", checked)}
            />
            <Label htmlFor="is_active">Cliente activo</Label>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Guardando..." : client ? "Actualizar Cliente" : "Crear Cliente"}
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
