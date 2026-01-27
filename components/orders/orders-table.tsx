"use client"
import Link from "next/link"
import type React from "react"

import { useState } from "react"
import { OrderStatusBadge } from "./order-status-badge"
import { PriorityBadge } from "./priority-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Order {
  id: string
  order_number: string
  client_id: string
  device_type: string
  brand?: string
  model?: string
  problem_description: string
  status: string
  priority: string
  received_date: string
  estimated_cost?: number
  final_cost?: number
  commission_total?: number
  client?: {
    full_name: string
    email: string
    phone?: string
  }
  equipment?: {
    equipment_type: string
    brand: string
    model: string
  }
  // Keep legacy profiles for backward compatibility
  profiles?: {
    full_name: string
    email: string
  }
}

interface OrdersTableProps {
  orders: Order[]
  onOrderClick?: (order: Order) => void
  showClientInfo?: boolean
  userRole?: "client" | "technician" | "admin" | "receptionist"
  onViewDetails?: (order: Order) => void
  onUpdateStatus?: (order: Order) => void
  renderActions?: (order: Order) => React.ReactNode
}

export function OrdersTable({
  orders,
  onOrderClick,
  showClientInfo = true,
  userRole,
  onViewDetails,
  onUpdateStatus,
  renderActions,
}: OrdersTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const filteredOrders = orders.filter((order) => {
    const clientName = order.client?.full_name || order.profiles?.full_name || ""
    const equipmentInfo = order.equipment
      ? `${order.equipment.equipment_type} ${order.equipment.brand} ${order.equipment.model}`
      : `${order.device_type || ""} ${order.brand || ""} ${order.model || ""}`

    const matchesSearch =
      (order.order_number?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      equipmentInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.problem_description?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      clientName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesPriority = priorityFilter === "all" || order.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const renderOrderActions = (order: Order) => {
    if (renderActions) {
      return renderActions(order)
    }

    if (userRole === "client") {
      return (
        <Link href={`/client/orders/${order.id}`}>
          <Button variant="outline" size="sm" className="bg-background border-border hover:bg-accent">
            Ver Detalles
          </Button>
        </Link>
      )
    }

    if (userRole === "technician") {
      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails?.(order)}
            className="bg-background border-border hover:bg-accent"
          >
            Ver Detalles
          </Button>
          <Button size="sm" onClick={() => onUpdateStatus?.(order)}>
            Actualizar
          </Button>
        </div>
      )
    }

    // Default action for admin/receptionist or when showClientInfo is true
    if (showClientInfo) {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onOrderClick?.(order)}
          className="bg-background border-border hover:bg-accent"
        >
          Ver Detalles
        </Button>
      )
    }

    // Fallback for client role
    return (
      <Link href={`/client/orders/${order.id}`}>
        <Button variant="outline" size="sm" className="bg-background border-border hover:bg-accent">
          Ver Detalles
        </Button>
      </Link>
    )
  }

  return (
    <div className="w-full space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar por número de orden, dispositivo, problema o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-background border-border text-foreground"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40 bg-background border-border">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="received">Recibido</SelectItem>
              <SelectItem value="in_diagnosis">En Diagnóstico</SelectItem>
              <SelectItem value="waiting_parts">Esperando Repuestos</SelectItem>
              <SelectItem value="in_repair">En Reparación</SelectItem>
              <SelectItem value="testing">En Pruebas</SelectItem>
              <SelectItem value="completed">Completado</SelectItem>
              <SelectItem value="delivered">Entregado</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full sm:w-32 bg-background border-border">
              <SelectValue placeholder="Prioridad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="low">Baja</SelectItem>
              <SelectItem value="medium">Media</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="urgent">Urgente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="w-full bg-card border-border rounded-lg border overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                  Orden
                </th>
                {showClientInfo && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                    Cliente
                  </th>
                )}
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                  Dispositivo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                  Problema
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                  Estado
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                  Prioridad
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                  Comisión
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                  Fecha
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">{order.order_number}</div>
                  </td>
                  {showClientInfo && (
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-foreground">
                        {order.client?.full_name || order.profiles?.full_name || "N/A"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.client?.email || order.profiles?.email || "N/A"}
                      </div>
                    </td>
                  )}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-foreground">
                      {order.equipment?.equipment_type || order.device_type || "N/A"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {order.equipment
                        ? `${order.equipment.brand} ${order.equipment.model}`
                        : `${order.brand || ""} ${order.model || ""}`.trim() || "N/A"}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-foreground max-w-xs truncate">{order.problem_description}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <PriorityBadge priority={order.priority} />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">
                      {order.commission_total && order.commission_total > 0
                        ? `$${order.commission_total.toFixed(2)}`
                        : order.status === "completed" || order.status === "delivered"
                          ? "$0.00"
                          : "-"}
                    </div>
                    {order.final_cost && order.commission_total && order.commission_total > 0 && (
                      <div className="text-xs text-muted-foreground">
                        {((order.commission_total / order.final_cost) * 100).toFixed(1)}%
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {new Date(order.received_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">{renderOrderActions(order)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredOrders.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No se encontraron órdenes que coincidan con los filtros.
          </div>
        )}
      </div>
    </div>
  )
}
