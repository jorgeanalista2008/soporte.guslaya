"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Truck, Users, Bell, FileText, Clock, Wand2 } from "lucide-react"
import Link from "next/link"
import { OrderCreationWizard } from "@/components/receptionist/order-creation-wizard"

interface QuickActionsProps {
  pendingDeliveries: number
  unreadNotifications: number
  activeOrders: number
  onDataChange?: () => void // Added callback for data refresh
}

export function ReceptionistQuickActions({
  pendingDeliveries,
  unreadNotifications,
  activeOrders,
  onDataChange,
}: QuickActionsProps) {
  const [isWizardOpen, setIsWizardOpen] = useState(false)

  const actions = [
    {
      title: "Asistente de Órdenes",
      description: "Crear orden paso a paso",
      onClick: () => setIsWizardOpen(true),
      icon: <Wand2 className="w-5 h-5" />,
      color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
      buttonVariant: "default" as const,
      buttonText: "Iniciar",
      isWizard: true,
    },
    {
      title: "Nueva Orden",
      description: "Registrar nuevo equipo",
      href: "/receptionist/new-order",
      icon: <Plus className="w-5 h-5" />,
      color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
      buttonVariant: "outline" as const,
      buttonText: "Crear",
    },
    {
      title: "Entregas Pendientes",
      description: `${pendingDeliveries} equipos listos`,
      href: "/receptionist/deliveries",
      icon: <Truck className="w-5 h-5" />,
      color: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
      buttonVariant: "outline" as const,
      buttonText: "Ver",
      urgent: pendingDeliveries > 0,
    },
    {
      title: "Gestionar Clientes",
      description: "Ver y editar clientes",
      href: "/receptionist/clients",
      icon: <Users className="w-5 h-5" />,
      color: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400",
      buttonVariant: "outline" as const,
      buttonText: "Ver",
    },
    {
      title: "Órdenes Activas",
      description: `${activeOrders} en proceso`,
      href: "/receptionist/orders",
      icon: <FileText className="w-5 h-5" />,
      color: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
      buttonVariant: "outline" as const,
      buttonText: "Ver",
    },
  ]

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Acciones Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {actions.map((action, index) => (
            <div key={index} className={`flex items-center justify-between p-4 rounded-lg ${action.color}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-background/50 rounded-lg flex items-center justify-center">
                  {action.icon}
                </div>
                <div>
                  <h3 className="font-medium text-card-foreground">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {action.urgent && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
                <Button
                  size="sm"
                  variant={action.buttonVariant}
                  onClick={action.isWizard ? action.onClick : undefined}
                  asChild={!action.isWizard}
                >
                  {action.isWizard ? action.buttonText : <Link href={action.href!}>{action.buttonText}</Link>}
                </Button>
              </div>
            </div>
          ))}

          {unreadNotifications > 0 && (
            <div className="flex items-center justify-between p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="font-medium text-red-900 dark:text-red-100">Notificaciones</h3>
                  <p className="text-sm text-red-700 dark:text-red-300">{unreadNotifications} sin leer</p>
                </div>
              </div>
              <Button size="sm" variant="destructive" asChild>
                <Link href="/receptionist/notifications">Ver</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <OrderCreationWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onOrderCreated={(orderId) => {
          console.log("[v0] Order created:", orderId)
          setIsWizardOpen(false) // Cerrar el wizard al completar
          if (onDataChange) {
            onDataChange() // Actualizar datos del dashboard
          }
        }}
      />
    </>
  )
}
