"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable, type Column, type Filter } from "@/components/ui/data-table"
import { Eye, Edit, Trash2, Monitor } from "lucide-react"

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

interface ClientsTableProps {
  clients: Client[]
  onClientClick?: (client: Client) => void
  onEditClient?: (client: Client) => void
  onDeleteClient?: (client: Client) => void
  onManageEquipments?: (client: Client) => void
  showEquipmentsColumn?: boolean
}

export function ClientsTable({
  clients,
  onClientClick,
  onEditClient,
  onDeleteClient,
  onManageEquipments,
  showEquipmentsColumn = false,
}: ClientsTableProps) {
  const columns: Column<Client>[] = [
    {
      key: "client",
      header: "Cliente",
      sortable: true,
      render: (client) => (
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              {client.full_name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white">{client.full_name}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{client.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contacto",
      sortable: true,
      render: (client) => (
        <div>
          <div className="text-sm text-gray-900 dark:text-white">{client.phone || "No registrado"}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{client.city || ""}</div>
        </div>
      ),
    },
    {
      key: "company_name",
      header: "Empresa",
      sortable: true,
      accessor: (client) => client.company_name || "Particular",
      render: (client) => (
        <span className="text-sm text-gray-900 dark:text-white">{client.company_name || "Particular"}</span>
      ),
    },
    {
      key: "orders",
      header: "Órdenes",
      sortable: true,
      accessor: (client) => client._count?.service_orders || 0,
      render: (client) => (
        <span className="text-sm text-gray-900 dark:text-white">{client._count?.service_orders || 0}</span>
      ),
    },
    {
      key: "is_active",
      header: "Estado",
      sortable: true,
      render: (client) => (
        <Badge variant={client.is_active ? "default" : "secondary"}>{client.is_active ? "Activo" : "Inactivo"}</Badge>
      ),
    },
    {
      key: "created_at",
      header: "Registro",
      sortable: true,
      render: (client) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(client.created_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Acciones",
      render: (client) => (
        <div className="flex items-center gap-1 justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onClientClick?.(client)}
            className="h-8 w-8 p-0 hover:bg-muted"
            title="Ver detalles"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditClient?.(client)}
            className="h-8 w-8 p-0 hover:bg-muted"
            title="Editar"
          >
            <Edit className="h-4 w-4" />
          </Button>
          {showEquipmentsColumn && onManageEquipments && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onManageEquipments(client)}
              className="h-8 w-8 p-0 hover:bg-muted"
              title="Gestionar equipos"
            >
              <Monitor className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeleteClient?.(client)}
            className="h-8 w-8 p-0 hover:bg-muted text-red-600 hover:text-red-700"
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const filters: Filter[] = [
    {
      key: "is_active",
      label: "Filtrar por estado",
      type: "select",
      options: [
        { value: "true", label: "Activos" },
        { value: "false", label: "Inactivos" },
      ],
      filterFn: (client, value) => {
        return String(client.is_active) === value
      },
    },
    {
      key: "company_type",
      label: "Filtrar por tipo",
      type: "select",
      options: [
        { value: "company", label: "Empresas" },
        { value: "individual", label: "Particulares" },
      ],
      filterFn: (client, value) => {
        if (value === "company") return !!client.company_name
        if (value === "individual") return !client.company_name
        return true
      },
    },
    {
      key: "orders_filter",
      label: "Filtrar por órdenes",
      type: "select",
      options: [
        { value: "with_orders", label: "Con órdenes" },
        { value: "without_orders", label: "Sin órdenes" },
      ],
      filterFn: (client, value) => {
        const orderCount = client._count?.service_orders || 0
        if (value === "with_orders") return orderCount > 0
        if (value === "without_orders") return orderCount === 0
        return true
      },
    },
  ]

  return (
    <DataTable
      data={clients}
      columns={columns}
      filters={filters}
      searchPlaceholder="Buscar por nombre, email, empresa o teléfono..."
      emptyMessage="No se encontraron clientes"
      pageSize={10}
    />
  )
}
