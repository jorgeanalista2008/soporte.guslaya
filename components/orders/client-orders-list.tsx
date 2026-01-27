"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ClientOrderCard } from "./client-order-card"
import type { ClientOrder } from "@/lib/services/client-service"

interface ClientOrdersListProps {
  orders: ClientOrder[]
  isLoading?: boolean
  showFilters?: boolean
  compact?: boolean
}

export function ClientOrdersList({
  orders,
  isLoading = false,
  showFilters = true,
  compact = false,
}: ClientOrdersListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.equipment_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.problem_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.brand && order.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.model && order.model.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesStatus = statusFilter === "all" || order.status === statusFilter
      const matchesPriority = priorityFilter === "all" || order.priority === priorityFilter

      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [orders, searchTerm, statusFilter, priorityFilter])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {showFilters && (
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse flex-1"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-40"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-40"></div>
          </div>
        )}
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 animate-pulse"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              </div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, j) => (
                <div key={j} className="space-y-1">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar por número de orden, equipo o problema..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="received">Recibida</SelectItem>
              <SelectItem value="in_diagnosis">En Diagnóstico</SelectItem>
              <SelectItem value="waiting_parts">Esperando Repuestos</SelectItem>
              <SelectItem value="in_repair">En Reparación</SelectItem>
              <SelectItem value="testing">En Pruebas</SelectItem>
              <SelectItem value="completed">Completada</SelectItem>
              <SelectItem value="delivered">Entregada</SelectItem>
              <SelectItem value="cancelled">Cancelada</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Prioridad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las prioridades</SelectItem>
              <SelectItem value="low">Baja</SelectItem>
              <SelectItem value="medium">Media</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="urgent">Urgente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <ClientOrderCard key={order.id} order={order} compact={compact} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
              ? "No se encontraron órdenes"
              : "No tienes órdenes de servicio"}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
              ? "Intenta ajustar los filtros de búsqueda"
              : "Crea tu primera solicitud de servicio técnico"}
          </p>
          {!searchTerm && statusFilter === "all" && priorityFilter === "all" && (
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nueva Solicitud
            </Button>
          )}
        </div>
      )}

      {showFilters && filteredOrders.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
          <span>
            Mostrando {filteredOrders.length} de {orders.length} órdenes
          </span>
          {(searchTerm || statusFilter !== "all" || priorityFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("")
                setStatusFilter("all")
                setPriorityFilter("all")
              }}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Limpiar filtros
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
