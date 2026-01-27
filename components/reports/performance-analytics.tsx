"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MetricCard, BarChartComponent, LineChartComponent, AreaChartComponent } from "./chart-components"
import { Activity, Zap, Target, Award, Users, TrendingUp } from "lucide-react"

interface PerformanceData {
  overallEfficiency: number
  qualityScore: number
  productivityIndex: number
  resourceUtilization: number
  technicianPerformance: Array<{
    name: string
    ordersCompleted: number
    avgResolutionTime: number
    qualityRating: number
    efficiency: number
  }>
  departmentMetrics: Array<{
    department: string
    productivity: number
    quality: number
    efficiency: number
  }>
  performanceTrends: Array<{
    week: string
    efficiency: number
    quality: number
    productivity: number
  }>
  benchmarkComparison: Array<{
    metric: string
    current: number
    target: number
    industry: number
  }>
}

interface PerformanceAnalyticsProps {
  data: PerformanceData
}

export function PerformanceAnalytics({ data }: PerformanceAnalyticsProps) {
  const getPerformanceColor = (score: number, threshold1 = 85, threshold2 = 70) => {
    if (score >= threshold1) return "default"
    if (score >= threshold2) return "secondary"
    return "destructive"
  }

  const getPerformanceLevel = (score: number) => {
    if (score >= 90) return "Excelente"
    if (score >= 80) return "Bueno"
    if (score >= 70) return "Regular"
    return "Necesita Mejora"
  }

  return (
    <div className="space-y-6">
      {/* KPIs de Rendimiento */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Eficiencia Operacional"
          value={`${data.overallEfficiency}%`}
          description="Índice de eficiencia general del equipo"
          trend="up"
          trendValue="3% vs mes anterior"
          icon={<Zap className="h-4 w-4" />}
          tooltip="Métrica compuesta que evalúa tiempo de resolución, utilización de recursos y cumplimiento de objetivos."
        />
        <MetricCard
          title="Índice de Calidad"
          value={`${data.qualityScore}/100`}
          description="Puntuación de calidad del servicio"
          trend="up"
          trendValue="2 puntos vs mes anterior"
          icon={<Award className="h-4 w-4" />}
          tooltip="Evaluación basada en satisfacción del cliente, retrabajos y cumplimiento de estándares técnicos."
        />
        <MetricCard
          title="Productividad"
          value={`${data.productivityIndex}`}
          description="Órdenes procesadas por técnico/día"
          trend="up"
          trendValue="0.5 vs mes anterior"
          icon={<Activity className="h-4 w-4" />}
          tooltip="Promedio de órdenes completadas por técnico por día hábil, ajustado por complejidad."
        />
        <MetricCard
          title="Utilización de Recursos"
          value={`${data.resourceUtilization}%`}
          description="Aprovechamiento de capacidad instalada"
          trend="neutral"
          trendValue="Estable"
          icon={<Target className="h-4 w-4" />}
          tooltip="Porcentaje de tiempo productivo vs tiempo disponible de recursos técnicos y equipamiento."
        />
      </div>

      {/* Tendencias de Rendimiento */}
      <div className="grid gap-6 md:grid-cols-2">
        <LineChartComponent
          data={data.performanceTrends}
          xKey="week"
          yKey="efficiency"
          title="Evolución de Eficiencia Semanal"
          description="Tendencia de eficiencia operacional por semana"
          color="#3b82f6"
        />
        <AreaChartComponent
          data={data.performanceTrends}
          xKey="week"
          yKey="quality"
          title="Tendencia de Calidad del Servicio"
          description="Evolución del índice de calidad semanal"
          color="#10b981"
        />
      </div>

      {/* Rendimiento por Técnico */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Análisis de Rendimiento Individual
          </CardTitle>
          <CardDescription>Métricas de productividad y calidad por técnico</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.technicianPerformance.map((tech, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{tech.name}</h4>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>Órdenes: {tech.ordersCompleted}</span>
                    <span>Tiempo Promedio: {tech.avgResolutionTime}h</span>
                    <span>Calidad: {tech.qualityRating}/5.0</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getPerformanceColor(tech.efficiency)}>
                    {tech.efficiency}% - {getPerformanceLevel(tech.efficiency)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Comparación con Benchmarks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Comparación con Benchmarks de Industria
          </CardTitle>
          <CardDescription>Posicionamiento vs estándares del sector y objetivos internos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.benchmarkComparison.map((benchmark, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{benchmark.metric}</span>
                  <div className="flex items-center gap-4 text-sm">
                    <span>
                      Actual: <strong>{benchmark.current}%</strong>
                    </span>
                    <span>
                      Objetivo: <strong>{benchmark.target}%</strong>
                    </span>
                    <span>
                      Industria: <strong>{benchmark.industry}%</strong>
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full relative"
                    style={{ width: `${Math.min(benchmark.current, 100)}%` }}
                  >
                    <div
                      className="absolute top-0 w-1 h-2 bg-green-500"
                      style={{ left: `${Math.min(benchmark.target, 100)}%` }}
                    />
                    <div
                      className="absolute top-0 w-1 h-2 bg-orange-500"
                      style={{ left: `${Math.min(benchmark.industry, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Métricas por Departamento */}
      <Card>
        <CardHeader>
          <CardTitle>Rendimiento por Departamento</CardTitle>
          <CardDescription>Comparación de métricas clave entre áreas operativas</CardDescription>
        </CardHeader>
        <CardContent>
          <BarChartComponent
            data={data.departmentMetrics}
            xKey="department"
            yKey="efficiency"
            title=""
            color="#8b5cf6"
          />
        </CardContent>
      </Card>
    </div>
  )
}
