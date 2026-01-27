"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface User {
  id: string
  name: string
  email: string
  role: string
  status: string
  phone?: string
}

interface EditUserDialogProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
  onSave: (userData: Partial<User>) => Promise<void>
}

export function EditUserDialog({ user, isOpen, onClose, onSave }: EditUserDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    phone: "",
    status: "active",
  })

  useEffect(() => {
    console.log("[v0] EditUserDialog useEffect triggered with user:", user, "isOpen:", isOpen)
    if (user && isOpen) {
      const newFormData = {
        name: user.name || "",
        email: user.email || "",
        role: user.role || "",
        phone: user.phone || "",
        status: user.status || "active",
      }
      console.log("[v0] Setting form data:", newFormData)
      setFormData(newFormData)
    } else if (!isOpen) {
      // Reset form when dialog closes
      setFormData({
        name: "",
        email: "",
        role: "",
        phone: "",
        status: "active",
      })
    }
  }, [user, isOpen])

  useEffect(() => {
    console.log("[v0] Form data updated:", formData)
  }, [formData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    console.log("[v0] Submitting form data:", formData)
    setIsLoading(true)
    try {
      await onSave({
        id: user.id,
        ...formData,
      })
      onClose()
    } catch (error) {
      console.error("Error updating user:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    console.log(`[v0] Updating ${field} to:`, value)
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium">
              Nombre Completo
            </Label>
            <Input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="mt-1"
              placeholder="Ingrese el nombre completo"
            />
            <div className="text-xs text-gray-500 mt-1">Valor actual: {formData.name}</div>
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="mt-1"
              placeholder="usuario@ejemplo.com"
            />
            <div className="text-xs text-gray-500 mt-1">Valor actual: {formData.email}</div>
          </div>

          <div>
            <Label htmlFor="phone" className="text-sm font-medium">
              Teléfono
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="mt-1"
              placeholder="+1 (555) 123-4567"
            />
            <div className="text-xs text-gray-500 mt-1">Valor actual: {formData.phone}</div>
          </div>

          <div>
            <Label htmlFor="role" className="text-sm font-medium">
              Rol
            </Label>
            <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Seleccionar rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="technician">Técnico</SelectItem>
                <SelectItem value="receptionist">Recepcionista</SelectItem>
                <SelectItem value="client">Cliente</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-xs text-gray-500 mt-1">Valor actual: {formData.role}</div>
          </div>

          <div>
            <Label htmlFor="status" className="text-sm font-medium">
              Estado
            </Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-xs text-gray-500 mt-1">Valor actual: {formData.status}</div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
