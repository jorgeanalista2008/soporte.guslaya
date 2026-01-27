"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { OrderStatusBadge } from "./order-status-badge"
import { PriorityBadge } from "./priority-badge"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface OrderDetailsDialogProps {
  order: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrderDetailsDialog({ order, open, onOpenChange }: OrderDetailsDialogProps) {
  if (!order) return null

  const getCommissionInfo = () => {
    // Use commission_total from database if available
    if (order.commission_total !== undefined && order.commission_total !== null) {
      return {
        amount: order.commission_total,
        percentage:
          order.final_cost && order.commission_total > 0 ? (order.commission_total / order.final_cost) * 100 : 0,
      }
    }

    // Fallback to calculation if commission_total not available
    if (order.final_cost && order.technician?.commission_percentage) {
      const amount = (order.final_cost * order.technician.commission_percentage) / 100
      return {
        amount,
        percentage: order.technician.commission_percentage,
      }
    }

    return { amount: 0, percentage: 0 }
  }

  const commissionInfo = getCommissionInfo()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalles de la Orden #{order.order_number}</DialogTitle>
          <DialogDescription>Información completa de la orden de servicio</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Información del Cliente */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información del Cliente</h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Nombre:</span>{" "}
                {order.client?.full_name || order.profiles?.full_name || "N/A"}
              </div>
              <div>
                <span className="font-medium">Email:</span> {order.client?.email || order.profiles?.email || "N/A"}
              </div>
              <div>
                <span className="font-medium">Teléfono:</span> {order.client?.phone || order.profiles?.phone || "N/A"}
              </div>
            </div>
          </div>

          {/* Estado y Prioridad */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Estado de la Orden</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">Estado:</span>
                <OrderStatusBadge status={order.status} />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Prioridad:</span>
                <PriorityBadge priority={order.priority} />
              </div>
              <div>
                <span className="font-medium">Técnico Asignado:</span> {order.technician?.full_name || "Sin asignar"}
              </div>
            </div>
          </div>

          {/* Información del Dispositivo */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información del Dispositivo</h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Tipo:</span>{" "}
                {order.equipment?.equipment_type || order.device_type || "N/A"}
              </div>
              <div>
                <span className="font-medium">Marca:</span> {order.equipment?.brand || order.brand || "N/A"}
              </div>
              <div>
                <span className="font-medium">Modelo:</span> {order.equipment?.model || order.model || "N/A"}
              </div>
              <div>
                <span className="font-medium">Número de Serie:</span> {order.serial_number || "N/A"}
              </div>
              <div>
                <span className="font-medium">Estado del Dispositivo:</span> {order.device_condition || "N/A"}
              </div>
              <div>
                <span className="font-medium">Accesorios:</span> {order.accessories || "N/A"}
              </div>
            </div>
          </div>

          {/* Fechas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Fechas Importantes</h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Fecha de Recepción:</span>{" "}
                {order.received_date
                  ? format(new Date(order.received_date), "dd/MM/yyyy HH:mm", { locale: es })
                  : "N/A"}
              </div>
              <div>
                <span className="font-medium">Fecha Estimada de Finalización:</span>{" "}
                {order.estimated_completion
                  ? format(new Date(order.estimated_completion), "dd/MM/yyyy", { locale: es })
                  : "N/A"}
              </div>
              <div>
                <span className="font-medium">Fecha de Finalización:</span>{" "}
                {order.completed_date
                  ? format(new Date(order.completed_date), "dd/MM/yyyy HH:mm", { locale: es })
                  : "N/A"}
              </div>
              <div>
                <span className="font-medium">Fecha de Entrega:</span>{" "}
                {order.delivered_date
                  ? format(new Date(order.delivered_date), "dd/MM/yyyy HH:mm", { locale: es })
                  : "N/A"}
              </div>
            </div>
          </div>

          {/* Descripción del Problema */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-lg font-semibold">Descripción del Problema</h3>
            <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
              {order.problem_description || "N/A"}
            </p>
          </div>

          {/* Diagnóstico */}
          {order.diagnosis && (
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-lg font-semibold">Diagnóstico</h3>
              <p className="text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                {order.diagnosis}
              </p>
            </div>
          )}

          {/* Solución */}
          {order.solution && (
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-lg font-semibold">Solución Aplicada</h3>
              <p className="text-gray-700 dark:text-gray-300 bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
                {order.solution}
              </p>
            </div>
          )}

          {/* Información Financiera */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información Financiera</h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Costo Estimado:</span> ${order.estimated_cost || "0.00"}
              </div>
              <div>
                <span className="font-medium">Costo Final:</span> ${order.final_cost || "0.00"}
              </div>
              <div>
                <span className="font-medium">Anticipo:</span> ${order.advance_payment || "0.00"}
              </div>
              <div>
                <span className="font-medium">Días de Garantía:</span> {order.warranty_days || 30} días
              </div>

              {order.technician && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Información de Comisión</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Técnico:</span> {order.technician.full_name}
                    </div>
                    <div>
                      <span className="font-medium">Porcentaje de Comisión:</span>{" "}
                      {commissionInfo.percentage.toFixed(1)}%
                    </div>
                    <div>
                      <span className="font-medium">Total en Comisiones:</span>{" "}
                      <span className="text-green-600 dark:text-green-400 font-semibold">
                        ${commissionInfo.amount.toFixed(2)}
                      </span>
                    </div>
                    {(order.status === "completed" || order.status === "delivered") && commissionInfo.amount > 0 && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        ✓ Comisión calculada automáticamente al completar la orden
                      </div>
                    )}
                    {order.status !== "completed" && order.status !== "delivered" && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        La comisión se calculará cuando la orden sea completada
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Notas</h3>
            <div className="space-y-2">
              {order.internal_notes && (
                <div>
                  <span className="font-medium">Notas Internas:</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{order.internal_notes}</p>
                </div>
              )}
              {order.client_notes && (
                <div>
                  <span className="font-medium">Notas del Cliente:</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{order.client_notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
