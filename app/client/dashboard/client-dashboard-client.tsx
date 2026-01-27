"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatsCard } from "@/components/dashboard/stats-card"
import { ServiceRequestWizard } from "@/components/client/service-request-wizard"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Equipment {
  id: string
  equipment_type: string
  brand: string
  model: string
  serial_number?: string
}

interface Order {
  id: string
  order_number: string
  status: string
  priority: string
  equipment_type: string
  brand?: string
  model?: string
  problem_description: string
  technician_name?: string
  estimated_completion?: string
  estimated_cost?: number
  received_date: string
}

interface ClientDashboardClientProps {
  stats: {
    totalOrders: number
    activeOrders: number
    completedOrders: number
    totalSpent: number
    averageResponseTime: number
    pendingPayments: number
  }
  recentActiveOrders: Order[]
  existingEquipments: Equipment[]
}

const getStatusBadge = (status: string) => {
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

const getPriorityBadge = (priority: string) => {
  const priorityConfig = {
    low: { label: "Baja", color: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400" },
    medium: { label: "Media", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400" },
    high: { label: "Alta", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400" },
    urgent: { label: "Urgente", color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400" },
  }

  const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium
  return <Badge className={`${config.color} border-0`}>{config.label}</Badge>
}

export function ClientDashboardClient({ stats, recentActiveOrders, existingEquipments }: ClientDashboardClientProps) {
  const [wizardOpen, setWizardOpen] = useState(false)

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mi Dashboard</h1>
            <p className="text-muted-foreground">Gestiona tus solicitudes de servicio técnico</p>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setWizardOpen(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nueva Solicitud
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Crea una nueva solicitud de servicio con nuestro asistente paso a paso</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <StatsCard
                  title="Órdenes Totales"
                  value={stats.totalOrders}
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  }
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Total de solicitudes de servicio que has creado</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <StatsCard
                  title="En Servicio"
                  value={stats.activeOrders}
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  }
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Órdenes actualmente en proceso de reparación o diagnóstico</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <StatsCard
                  title="Completadas"
                  value={stats.completedOrders}
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  }
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Servicios finalizados exitosamente</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <StatsCard
                  title="Total Invertido"
                  value={`$${stats.totalSpent.toLocaleString()}`}
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                  }
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Monto total invertido en servicios técnicos</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <StatsCard
                  title="Tiempo Promedio de Respuesta"
                  value={stats.averageResponseTime > 0 ? `${stats.averageResponseTime} días` : "N/A"}
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  }
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Tiempo promedio desde que creas una solicitud hasta que se completa</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <StatsCard
                  title="Pagos Pendientes"
                  value={`$${stats.pendingPayments.toLocaleString()}`}
                  changeType={stats.pendingPayments > 0 ? "negative" : "positive"}
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  }
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Monto pendiente de pago por servicios completados</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Quick Actions */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Acciones Rápidas</CardTitle>
            <CardDescription className="text-muted-foreground">
              Gestiona tus servicios de manera eficiente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setWizardOpen(true)}
                    className="w-full h-auto p-4 flex flex-col items-center space-y-2 bg-primary hover:bg-primary/90"
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Nueva Solicitud</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Inicia el asistente para crear una nueva solicitud de servicio</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/client/orders" className="w-full">
                    <Button
                      variant="outline"
                      className="w-full h-auto p-4 flex flex-col items-center space-y-2 border-border text-foreground hover:bg-accent hover:text-accent-foreground bg-transparent"
                    >
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span>Ver Órdenes</span>
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Consulta el estado de todas tus solicitudes de servicio</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/client/equipments" className="w-full">
                    <Button
                      variant="outline"
                      className="w-full h-auto p-4 flex flex-col items-center space-y-2 border-border text-foreground hover:bg-accent hover:text-accent-foreground bg-transparent"
                    >
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span>Mis Equipos</span>
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Administra el historial y detalles de tus equipos registrados</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/client/profile" className="w-full">
                    <Button
                      variant="outline"
                      className="w-full h-auto p-4 flex flex-col items-center space-y-2 border-border text-foreground hover:bg-accent hover:text-accent-foreground bg-transparent"
                    >
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span>Mi Perfil</span>
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Actualiza tu información personal y preferencias de contacto</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>

        {/* Active Orders */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-card-foreground">Órdenes Activas</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Seguimiento de tus solicitudes en proceso
                </CardDescription>
              </div>
              <Link href="/client/orders">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border text-foreground hover:bg-accent hover:text-accent-foreground bg-transparent"
                >
                  Ver Todas
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentActiveOrders.length > 0 ? (
              <div className="space-y-4">
                {recentActiveOrders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        <h3 className="font-semibold text-foreground">{order.order_number}</h3>
                        {getStatusBadge(order.status)}
                        {getPriorityBadge(order.priority)}
                      </div>
                      <Link href={`/client/orders/${order.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-border text-foreground hover:bg-accent hover:text-accent-foreground bg-transparent"
                        >
                          Ver Detalles
                        </Button>
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Equipo:</p>
                        <p className="font-medium text-foreground">
                          {order.equipment_type} {order.brand && `${order.brand}`} {order.model && `${order.model}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Problema:</p>
                        <p className="font-medium text-foreground line-clamp-2">{order.problem_description}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Técnico:</p>
                        <p className="font-medium text-foreground">{order.technician_name || "Por asignar"}</p>
                      </div>
                      {order.estimated_completion && (
                        <div>
                          <p className="text-muted-foreground">Fecha estimada:</p>
                          <p className="font-medium text-foreground">
                            {new Date(order.estimated_completion).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      {order.estimated_cost && (
                        <div>
                          <p className="text-muted-foreground">Costo estimado:</p>
                          <p className="font-medium text-foreground">${order.estimated_cost.toLocaleString()}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-muted-foreground">Recibida:</p>
                        <p className="font-medium text-foreground">
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
                  className="w-12 h-12 text-muted-foreground mx-auto mb-4"
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
                <p className="text-muted-foreground mb-4">No tienes órdenes activas en este momento</p>
                <Button
                  onClick={() => setWizardOpen(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Crear Primera Solicitud
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Service Request Wizard */}
        <ServiceRequestWizard open={wizardOpen} onOpenChange={setWizardOpen} existingEquipments={existingEquipments} />
      </div>
    </TooltipProvider>
  )
}
