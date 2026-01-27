import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { RoleGuard } from "@/components/auth/role-guard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { clientSidebarItems } from "@/lib/config/sidebar-items"
import Link from "next/link"
import { ArrowLeft, Calendar, User, DollarSign, Clock } from "lucide-react"

function getStatusBadge(status: string) {
  const statusConfig = {
    received: { label: "Recibida", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
    in_diagnosis: { label: "En Diagnóstico", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
    waiting_parts: { label: "Esperando Repuestos", color: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
    in_repair: { label: "En Reparación", color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
    testing: { label: "En Pruebas", color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" },
    completed: { label: "Completada", color: "bg-green-500/10 text-green-600 border-green-500/20" },
    delivered: { label: "Entregada", color: "bg-gray-500/10 text-gray-600 border-gray-500/20" },
    cancelled: { label: "Cancelada", color: "bg-red-500/10 text-red-600 border-red-500/20" },
  }

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.received
  return <Badge className={`${config.color} font-medium`}>{config.label}</Badge>
}

function getPriorityBadge(priority: string) {
  const priorityConfig = {
    low: { label: "Baja", color: "bg-gray-500/10 text-gray-600 border-gray-500/20" },
    medium: { label: "Media", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
    high: { label: "Alta", color: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
    urgent: { label: "Urgente", color: "bg-red-500/10 text-red-600 border-red-500/20" },
  }

  const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium
  return <Badge className={`${config.color} font-medium`}>{config.label}</Badge>
}

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  if (!supabase) {
    redirect("/auth/login")
    return
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) {
    redirect("/auth/login")
  }

  // Get order details with equipment information
  const { data: order } = await supabase
    .from("service_orders")
    .select(`
      *,
      equipments (
        equipment_type,
        brand,
        model,
        serial_number
      )
    `)
    .eq("id", params.id)
    .eq("client_id", user.id)
    .single()

  if (!order) {
    redirect("/client/orders")
  }

  return (
    <RoleGuard allowedRoles={["client"]}>
      <DashboardLayout
        sidebarItems={clientSidebarItems}
        userInfo={{
          name: profile.full_name,
          email: profile.email,
          role: profile.role,
        }}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Link href="/client/orders">
              <Button variant="outline" size="sm" className="bg-background border-border hover:bg-accent">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a Órdenes
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Orden {order.order_number}</h1>
              <p className="text-muted-foreground">Detalles completos de tu solicitud de servicio</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Status */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-card-foreground">Estado de la Orden</CardTitle>
                    {getStatusBadge(order.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Fecha de Recepción</p>
                        <p className="font-medium text-foreground">
                          {new Date(order.received_date).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Prioridad</p>
                        {getPriorityBadge(order.priority)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Equipment Details */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground">Información del Equipo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Tipo de Equipo</p>
                      <p className="font-medium text-foreground">
                        {order.equipments?.equipment_type || order.device_type || "No especificado"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Marca y Modelo</p>
                      <p className="font-medium text-foreground">
                        {order.equipments
                          ? `${order.equipments.brand} ${order.equipments.model}`
                          : `${order.brand || ""} ${order.model || ""}`.trim() || "No especificado"}
                      </p>
                    </div>
                    {order.equipments?.serial_number && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-muted-foreground mb-1">Número de Serie</p>
                        <p className="font-medium text-foreground font-mono">{order.equipments.serial_number}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Problem Description */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground">Descripción del Problema</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed">{order.problem_description}</p>
                </CardContent>
              </Card>

              {/* Solution (if available) */}
              {order.solution_description && (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-card-foreground">Solución Aplicada</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground leading-relaxed">{order.solution_description}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Cost Information */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Información de Costos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {order.estimated_cost && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Costo Estimado</p>
                      <p className="text-lg font-bold text-foreground">${order.estimated_cost.toLocaleString()}</p>
                    </div>
                  )}
                  {order.final_cost && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Costo Final</p>
                      <p className="text-lg font-bold text-green-600">${order.final_cost.toLocaleString()}</p>
                    </div>
                  )}
                  {!order.estimated_cost && !order.final_cost && (
                    <p className="text-muted-foreground text-sm">Los costos se actualizarán durante el diagnóstico</p>
                  )}
                </CardContent>
              </Card>

              {/* Technician Information */}
              {order.technician_id && (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-card-foreground flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Técnico Asignado
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium text-foreground">Técnico Asignado</p>
                    <p className="text-sm text-muted-foreground">Información del técnico disponible próximamente</p>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground">Acciones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/client/new-request" className="block">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      Nueva Solicitud
                    </Button>
                  </Link>
                  <Link href="/client/orders" className="block">
                    <Button variant="outline" className="w-full bg-background border-border hover:bg-accent">
                      Ver Todas las Órdenes
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </RoleGuard>
  )
}
