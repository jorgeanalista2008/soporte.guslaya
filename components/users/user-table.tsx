"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable, type Column, type Filter } from "@/components/ui/data-table"
import { Edit, Percent, UserCheck, UserX, Key } from "lucide-react"
import { cn } from "@/lib/utils"

interface User {
  id: string
  name: string
  email: string
  role: string
  status: string
  lastLogin?: string
  createdAt: string
  commission_percentage?: number
}

interface UserTableProps {
  users: User[]
  onEditUser?: (user: User) => void
  onToggleUserStatus?: (userId: string, currentStatus: string) => void
  onEditCommission?: (user: User) => void
  onChangePassword?: (user: User) => void
}

export function UserTable({
  users,
  onEditUser,
  onToggleUserStatus,
  onEditCommission,
  onChangePassword,
}: UserTableProps) {
  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { label: "Administrador", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
      technician: { label: "Técnico", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
      receptionist: {
        label: "Recepcionista",
        color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      },
      client: { label: "Cliente", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" },
    }
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.client
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Activo</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Inactivo</Badge>
    )
  }

  const columns: Column<User>[] = [
    {
      key: "name",
      header: "Usuario",
      sortable: true,
      render: (user) => (
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Rol",
      sortable: true,
      render: (user) => getRoleBadge(user.role),
    },
    {
      key: "status",
      header: "Estado",
      sortable: true,
      render: (user) => getStatusBadge(user.status),
    },
    {
      key: "commission",
      header: "Comisión",
      sortable: true,
      render: (user) => (
        <span className="text-sm text-gray-900 dark:text-gray-300">
          {user.role === "technician" ? `${user.commission_percentage || 0}%` : "N/A"}
        </span>
      ),
    },
    {
      key: "lastLogin",
      header: "Último Acceso",
      sortable: true,
      accessor: (user) => user.lastLogin || "Nunca",
      render: (user) => (
        <span className="text-sm text-gray-900 dark:text-gray-300">
          {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Nunca"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Fecha Registro",
      sortable: true,
      render: (user) => (
        <span className="text-sm text-gray-900 dark:text-gray-300">
          {new Date(user.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Acciones",
      render: (user) => (
        <div className="flex items-center gap-1 justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditUser?.(user)}
            className="h-8 w-8 p-0 hover:bg-muted"
            title="Editar"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChangePassword?.(user)}
            className="h-8 w-8 p-0 hover:bg-muted"
            title="Cambiar contraseña"
          >
            <Key className="h-4 w-4" />
          </Button>
          {user.role === "technician" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditCommission?.(user)}
              className="h-8 w-8 p-0 hover:bg-muted"
              title="Editar comisión"
            >
              <Percent className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleUserStatus?.(user.id, user.status)}
            className={cn(
              "h-8 w-8 p-0 hover:bg-muted",
              user.status === "active" ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700",
            )}
            title={user.status === "active" ? "Desactivar" : "Activar"}
          >
            {user.status === "active" ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
          </Button>
        </div>
      ),
    },
  ]

  const filters: Filter[] = [
    {
      key: "role",
      label: "Filtrar por rol",
      type: "select",
      options: [
        { value: "admin", label: "Administrador" },
        { value: "technician", label: "Técnico" },
        { value: "receptionist", label: "Recepcionista" },
        { value: "client", label: "Cliente" },
      ],
    },
    {
      key: "status",
      label: "Filtrar por estado",
      type: "select",
      options: [
        { value: "active", label: "Activo" },
        { value: "inactive", label: "Inactivo" },
      ],
    },
    {
      key: "commission_status",
      label: "Estado de comisión",
      type: "select",
      options: [
        { value: "with_commission", label: "Con comisión" },
        { value: "without_commission", label: "Sin comisión" },
        { value: "high_commission", label: "Comisión alta (>15%)" },
      ],
      filterFn: (user, value) => {
        const commission = user.commission_percentage || 0
        if (value === "with_commission") return commission > 0
        if (value === "without_commission") return commission === 0
        if (value === "high_commission") return commission > 15
        return true
      },
    },
    {
      key: "activity_status",
      label: "Actividad reciente",
      type: "select",
      options: [
        { value: "recent_login", label: "Acceso reciente (30 días)" },
        { value: "inactive_login", label: "Sin acceso reciente" },
        { value: "never_logged", label: "Nunca accedió" },
      ],
      filterFn: (user, value) => {
        if (!user.lastLogin) {
          return value === "never_logged"
        }

        const lastLogin = new Date(user.lastLogin)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const isRecent = lastLogin > thirtyDaysAgo

        if (value === "recent_login") return isRecent
        if (value === "inactive_login") return !isRecent
        return true
      },
    },
    {
      key: "registration_period",
      label: "Período de registro",
      type: "select",
      options: [
        { value: "this_month", label: "Este mes" },
        { value: "last_month", label: "Mes pasado" },
        { value: "this_year", label: "Este año" },
        { value: "older", label: "Más de un año" },
      ],
      filterFn: (user, value) => {
        const createdDate = new Date(user.createdAt)
        const now = new Date()

        if (value === "this_month") {
          return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear()
        }

        if (value === "last_month") {
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1)
          return (
            createdDate.getMonth() === lastMonth.getMonth() && createdDate.getFullYear() === lastMonth.getFullYear()
          )
        }

        if (value === "this_year") {
          return createdDate.getFullYear() === now.getFullYear()
        }

        if (value === "older") {
          const oneYearAgo = new Date()
          oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
          return createdDate < oneYearAgo
        }

        return true
      },
    },
  ]

  return (
    <DataTable
      data={users}
      columns={columns}
      filters={filters}
      searchPlaceholder="Buscar por nombre o email..."
      emptyMessage="No se encontraron usuarios"
      pageSize={10}
    />
  )
}
