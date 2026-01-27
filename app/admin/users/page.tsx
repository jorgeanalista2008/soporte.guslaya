"use client"

import type React from "react"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { UserStatsCards } from "@/components/users/user-stats-cards"
import { UserTable } from "@/components/users/user-table"
import { useUsersData } from "@/hooks/use-users-data"
import { createUser, type CreateUserData } from "@/app/actions/create-user"
import { updateUser, toggleUserStatus } from "@/app/actions/update-user"
import { CommissionDialog } from "@/components/users/commission-dialog"
import { ChangePasswordDialog } from "@/components/users/change-password-dialog" // Added password dialog import
import { updateUserCommission } from "@/app/actions/update-user-commission"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EditUserDialog } from "@/components/users/edit-user-dialog"
import { toast } from "sonner"

export default function AdminUsers() {
  const { users, stats, loading, error, refreshUsers } = useUsersData()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [commissionUser, setCommissionUser] = useState<any>(null)
  const [isCommissionDialogOpen, setIsCommissionDialogOpen] = useState(false)
  const [passwordUser, setPasswordUser] = useState<any>(null)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "",
    phone: "",
    password: "",
  })

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await createUser(formData as CreateUserData)

      if (!result.success) {
        toast.error(`Error creando usuario: ${result.error}`)
        return
      }

      setFormData({ fullName: "", email: "", role: "", phone: "", password: "" })
      setIsModalOpen(false)
      toast.success("Usuario creado exitosamente")

      refreshUsers()
    } catch (error) {
      console.error("Error inesperado:", error)
      toast.error("Error inesperado al crear usuario")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditUser = (user: any) => {
    console.log("[v0] Opening edit dialog for user:", user)
    const mappedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      phone: user.phone || "",
    }
    console.log("[v0] Mapped user data for dialog:", mappedUser)
    setEditingUser(mappedUser)
    setIsEditDialogOpen(true)
  }

  const handleSaveUser = async (userData: any) => {
    console.log("[v0] Saving user data:", userData)

    try {
      const updateData = {
        id: userData.id,
        full_name: userData.name, // Map name to full_name for the action
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        is_active: userData.status === "active", // Map status to is_active boolean
      }

      console.log("[v0] Mapped update data:", updateData)
      const result = await updateUser(updateData)

      if (!result.success) {
        toast.error(`Error actualizando usuario: ${result.error}`)
        return
      }

      toast.success("Usuario actualizado exitosamente")
      setIsEditDialogOpen(false)
      setEditingUser(null)
      refreshUsers()
    } catch (error) {
      console.error("Error inesperado:", error)
      toast.error("Error inesperado al actualizar usuario")
    }
  }

  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    console.log("[v0] Toggling user status:", { userId, currentStatus })

    // Optimistic update - update UI immediately
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, status: currentStatus === "active" ? "inactive" : "active" } : user,
    )

    try {
      const result = await toggleUserStatus(userId, currentStatus)

      if (!result.success) {
        toast.error(`Error cambiando estado del usuario: ${result.error}`)
        // Revert optimistic update on error
        refreshUsers()
        return
      }

      const action = currentStatus === "active" ? "desactivado" : "activado"
      toast.success(`Usuario ${action} exitosamente`)
      // Refresh to ensure data consistency
      refreshUsers()
    } catch (error) {
      console.error("Error inesperado:", error)
      toast.error("Error inesperado al cambiar estado del usuario")
      // Revert optimistic update on error
      refreshUsers()
    }
  }

  const handleEditCommission = (user: any) => {
    console.log("[v0] Opening commission dialog for user:", user)
    setCommissionUser(user)
    setIsCommissionDialogOpen(true)
  }

  const handleSaveCommission = async (userId: string, commissionPercentage: number) => {
    console.log("[v0] Saving commission:", { userId, commissionPercentage })

    try {
      const result = await updateUserCommission(userId, commissionPercentage)

      if (!result.success) {
        throw new Error(result.error)
      }

      setIsCommissionDialogOpen(false)
      setCommissionUser(null)
      refreshUsers()
    } catch (error) {
      console.error("Error updating commission:", error)
      throw error
    }
  }

  const handleChangePassword = (user: any) => {
    console.log("[v0] Opening password dialog for user:", user)
    setPasswordUser(user)
    setIsPasswordDialogOpen(true)
  }

  const mockUser = {
    name: "Admin Usuario",
    email: "admin@techservice.com",
    role: "administrador",
  }

  if (loading) {
    return (
      <AdminLayout userInfo={mockUser}>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Cargando usuarios...</div>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout userInfo={mockUser}>
        <div className="flex items-center justify-center h-64">
          <div className="text-destructive">Error: {error}</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout userInfo={mockUser}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestión de Usuarios</h1>
            <p className="text-muted-foreground">Administrar usuarios del sistema y sus roles</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsModalOpen(true)}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nuevo Usuario
          </Button>
        </div>

        <UserStatsCards stats={stats} users={users} />
        <UserTable
          users={users}
          onEditUser={handleEditUser}
          onToggleUserStatus={handleToggleUserStatus}
          onEditCommission={handleEditCommission}
          onChangePassword={handleChangePassword} // Added password change prop
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-card-foreground">Crear Nuevo Usuario</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <Label htmlFor="fullName" className="text-foreground">
                  Nombre Completo
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="mt-1"
                  placeholder="Ingrese el nombre completo"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1"
                  placeholder="usuario@ejemplo.com"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-foreground">
                  Teléfono
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <Label htmlFor="role" className="text-foreground">
                  Rol
                </Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
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
              </div>

              <div>
                <Label htmlFor="password" className="text-foreground">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="mt-1"
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {isLoading ? "Creando..." : "Crear Usuario"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <EditUserDialog
        user={editingUser}
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false)
          setEditingUser(null)
        }}
        onSave={handleSaveUser}
      />

      <CommissionDialog
        user={commissionUser}
        isOpen={isCommissionDialogOpen}
        onClose={() => {
          setIsCommissionDialogOpen(false)
          setCommissionUser(null)
        }}
        onSave={handleSaveCommission}
      />

      <ChangePasswordDialog
        user={passwordUser}
        isOpen={isPasswordDialogOpen}
        onClose={() => {
          setIsPasswordDialogOpen(false)
          setPasswordUser(null)
        }}
      />
    </AdminLayout>
  )
}
