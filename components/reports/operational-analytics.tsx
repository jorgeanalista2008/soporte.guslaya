"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MetricCard, LineChartComponent, PieChartComponent } from "./chart-components"
import { Clock, Wrench, AlertTriangle, CheckCircle, Users } from "lucide-react"

interface OperationalData {
  avgResolutionTime: number
  slaCompliance: number
  firstCallResolution: number
  technicianUtilization: number
  workloadDistribution: Array<{
    technician: string
    activeOrders: number
    completedToday: number
    efficiency: number
  }>
  resolutionTrends: Array<{
    week: string
    avgHours: number
    slaTarget: number
  }>
  priorityDistribution: Array<{
    priority: string
    count: number
    avgResolution: number
  }>
  statusFlow: Array<{
    status: string
    count: number
    avgDuration: number
  }>
}

interface OperationalAnalyticsProps {
  data: OperationalData
}

export function OperationalAnalytics({ data }: OperationalAnalyticsProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "crítica":
        return "destructive"
      case "alta":
        return "secondary"
      case "media":
        return "outline"
      case "baja":
        return "default"
      default:
        return "default"
    }
  }

  return (
    <div className="space-y-6">
      {/* KPIs Operacionales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Tiempo Promedio de Resolución"
          value={`${data.avgResolutionTime}h`}
          description="Tiempo medio desde recepción hasta entrega"
          trend="down"
          trendValue="12% vs mes anterior"
          icon={<Clock className="h-4 w-4" />}
          tooltip="Métrica clave de eficiencia operacional. Incluye tiempo de diagnóstico, reparación y pruebas."
        />
        <MetricCard
          title="Cumplimiento SLA"
          value={`${data.slaCompliance}%`}
          description="Órdenes completadas dentro del tiempo acordado"
          trend="up"
          trendValue="5% vs mes anterior"
          icon={<CheckCircle className="h-4 w-4" />}
          tooltip="Porcentaje de órdenes entregadas dentro del tiempo de servicio acordado con el cliente."
        />
        <MetricCard
          title="Resolución en Primera Visita"
          value={`${data.firstCallResolution}%`}
          description="Problemas resueltos sin requerir seguimiento"
          trend="up"
          trendValue="8% vs mes anterior"
          icon={<Wrench className="h-4 w-4" />}
          tooltip="Indicador de calidad técnica. Mide la efectividad del diagnóstico inicial."
        />
        <MetricCard
          title="Utilización de Técnicos"
          value={`${data.technicianUtilization}%`}
          description="Capacidad operativa utilizada"
          trend="neutral"
          trendValue="Estable"
          icon={<Users className="h-4 w-4" />}
          tooltip="Porcentaje de tiempo productivo vs tiempo disponible del equipo técnico."
        />
      </div>

      {/* Gráficos de Tendencias */}
      <div className="grid gap-6 md:grid-cols-2">
        <LineChartComponent
          data={data.resolutionTrends}
          xKey="week"
          yKey="avgHours"
          title="Tendencia de Tiempos de Resolución"
          description="Evolución semanal del tiempo promedio de resolución vs objetivo SLA"
          color="#f59e0b"
        />
        <PieChartComponent
          data={data.priorityDistribution}
          dataKey="count"
          nameKey="priority"
          title="Distribución por Prioridad"
          description="Clasificación de órdenes según nivel de urgencia"
          colors={["#ef4444", "#f59e0b", "#3b82f6", "#10b981"]}
        />
      </div>

      {/* Análisis de Carga de Trabajo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Análisis de Carga de Trabajo por Técnico
          </CardTitle>
          <CardDescription>Distribución de órdenes activas y rendimiento individual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.workloadDistribution.map((tech, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{tech.technician}</h4>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>Órdenes Activas: {tech.activeOrders}</span>
                    <span>Completadas Hoy: {tech.completedToday}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={tech.efficiency >= 85 ? "default" : tech.efficiency >= 70 ? "secondary" : "destructive"}
                  >
                    {tech.efficiency}% Eficiencia
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Flujo de Estados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Análisis de Flujo de Estados
          </CardTitle>
          <CardDescription>Tiempo promedio en cada etapa del proceso de reparación</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {data.statusFlow.map((status, index) => (
              <div key={index} className="p-4 border rounded-lg text-center">
                <h4 className="font-medium text-sm">{status.status}</h4>
                <div className="text-2xl font-bold mt-2">{status.count}</div>
                <div className="text-xs text-muted-foreground mt-1">Promedio: {status.avgDuration}h</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
