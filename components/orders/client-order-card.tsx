"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { OrderStatusBadge } from "./order-status-badge"
import { PriorityBadge } from "./priority-badge"
import Link from "next/link"
import type { ClientOrder } from "@/lib/services/client-service"
import { formatCurrency } from "@/lib/utils/currency"

interface ClientOrderCardProps {
  order: ClientOrder
  showActions?: boolean
  compact?: boolean
}

export function ClientOrderCard({ order, showActions = true, compact = false }: ClientOrderCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <CardHeader className={`${compact ? "pb-3" : "pb-4"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{order.order_number}</h3>
            <OrderStatusBadge status={order.status} />
            <PriorityBadge priority={order.priority} />
          </div>
          {showActions && (
            <Link href={`/client/orders/${order.id}`}>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 bg-transparent"
              >
                Ver Detalles
              </Button>
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent className={`${compact ? "pt-0" : ""}`}>
        <div
          className={`grid ${compact ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"} gap-4 text-sm`}
        >
          <div>
            <p className="text-gray-600 dark:text-gray-400">Equipo:</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {order.equipment_type}
              {order.brand && ` ${order.brand}`}
              {order.model && ` ${order.model}`}
            </p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">Problema:</p>
            <p className="font-medium text-gray-900 dark:text-white line-clamp-2">{order.problem_description}</p>
          </div>
          {!compact && (
            <div>
              <p className="text-gray-600 dark:text-gray-400">Técnico:</p>
              <p className="font-medium text-gray-900 dark:text-white">{order.technician_name || "Por asignar"}</p>
            </div>
          )}
          <div>
            <p className="text-gray-600 dark:text-gray-400">Fecha de recepción:</p>
            <p className="font-medium text-gray-900 dark:text-white">{formatDate(order.received_date)}</p>
          </div>
          {order.estimated_completion && (
            <div>
              <p className="text-gray-600 dark:text-gray-400">Fecha estimada:</p>
              <p className="font-medium text-gray-900 dark:text-white">{formatDate(order.estimated_completion)}</p>
            </div>
          )}
          {order.estimated_cost && (
            <div>
              <p className="text-gray-600 dark:text-gray-400">Costo estimado:</p>
              <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(order.estimated_cost)}</p>
            </div>
          )}
          {order.final_cost && (
            <div>
              <p className="text-gray-600 dark:text-gray-400">Costo final:</p>
              <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(order.final_cost)}</p>
            </div>
          )}
          {order.completed_date && (
            <div>
              <p className="text-gray-600 dark:text-gray-400">Fecha de finalización:</p>
              <p className="font-medium text-gray-900 dark:text-white">{formatDate(order.completed_date)}</p>
            </div>
          )}
          {order.delivered_date && (
            <div>
              <p className="text-gray-600 dark:text-gray-400">Fecha de entrega:</p>
              <p className="font-medium text-gray-900 dark:text-white">{formatDate(order.delivered_date)}</p>
            </div>
          )}
        </div>

        {order.diagnosis && !compact && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Diagnóstico:</p>
            <p className="text-gray-900 dark:text-white text-sm mt-1">{order.diagnosis}</p>
          </div>
        )}

        {order.solution && !compact && (
          <div className="mt-3">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Solución:</p>
            <p className="text-gray-900 dark:text-white text-sm mt-1">{order.solution}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
