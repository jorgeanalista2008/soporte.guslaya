import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { RoleGuard } from "@/components/auth/role-guard"
import { TechnicianLayout } from "@/components/technician/technician-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

export default async function TechnicianDiagnostics() {
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

  // Get recent service orders for diagnostic history
  const { data: recentOrders } = await supabase
    .from("service_orders")
    .select(`
      *,
      client:clients(full_name),
      equipment:equipments(equipment_type, brand, model)
    `)
    .eq("technician_id", user.id)
    .in("status", ["in_diagnosis", "completed"])
    .order("updated_at", { ascending: false })
    .limit(10)

  const diagnosticTools = [
    {
      id: "hardware-test",
      name: "Test de Hardware",
      description: "Diagnóstico completo de componentes físicos",
      icon: "🔧",
      category: "Hardware",
      status: "Disponible",
      lastUsed: "Hace 2 horas",
      color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      id: "memory-analysis",
      name: "Análisis de Memoria",
      description: "Verificación de RAM y almacenamiento",
      icon: "💾",
      category: "Memoria",
      status: "Disponible",
      lastUsed: "Ayer",
      color: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      id: "network-test",
      name: "Test de Red",
      description: "Diagnóstico de conectividad y rendimiento",
      icon: "🌐",
      category: "Red",
      status: "Disponible",
      lastUsed: "Hace 3 días",
      color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      id: "virus-scan",
      name: "Análisis de Virus",
      description: "Escaneo completo de malware y amenazas",
      icon: "🛡️",
      category: "Seguridad",
      status: "Disponible",
      lastUsed: "Hace 1 semana",
      color: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700",
      iconColor: "text-red-600 dark:text-red-400",
    },
    {
      id: "performance-test",
      name: "Test de Rendimiento",
      description: "Evaluación de velocidad y eficiencia del sistema",
      icon: "⚡",
      category: "Rendimiento",
      status: "Disponible",
      lastUsed: "Hace 5 días",
      color: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700",
      iconColor: "text-yellow-600 dark:text-yellow-400",
    },
    {
      id: "disk-health",
      name: "Salud del Disco",
      description: "Análisis de estado y errores del disco duro",
      icon: "💿",
      category: "Almacenamiento",
      status: "Disponible",
      lastUsed: "Hace 2 días",
      color: "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700",
      iconColor: "text-indigo-600 dark:text-indigo-400",
    },
  ]

  const systemChecks = [
    { name: "CPU", status: "Normal", value: 85, color: "bg-green-500" },
    { name: "Memoria RAM", status: "Normal", value: 72, color: "bg-green-500" },
    { name: "Disco Duro", status: "Advertencia", value: 45, color: "bg-yellow-500" },
    { name: "Temperatura", status: "Normal", value: 68, color: "bg-green-500" },
    { name: "Red", status: "Excelente", value: 95, color: "bg-green-500" },
  ]

  return (
    <RoleGuard allowedRoles={["technician"]}>
      <TechnicianLayout
        userInfo={{
          name: profile.full_name,
          email: profile.email,
          role: profile.role,
        }}
      >
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Herramientas de Diagnóstico</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Utiliza estas herramientas para diagnosticar y resolver problemas técnicos
            </p>
          </div>

          <Tabs defaultValue="tools" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tools">Herramientas</TabsTrigger>
              <TabsTrigger value="system">Estado del Sistema</TabsTrigger>
              <TabsTrigger value="history">Historial</TabsTrigger>
            </TabsList>

            <TabsContent value="tools" className="space-y-6">
              {/* Diagnostic Tools Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {diagnosticTools.map((tool) => (
                  <Card key={tool.id} className={`${tool.color} transition-all hover:shadow-md`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{tool.icon}</div>
                          <div>
                            <CardTitle className={`text-lg ${tool.iconColor}`}>{tool.name}</CardTitle>
                            <Badge variant="outline" className="text-xs">
                              {tool.category}
                            </Badge>
                          </div>
                        </div>
                        <Badge variant={tool.status === "Disponible" ? "default" : "secondary"}>{tool.status}</Badge>
                      </div>
                      <CardDescription className="dark:text-gray-300">{tool.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Último uso: {tool.lastUsed}</p>
                        <Button size="sm" className="w-full" disabled={tool.status === "En Uso"}>
                          {tool.status === "En Uso" ? "En Uso" : "Ejecutar Diagnóstico"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Actions */}
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700">
                <CardHeader>
                  <CardTitle className="text-blue-900 dark:text-blue-100">Acciones Rápidas</CardTitle>
                  <CardDescription className="text-blue-700 dark:text-blue-300">
                    Herramientas de diagnóstico frecuentemente utilizadas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" size="sm" className="bg-white/50 dark:bg-gray-800/50">
                      Diagnóstico Completo
                    </Button>
                    <Button variant="outline" size="sm" className="bg-white/50 dark:bg-gray-800/50">
                      Test Rápido
                    </Button>
                    <Button variant="outline" size="sm" className="bg-white/50 dark:bg-gray-800/50">
                      Verificar Conectividad
                    </Button>
                    <Button variant="outline" size="sm" className="bg-white/50 dark:bg-gray-800/50">
                      Escaneo de Seguridad
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system" className="space-y-6">
              {/* System Health Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {systemChecks.map((check, index) => (
                  <Card key={index} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg dark:text-white">{check.name}</CardTitle>
                        <Badge
                          variant={
                            check.status === "Normal" || check.status === "Excelente"
                              ? "default"
                              : check.status === "Advertencia"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {check.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Rendimiento</span>
                          <span className="font-medium dark:text-gray-300">{check.value}%</span>
                        </div>
                        <Progress value={check.value} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* System Information */}
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">Información del Sistema</CardTitle>
                  <CardDescription className="dark:text-gray-300">
                    Detalles técnicos del equipo en diagnóstico
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Sistema Operativo:</span>
                        <span className="font-medium dark:text-gray-300">Windows 11 Pro</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Procesador:</span>
                        <span className="font-medium dark:text-gray-300">Intel Core i7-12700H</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Memoria RAM:</span>
                        <span className="font-medium dark:text-gray-300">16 GB DDR4</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Almacenamiento:</span>
                        <span className="font-medium dark:text-gray-300">512 GB SSD</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Tarjeta Gráfica:</span>
                        <span className="font-medium dark:text-gray-300">NVIDIA RTX 3060</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Última Actualización:</span>
                        <span className="font-medium dark:text-gray-300">Hace 3 días</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              {/* Recent Diagnostics */}
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">Diagnósticos Recientes</CardTitle>
                  <CardDescription className="dark:text-gray-300">
                    Historial de diagnósticos realizados en órdenes de servicio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {recentOrders && recentOrders.length > 0 ? (
                    <div className="space-y-4">
                      {recentOrders.slice(0, 5).map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-medium text-gray-900 dark:text-white">{order.order_number}</span>
                              <Badge variant={order.status === "completed" ? "default" : "secondary"}>
                                {order.status === "completed" ? "Completado" : "En Diagnóstico"}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                              <strong>Cliente:</strong> {order.client?.full_name || "N/A"}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                              <strong>Dispositivo:</strong> {order.equipment?.equipment_type || order.device_type}{" "}
                              {order.equipment?.brand || order.brand} {order.equipment?.model || order.model}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              <strong>Problema:</strong> {order.problem_description}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(order.updated_at).toLocaleDateString()}
                            </p>
                            <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                              Ver Reporte
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <svg
                        className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                        />
                      </svg>
                      <p className="text-gray-500 dark:text-gray-400 mb-2">No hay diagnósticos recientes</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">
                        Los diagnósticos realizados aparecerán aquí
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </TechnicianLayout>
    </RoleGuard>
  )
}
