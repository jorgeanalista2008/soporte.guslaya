"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { OrderStatusBadge } from "./order-status-badge"
import { PriorityBadge } from "./priority-badge"
import type { ClientOrder } from "@/lib/services/client-service"

interface ClientOrderDetailsProps {
  order: ClientOrder
  showActions?: boolean
}

export function ClientOrderDetails({ order, showActions = true }: ClientOrderDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getStatusProgress = (status: string) => {
    const statusOrder = ["received", "in_diagnosis", "waiting_parts", "in_repair", "testing", "completed", "delivered"]
    const currentIndex = statusOrder.indexOf(status)
    return currentIndex >= 0 ? ((currentIndex + 1) / statusOrder.length) * 100 : 0
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">{order.order_number}</CardTitle>
              <div className="flex items-center space-x-3 mt-2">
                <OrderStatusBadge status={order.status} />
                <PriorityBadge priority={order.priority} />
                {order.warranty_days && order.warranty_days > 0 && (
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-0">
                    Garantía: {order.warranty_days} días
                  </Badge>
                )}
              </div>
            </div>
            {showActions && (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 bg-transparent"
                >
                  Descargar PDF
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Contactar Soporte</Button>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Progress Bar */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Progreso del Servicio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getStatusProgress(order.status)}%` }}
            ></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div
                className={`w-3 h-3 rounded-full mx-auto mb-1 ${
                  [
                    "received",
                    "in_diagnosis",
                    "waiting_parts",
                    "in_repair",
                    "testing",
                    "completed",
                    "delivered",
                  ].includes(order.status)
                    ? "bg-blue-600"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              ></div>
              <p className="text-gray-600 dark:text-gray-400">Recibida</p>
            </div>
            <div className="text-center">
              <div
                className={`w-3 h-3 rounded-full mx-auto mb-1 ${
                  ["in_diagnosis", "waiting_parts", "in_repair", "testing", "completed", "delivered"].includes(
                    order.status,
                  )
                    ? "bg-blue-600"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              ></div>
              <p className="text-gray-600 dark:text-gray-400">En Proceso</p>
            </div>
            <div className="text-center">
              <div
                className={`w-3 h-3 rounded-full mx-auto mb-1 ${
                  ["completed", "delivered"].includes(order.status) ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                }`}
              ></div>
              <p className="text-gray-600 dark:text-gray-400">Completada</p>
            </div>
            <div className="text-center">
              <div
                className={`w-3 h-3 rounded-full mx-auto mb-1 ${
                  order.status === "delivered" ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                }`}
              ></div>
              <p className="text-gray-600 dark:text-gray-400">Entregada</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Equipment Information */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Información del Equipo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tipo de Equipo</p>
              <p className="font-medium text-gray-900 dark:text-white">{order.equipment_type}</p>
            </div>
            {order.brand && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Marca</p>
                <p className="font-medium text-gray-900 dark:text-white">{order.brand}</p>
              </div>
            )}
            {order.model && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Modelo</p>
                <p className="font-medium text-gray-900 dark:text-white">{order.model}</p>
              </div>
            )}
            <Separator />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Descripción del Problema</p>
              <p className="text-gray-900 dark:text-white mt-1">{order.problem_description}</p>
            </div>
            {order.client_notes && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Notas Adicionales</p>
                <p className="text-gray-900 dark:text-white mt-1">{order.client_notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Service Information */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Información del Servicio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Técnico Asignado</p>
              <p className="font-medium text-gray-900 dark:text-white">{order.technician_name || "Por asignar"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Fecha de Recepción</p>
              <p className="font-medium text-gray-900 dark:text-white">{formatDate(order.received_date)}</p>
            </div>
            {order.estimated_completion && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Fecha Estimada de Finalización</p>
                <p className="font-medium text-gray-900 dark:text-white">{formatDate(order.estimated_completion)}</p>
              </div>
            )}
            {order.completed_date && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Fecha de Finalización</p>
                <p className="font-medium text-gray-900 dark:text-white">{formatDate(order.completed_date)}</p>
              </div>
            )}
            {order.delivered_date && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Fecha de Entrega</p>
                <p className="font-medium text-gray-900 dark:text-white">{formatDate(order.delivered_date)}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Diagnosis and Solution */}
      {(order.diagnosis || order.solution) && (
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Diagnóstico y Solución
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.diagnosis && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Diagnóstico</p>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-900 dark:text-white">{order.diagnosis}</p>
                </div>
              </div>
            )}
            {order.solution && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Solución Aplicada</p>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <p className="text-gray-900 dark:text-white">{order.solution}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Cost Information */}
      {(order.estimated_cost || order.final_cost || order.advance_payment) && (
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Información de Costos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {order.estimated_cost && (
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Costo Estimado</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(order.estimated_cost)}
                  </p>
                </div>
              )}
              {order.final_cost && (
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Costo Final</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(order.final_cost)}
                  </p>
                </div>
              )}
              {order.advance_payment && order.advance_payment > 0 && (
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Anticipo Pagado</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(order.advance_payment)}
                  </p>
                </div>
              )}
            </div>
            {order.final_cost && order.advance_payment && order.final_cost > order.advance_payment && (
              <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-800 dark:text-orange-400">Saldo Pendiente</p>
                    <p className="text-xl font-bold text-orange-900 dark:text-orange-300">
                      {formatCurrency(order.final_cost - order.advance_payment)}
                    </p>
                  </div>
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white">Pagar Saldo</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
