"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import type { ClientOrder } from "@/lib/services/client-service"

interface ClientActiveOrdersProps {
  orders: ClientOrder[]
  isLoading?: boolean
}

function getStatusBadge(status: string) {
  const statusConfig = {
    received: { label: "Recibida", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400" },
    in_diagnosis: {
      label: "En Diagnóstico",
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    },
    waiting_parts: {
      label: "Esperando Repuestos",
      color: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
    },
    in_repair: {
      label: "En Reparación",
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
    },
    testing: { label: "En Pruebas", color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400" },
    completed: { label: "Completada", color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" },
    delivered: { label: "Entregada", color: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400" },
    cancelled: { label: "Cancelada", color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400" },
  }

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.received
  return <Badge className={`${config.color} border-0`}>{config.label}</Badge>
}

function getPriorityBadge(priority: string) {
  const priorityConfig = {
    low: { label: "Baja", color: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400" },
    medium: { label: "Media", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400" },
    high: { label: "Alta", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400" },
    urgent: { label: "Urgente", color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400" },
  }

  const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium
  return <Badge className={`${config.color} border-0`}>{config.label}</Badge>
}

export function ClientActiveOrders({ orders, isLoading = false }: ClientActiveOrdersProps) {
  const activeOrders = orders.filter((order) => !["completed", "delivered", "cancelled"].includes(order.status))

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Órdenes Activas</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Seguimiento de tus solicitudes en proceso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 animate-pulse">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="space-y-1">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-gray-900 dark:text-white">Órdenes Activas</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Seguimiento de tus solicitudes en proceso
            </CardDescription>
          </div>
          <Link href="/client/orders">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 bg-transparent"
            >
              Ver Todas
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {activeOrders.length > 0 ? (
          <div className="space-y-4">
            {activeOrders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{order.order_number}</h3>
                    {getStatusBadge(order.status)}
                    {getPriorityBadge(order.priority)}
                  </div>
                  <Link href={`/client/orders/${order.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 bg-transparent"
                    >
                      Ver Detalles
                    </Button>
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Equipo:</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {order.equipment_type} {order.brand && `${order.brand}`} {order.model && `${order.model}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Problema:</p>
                    <p className="font-medium text-gray-900 dark:text-white line-clamp-2">
                      {order.problem_description}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Técnico:</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {order.technician_name || "Por asignar"}
                    </p>
                  </div>
                  {order.estimated_completion && (
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Fecha estimada:</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(order.estimated_completion).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {order.estimated_cost && (
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Costo estimado:</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        ${order.estimated_cost.toLocaleString()}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Recibida:</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(order.received_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <svg
              className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4"
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
            <p className="text-gray-500 dark:text-gray-400 mb-4">No tienes órdenes activas en este momento</p>
            <Link href="/client/new-request">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Crear Primera Solicitud</Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
