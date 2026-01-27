"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Shield,
  Wrench,
  Users,
  User,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Package,
  FileText,
  Settings,
  ClipboardList,
  Clock,
  MessageSquare,
  History,
  Smartphone,
  BarChart3,
  UserPlus,
  Calendar,
  Phone,
} from "lucide-react"
import Link from "next/link"

export default function ManualsPage() {
  const [activeRole, setActiveRole] = useState("admin")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/auth/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Login
            </Link>
          </Button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Manuales de Usuario</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Guías completas para cada rol del sistema GusLaya
            </p>
          </div>
        </div>

        {/* Role Tabs */}
        <TooltipProvider>
          <Tabs value={activeRole} onValueChange={setActiveRole} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto gap-2 bg-transparent">
              <TabsTrigger
                value="admin"
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white h-12"
              >
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Administrador</span>
                <span className="sm:hidden">Admin</span>
              </TabsTrigger>
              <TabsTrigger
                value="technician"
                className="flex items-center gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white h-12"
              >
                <Wrench className="h-4 w-4" />
                <span className="hidden sm:inline">Técnico</span>
                <span className="sm:hidden">Técnico</span>
              </TabsTrigger>
              <TabsTrigger
                value="receptionist"
                className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white h-12"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Recepcionista</span>
                <span className="sm:hidden">Recep.</span>
              </TabsTrigger>
              <TabsTrigger
                value="client"
                className="flex items-center gap-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white h-12"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Cliente</span>
                <span className="sm:hidden">Cliente</span>
              </TabsTrigger>
            </TabsList>

            {/* Admin Content */}
            <TabsContent value="admin" className="mt-6 space-y-6">
              <Card className="border-blue-200 dark:border-blue-800">
                <CardHeader className="bg-blue-50 dark:bg-blue-950">
                  <div className="flex items-center gap-3">
                    <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    <div>
                      <CardTitle className="text-2xl">Administrador</CardTitle>
                      <CardDescription>Control total del sistema y gestión de usuarios</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Use Case 1 */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <UserPlus className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                          1. Gestión de Usuarios
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertCircle className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Administra todos los usuarios del sistema con diferentes roles</p>
                            </TooltipContent>
                          </Tooltip>
                        </h3>
                        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              1
                            </Badge>
                            <p>
                              Navega a <strong>Admin → Usuarios</strong> desde el menú lateral
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              2
                            </Badge>
                            <p>
                              Haz clic en <strong>"Nuevo Usuario"</strong> para agregar un usuario
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              3
                            </Badge>
                            <p>Completa el formulario con email, nombre completo y selecciona el rol apropiado</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              4
                            </Badge>
                            <p>Usa los filtros para buscar usuarios por rol o estado</p>
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                          <p className="text-sm text-blue-800 dark:text-blue-200 flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>
                              <strong>Consejo:</strong> Asigna roles según las responsabilidades. Los técnicos solo ven
                              órdenes asignadas, mientras que recepcionistas pueden crear y gestionar todas las órdenes.
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Use Case 2 */}
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-start gap-3">
                      <Package className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                          2. Control de Inventario
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertCircle className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Gestiona repuestos, categorías y niveles de stock</p>
                            </TooltipContent>
                          </Tooltip>
                        </h3>
                        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              1
                            </Badge>
                            <p>
                              Accede a <strong>Admin → Inventario</strong> para ver todas las piezas
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              2
                            </Badge>
                            <p>
                              Crea categorías desde la pestaña <strong>"Categorías"</strong> para organizar repuestos
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              3
                            </Badge>
                            <p>Agrega nuevas piezas con código, nombre, precio y stock mínimo</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              4
                            </Badge>
                            <p>Monitorea alertas de stock bajo en el dashboard principal</p>
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                          <p className="text-sm text-blue-800 dark:text-blue-200 flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>
                              <strong>Consejo:</strong> Establece niveles de stock mínimo realistas para recibir alertas
                              antes de quedarte sin piezas críticas.
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Use Case 3 */}
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-start gap-3">
                      <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                          3. Análisis y Reportes
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertCircle className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Visualiza métricas clave y genera reportes del negocio</p>
                            </TooltipContent>
                          </Tooltip>
                        </h3>
                        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              1
                            </Badge>
                            <p>
                              El <strong>Dashboard</strong> muestra métricas en tiempo real: órdenes activas, ingresos,
                              técnicos ocupados
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              2
                            </Badge>
                            <p>Revisa gráficos de tendencias de órdenes por mes y estado</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              3
                            </Badge>
                            <p>
                              Accede a <strong>Admin → Reportes</strong> para análisis detallados por período
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              4
                            </Badge>
                            <p>Exporta datos para análisis externos o presentaciones</p>
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                          <p className="text-sm text-blue-800 dark:text-blue-200 flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>
                              <strong>Consejo:</strong> Revisa el dashboard diariamente para identificar cuellos de
                              botella y optimizar la asignación de técnicos.
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Use Case 4 */}
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-start gap-3">
                      <Settings className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                          4. Configuración del Sistema
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertCircle className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Personaliza parámetros y preferencias del sistema</p>
                            </TooltipContent>
                          </Tooltip>
                        </h3>
                        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              1
                            </Badge>
                            <p>
                              Navega a <strong>Admin → Configuración</strong> para ajustes generales
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              2
                            </Badge>
                            <p>Configura notificaciones automáticas para clientes y técnicos</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              3
                            </Badge>
                            <p>Define tiempos estimados por tipo de servicio para mejor planificación</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              4
                            </Badge>
                            <p>Personaliza estados de órdenes y prioridades según tu flujo de trabajo</p>
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                          <p className="text-sm text-blue-800 dark:text-blue-200 flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>
                              <strong>Consejo:</strong> Documenta cualquier cambio en la configuración y comunícalo al
                              equipo para evitar confusiones.
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Technician Content */}
            <TabsContent value="technician" className="mt-6 space-y-6">
              <Card className="border-green-200 dark:border-green-800">
                <CardHeader className="bg-green-50 dark:bg-green-950">
                  <div className="flex items-center gap-3">
                    <Wrench className="h-8 w-8 text-green-600 dark:text-green-400" />
                    <div>
                      <CardTitle className="text-2xl">Técnico</CardTitle>
                      <CardDescription>Gestión de reparaciones y órdenes de servicio</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Use Case 1 */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <ClipboardList className="h-6 w-6 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                          1. Gestión de Órdenes Asignadas
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertCircle className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Visualiza y actualiza el estado de tus órdenes de trabajo</p>
                            </TooltipContent>
                          </Tooltip>
                        </h3>
                        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              1
                            </Badge>
                            <p>
                              Accede a tu <strong>Dashboard</strong> para ver todas las órdenes asignadas a ti
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              2
                            </Badge>
                            <p>
                              Filtra por estado: <Badge className="mx-1">Pendiente</Badge>{" "}
                              <Badge className="mx-1">En Proceso</Badge> <Badge className="mx-1">Completada</Badge>
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              3
                            </Badge>
                            <p>Haz clic en una orden para ver detalles completos del equipo y problema reportado</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              4
                            </Badge>
                            <p>
                              Actualiza el estado según avances: <strong>Iniciar → En Proceso → Completar</strong>
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                          <p className="text-sm text-green-800 dark:text-green-200 flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>
                              <strong>Consejo:</strong> Actualiza el estado de las órdenes en tiempo real para que
                              recepción y clientes estén informados del progreso.
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Use Case 2 */}
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-start gap-3">
                      <FileText className="h-6 w-6 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                          2. Registro de Diagnóstico y Reparación
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertCircle className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Documenta el trabajo realizado y hallazgos técnicos</p>
                            </TooltipContent>
                          </Tooltip>
                        </h3>
                        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              1
                            </Badge>
                            <p>
                              Abre la orden y haz clic en <strong>"Agregar Nota"</strong> o{" "}
                              <strong>"Actualizar Diagnóstico"</strong>
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              2
                            </Badge>
                            <p>Describe el problema encontrado de forma clara y técnica</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              3
                            </Badge>
                            <p>Detalla las reparaciones realizadas y piezas utilizadas</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              4
                            </Badge>
                            <p>Agrega recomendaciones para el cliente si es necesario</p>
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                          <p className="text-sm text-green-800 dark:text-green-200 flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>
                              <strong>Consejo:</strong> Sé específico en tus notas. Un buen diagnóstico ayuda en futuras
                              reparaciones del mismo equipo y genera confianza con el cliente.
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Use Case 3 */}
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-start gap-3">
                      <Package className="h-6 w-6 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                          3. Uso de Inventario
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertCircle className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Registra piezas utilizadas en cada reparación</p>
                            </TooltipContent>
                          </Tooltip>
                        </h3>
                        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              1
                            </Badge>
                            <p>
                              Dentro de la orden, ve a la sección <strong>"Piezas Utilizadas"</strong>
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              2
                            </Badge>
                            <p>Busca la pieza por código o nombre en el inventario disponible</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              3
                            </Badge>
                            <p>Indica la cantidad utilizada - el sistema actualizará el stock automáticamente</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              4
                            </Badge>
                            <p>
                              Si falta una pieza, márcala como <strong>"Pendiente"</strong> para que recepción la
                              solicite
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                          <p className="text-sm text-green-800 dark:text-green-200 flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>
                              <strong>Consejo:</strong> Registra las piezas inmediatamente después de usarlas para
                              mantener el inventario preciso y evitar desabastecimiento.
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Use Case 4 */}
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-start gap-3">
                      <Clock className="h-6 w-6 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                          4. Gestión de Tiempo
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertCircle className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Registra el tiempo invertido en cada reparación</p>
                            </TooltipContent>
                          </Tooltip>
                        </h3>
                        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              1
                            </Badge>
                            <p>Al iniciar una reparación, el sistema registra automáticamente la hora de inicio</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              2
                            </Badge>
                            <p>Puedes pausar el cronómetro si necesitas atender otra orden urgente</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              3
                            </Badge>
                            <p>Al completar, revisa el tiempo total y ajústalo si es necesario</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              4
                            </Badge>
                            <p>
                              Consulta tu historial de tiempos en <strong>"Mi Desempeño"</strong> para mejorar
                              eficiencia
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                          <p className="text-sm text-green-800 dark:text-green-200 flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>
                              <strong>Consejo:</strong> El registro preciso de tiempos ayuda a mejorar estimaciones
                              futuras y optimizar la carga de trabajo del taller.
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Receptionist Content */}
            <TabsContent value="receptionist" className="mt-6 space-y-6">
              <Card className="border-purple-200 dark:border-purple-800">
                <CardHeader className="bg-purple-50 dark:bg-purple-950">
                  <div className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    <div>
                      <CardTitle className="text-2xl">Recepcionista</CardTitle>
                      <CardDescription>Atención al cliente y coordinación de servicios</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Use Case 1 */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <ClipboardList className="h-6 w-6 text-purple-600 dark:text-purple-400 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                          1. Crear Órdenes de Servicio
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertCircle className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Registra nuevas solicitudes de servicio de clientes</p>
                            </TooltipContent>
                          </Tooltip>
                        </h3>
                        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              1
                            </Badge>
                            <p>
                              Haz clic en <strong>"Nueva Orden"</strong> desde el dashboard o menú de órdenes
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              2
                            </Badge>
                            <p>Busca el cliente existente o crea uno nuevo con sus datos de contacto</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              3
                            </Badge>
                            <p>Registra los datos del equipo: marca, modelo, número de serie</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              4
                            </Badge>
                            <p>Describe el problema reportado por el cliente y establece la prioridad</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              5
                            </Badge>
                            <p>Asigna un técnico disponible y proporciona un tiempo estimado al cliente</p>
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
                          <p className="text-sm text-purple-800 dark:text-purple-200 flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>
                              <strong>Consejo:</strong> Sé detallado al describir el problema. Información precisa ayuda
                              al técnico a prepararse mejor y acelera la reparación.
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Use Case 2 */}
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-start gap-3">
                      <UserPlus className="h-6 w-6 text-purple-600 dark:text-purple-400 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                          2. Gestión de Clientes
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertCircle className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Administra la base de datos de clientes y sus equipos</p>
                            </TooltipContent>
                          </Tooltip>
                        </h3>
                        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              1
                            </Badge>
                            <p>
                              Accede a <strong>Recepción → Clientes</strong> para ver todos los clientes registrados
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              2
                            </Badge>
                            <p>Usa la búsqueda rápida por nombre, teléfono o email</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              3
                            </Badge>
                            <p>Visualiza el historial completo de órdenes de cada cliente</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              4
                            </Badge>
                            <p>Actualiza información de contacto cuando el cliente lo solicite</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              5
                            </Badge>
                            <p>Registra múltiples equipos por cliente para referencias futuras</p>
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
                          <p className="text-sm text-purple-800 dark:text-purple-200 flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>
                              <strong>Consejo:</strong> Mantén actualizada la información de contacto. Facilita la
                              comunicación sobre el estado de las reparaciones.
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Use Case 3 */}
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                          3. Coordinación y Seguimiento
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertCircle className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Monitorea el progreso de órdenes y coordina entregas</p>
                            </TooltipContent>
                          </Tooltip>
                        </h3>
                        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              1
                            </Badge>
                            <p>
                              Revisa el <strong>Dashboard</strong> para ver todas las órdenes activas y su estado
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              2
                            </Badge>
                            <p>Identifica órdenes retrasadas o con prioridad alta que requieren atención</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              3
                            </Badge>
                            <p>Contacta a clientes cuando su equipo esté listo para recoger</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              4
                            </Badge>
                            <p>Coordina con técnicos si hay cambios en prioridades o urgencias</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              5
                            </Badge>
                            <p>Programa recordatorios para seguimiento de órdenes pendientes</p>
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
                          <p className="text-sm text-purple-800 dark:text-purple-200 flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>
                              <strong>Consejo:</strong> Comunica proactivamente con los clientes. Una llamada
                              anticipando retrasos genera más confianza que esperar a que ellos pregunten.
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Use Case 4 */}
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-start gap-3">
                      <Phone className="h-6 w-6 text-purple-600 dark:text-purple-400 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                          4. Atención y Comunicación
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertCircle className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Gestiona consultas y mantén informados a los clientes</p>
                            </TooltipContent>
                          </Tooltip>
                        </h3>
                        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              1
                            </Badge>
                            <p>Responde consultas de clientes sobre el estado de sus órdenes</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              2
                            </Badge>
                            <p>Proporciona cotizaciones basadas en el diagnóstico del técnico</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              3
                            </Badge>
                            <p>Registra todas las interacciones en las notas de la orden</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              4
                            </Badge>
                            <p>Envía notificaciones automáticas cuando cambie el estado de una orden</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              5
                            </Badge>
                            <p>Gestiona quejas o reclamos con profesionalismo y documenta las soluciones</p>
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
                          <p className="text-sm text-purple-800 dark:text-purple-200 flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>
                              <strong>Consejo:</strong> La comunicación clara y oportuna es clave. Explica términos
                              técnicos en lenguaje simple para que el cliente entienda el servicio.
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Client Content */}
            <TabsContent value="client" className="mt-6 space-y-6">
              <Card className="border-orange-200 dark:border-orange-800">
                <CardHeader className="bg-orange-50 dark:bg-orange-950">
                  <div className="flex items-center gap-3">
                    <User className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                    <div>
                      <CardTitle className="text-2xl">Cliente</CardTitle>
                      <CardDescription>Portal de autoservicio y seguimiento de reparaciones</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Use Case 1 */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Smartphone className="h-6 w-6 text-orange-600 dark:text-orange-400 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                          1. Crear Solicitud de Servicio
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertCircle className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Solicita reparación de tus equipos de forma rápida y sencilla</p>
                            </TooltipContent>
                          </Tooltip>
                        </h3>
                        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              1
                            </Badge>
                            <p>
                              Haz clic en <strong>"Nueva Solicitud"</strong> desde tu dashboard
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              2
                            </Badge>
                            <p>Selecciona si el equipo ya está registrado o es uno nuevo</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              3
                            </Badge>
                            <p>Si es nuevo, ingresa marca, modelo y número de serie del equipo</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              4
                            </Badge>
                            <p>Describe el problema con el mayor detalle posible</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              5
                            </Badge>
                            <p>Indica la urgencia y envía la solicitud - recibirás confirmación inmediata</p>
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
                          <p className="text-sm text-orange-800 dark:text-orange-200 flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>
                              <strong>Consejo:</strong> Cuanto más detallada sea tu descripción del problema, más rápido
                              podremos diagnosticar y reparar tu equipo.
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Use Case 2 */}
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-start gap-3">
                      <ClipboardList className="h-6 w-6 text-orange-600 dark:text-orange-400 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                          2. Seguimiento de Órdenes
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertCircle className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Monitorea el progreso de tus reparaciones en tiempo real</p>
                            </TooltipContent>
                          </Tooltip>
                        </h3>
                        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              1
                            </Badge>
                            <p>
                              En tu <strong>Dashboard</strong> verás todas tus órdenes activas con su estado actual
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              2
                            </Badge>
                            <p>
                              Los estados son: <Badge className="mx-1">Recibida</Badge>{" "}
                              <Badge className="mx-1">En Diagnóstico</Badge>{" "}
                              <Badge className="mx-1">En Reparación</Badge> <Badge className="mx-1">Lista</Badge>
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              3
                            </Badge>
                            <p>Haz clic en una orden para ver detalles completos y notas del técnico</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              4
                            </Badge>
                            <p>Recibirás notificaciones automáticas cuando el estado cambie</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              5
                            </Badge>
                            <p>Puedes agregar comentarios o preguntas en cualquier momento</p>
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
                          <p className="text-sm text-orange-800 dark:text-orange-200 flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>
                              <strong>Consejo:</strong> Activa las notificaciones para recibir actualizaciones
                              instantáneas sobre el progreso de tu reparación.
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Use Case 3 */}
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-start gap-3">
                      <History className="h-6 w-6 text-orange-600 dark:text-orange-400 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                          3. Historial de Servicios
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertCircle className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Accede al historial completo de reparaciones de tus equipos</p>
                            </TooltipContent>
                          </Tooltip>
                        </h3>
                        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              1
                            </Badge>
                            <p>
                              Ve a <strong>"Historial"</strong> para ver todas tus órdenes pasadas
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              2
                            </Badge>
                            <p>Filtra por equipo, fecha o tipo de servicio para encontrar reparaciones específicas</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              3
                            </Badge>
                            <p>Revisa diagnósticos anteriores y trabajos realizados en cada equipo</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              4
                            </Badge>
                            <p>Descarga facturas y comprobantes de servicios completados</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              5
                            </Badge>
                            <p>Usa el historial como referencia para futuras reparaciones</p>
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
                          <p className="text-sm text-orange-800 dark:text-orange-200 flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>
                              <strong>Consejo:</strong> Guarda tus facturas digitales. Son útiles para garantías y para
                              llevar un registro del mantenimiento de tus equipos.
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Use Case 4 */}
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-start gap-3">
                      <MessageSquare className="h-6 w-6 text-orange-600 dark:text-orange-400 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                          4. Gestión de Equipos
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertCircle className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Administra la información de todos tus equipos registrados</p>
                            </TooltipContent>
                          </Tooltip>
                        </h3>
                        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              1
                            </Badge>
                            <p>
                              Accede a <strong>"Mis Equipos"</strong> para ver todos tus dispositivos registrados
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              2
                            </Badge>
                            <p>Cada equipo muestra su historial completo de reparaciones y mantenimientos</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              3
                            </Badge>
                            <p>Actualiza información del equipo si es necesario (modelo, número de serie)</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              4
                            </Badge>
                            <p>Agrega notas personales sobre cada equipo para tu referencia</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5">
                              5
                            </Badge>
                            <p>Crea solicitudes rápidas seleccionando un equipo existente</p>
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
                          <p className="text-sm text-orange-800 dark:text-orange-200 flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>
                              <strong>Consejo:</strong> Mantén actualizada la información de tus equipos. Facilita el
                              proceso cuando necesites solicitar un nuevo servicio.
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TooltipProvider>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>¿Necesitas ayuda adicional? Contacta a soporte técnico o consulta con tu administrador.</p>
        </div>
      </div>
    </div>
  )
}
